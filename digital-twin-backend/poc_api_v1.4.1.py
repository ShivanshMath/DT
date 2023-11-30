"""
Author          : Potnuru Suresh Kumar
Description     : This to provide apis for the Analytics and Simulation dashboards for Incedo DigitalTwin POC.
Version         : v1.4.1
Version Desc    : Simulation API will take cost value along with month and returns a histogram by the model.
Params          : Analytics API takes to and from dates to filter data for the date range,
                  Consumption API takes the to and from dates to filter the data and also Total or Average parameter to return whether Sum/Mean values to dashboard,
                  Simulation API takes the month in the format of Jan/Feb/Mar/...etc to run the model with month as the parameter to generate Churn_propensity.
"""

import sys
import logging
import subprocess
from configparser import ConfigParser
from datetime import datetime
from calendar import month_abbr

from flask import Flask, request
from flask_cors import CORS
import numpy as np
import pandas as pd

today = datetime.today().strftime('%Y-%m-%d')
logging.basicConfig(filename="logs/Log_raising_MA_project_" + today + ".log",
                    datefmt='%Y-%m-%d %I:%M:%S %p %Z',
                    level=logging.INFO,
                    format='%(levelname)s : %(asctime)s : %(message)s',
                    filemode='a')
LOG = logging.getLogger()

CONFIG = ConfigParser()
CONFIG.read('config.ini')

try:
    churn_data_file = CONFIG['Files']['churn_data_file']
    func_data_file = CONFIG['Files']['func_data_file']
    syn_data_file = CONFIG['Files']['syn_data_file']

    model_path = CONFIG['Model']['model_path']
    model_output = CONFIG['Model']['model_output']

    ip = CONFIG['Env']['ip']
    port = CONFIG['Env']['port']
except Exception as exe:
    LOG.error(exe)
    print('One or more Parameters are missing/parameter dtype mismatch happened.')
    sys.exit()

app = Flask(__name__)
CORS(app)

churn_df = pd.read_csv(churn_data_file, names=['date', 'churn_rate', 'churn_bucket','cust_sentiment'], skiprows=1, delimiter=',', parse_dates=True, dayfirst=True)

fin_df = pd.read_csv(func_data_file, names=['monthly', 'revenue', 'atl', 'btl', 'others'], skiprows=1, delimiter=',')
lower_ma = [m.lower() for m in month_abbr]
fin_df['month'] = fin_df['monthly'].str.lower().map(lambda m: lower_ma.index(m)).astype('Int8')

consum_df = pd.read_csv(syn_data_file, names=['customerid', 'date', 'numberofcalls_o', 'duration_o_min', 'numberofcalls_i', 'duration_i_min', 'datausage', 'complaintcalls', 'sms_sent', 'sms_received', 'services'], skiprows=1, delimiter=',', converters={'date': str})
buckets = np.arange(0.0, 1.1, 0.1)

@app.route('/analytics/behavior', methods=['GET'])
def analytics_behavior():
    """
    This API takes To and From dates to filter the data in the source files and returns response for the Overview, Financials, 
    Churn Profile, Decile Distribution, Customer Spendings and Customer connect values in Dictionary format.
    """
    if request.method == 'GET':
        from_date = request.args.get('FromDate')
        to_date = request.args.get('ToDate')

        if from_date and to_date:
            LOG.info('Analytics behaviour GET method is triggered along with from and to dates!')
            from_date = datetime.strptime(from_date, '%d-%m-%Y').date()
            to_date = datetime.strptime(to_date,  '%d-%m-%Y').date()

            churn_df_s = churn_df.loc[(pd.to_datetime(churn_df['date'], format='%d-%m-%Y', infer_datetime_format=True).dt.date >= from_date) 
                                      & (pd.to_datetime(churn_df['date'], format='%d-%m-%Y', infer_datetime_format=True).dt.date < to_date)]

            fin_df_s = fin_df.loc[(fin_df['month'] >= from_date.month) & (fin_df['month'] < to_date.month)]

            consum_df_s = consum_df.loc[(pd.to_datetime(consum_df['date'], format='%d-%m-%Y', infer_datetime_format=True, dayfirst=True).dt.date >= from_date) 
                                        & (pd.to_datetime(consum_df['date'], format='%d-%m-%Y', infer_datetime_format=True, dayfirst=True).dt.date < to_date)]
            consum_df_s_decile_dist = consum_df_s[['customerid', 'complaintcalls']].groupby('customerid').sum().reset_index()

            response = {'overview_vals': {'customer_base': churn_df_s.date.nunique(),
                                        'total_churn': churn_df_s.churn_rate.mean(),
                                        'churn_per': churn_df_s.churn_bucket.mean(),
                                        'avg_sentiment': churn_df_s.cust_sentiment.mean()},
                        'financials_vals': {'revenue': fin_df_s.revenue.mean(),
                                        'spending_atl': fin_df_s.atl.mean(),
                                        'spending_btl': fin_df_s.btl.mean(),
                                        'spending_oths': fin_df_s.others.mean()},
                        'churn_profile_vals' : churn_df_s[['date', 'churn_rate']].to_dict(orient='records'),
                        'decile_distribution': consum_df_s_decile_dist.pivot_table(columns=pd.cut(
                                                                (consum_df_s_decile_dist['complaintcalls'] - consum_df_s_decile_dist['complaintcalls'].min())
                                                                    /(consum_df_s_decile_dist['complaintcalls'].max() - consum_df_s_decile_dist['complaintcalls'].min()),
                                                                bins=buckets, labels=[f"{x:.1f}" for x in buckets[1:]], 
                                                                right=True, include_lowest=True), aggfunc='size').to_dict(),
                        'customer_spendings': {'calls': int(consum_df_s.numberofcalls_o.sum()),
                                            'sms':  int(consum_df_s.sms_sent.sum()*10) ,
                                            'services': int(consum_df_s.services.sum()*2),
                                            'data': int(consum_df_s.datausage.sum())},
                        'cust_connect_vals': consum_df_s[['date', 'complaintcalls']].groupby('date').sum().reset_index().to_dict(orient='records')}
    LOG.info('Analytics behaviour response %s is returned', response)
    return response

@app.route('/analytics/consumption', methods=['GET'])
def analytics_consumption():
    """
    This API takes To and From dates to filter the data in the source files, also Total or Average parameter to return whether
    Sum/Mean values to the dashboard and returns response for the Consumption values in Dictionary format.
    """
    if request.method == 'GET':
        consumption_type = request.args.get('Consumption')
        from_date = request.args.get('FromDate')
        to_date = request.args.get('ToDate')

        if from_date and to_date:
            from_date = datetime.strptime(from_date, '%d-%m-%Y').date()
            to_date = datetime.strptime(to_date,  '%d-%m-%Y').date()

            consum_df_s = consum_df.loc[(pd.to_datetime(consum_df['date'], format='%d-%m-%Y', infer_datetime_format=True).dt.date >= from_date)
                                        & (pd.to_datetime(consum_df['date'], format='%d-%m-%Y', infer_datetime_format=True).dt.date < to_date)]

            if consumption_type == 'Average':
                LOG.info('Analytics consumption GET method is triggered along with from and to dates with Average of values!')
                response = {'voice_calls': consum_df_s.numberofcalls_o.mean(),
                            'data_usage': consum_df_s.datausage.mean(),
                            'call_duration': consum_df_s.duration_o_min.mean(),
                            'sms': consum_df_s.sms_sent.mean(),
                            'services': consum_df_s.services.mean()}
            elif consumption_type == 'Total':
                LOG.info('Analytics consumption GET method is triggered along with from and to dates with Total of values!')
                response = {'voice_calls': int(consum_df_s.numberofcalls_o.sum()),
                            'data_usage': int(consum_df_s.datausage.sum()),
                            'call_duration': int(consum_df_s.duration_o_min.sum()),
                            'sms': int(consum_df_s.sms_sent.sum()),
                            'services': int(consum_df_s.services.sum())}
    LOG.info('Analytics consumption response %s is returned', response)
    return response

@app.route('/simulation', methods=['GET'])
def simulation():
    """
    This API takes Month as parameter to execute the model for the month and generate Churn Propensity data in a file
    and returns the churn customers count with in 10 buckets to Simulation dashboard.
    """
    try:
        sim_month_type = request.args.get('month')
        cost = request.args.get('cost', default='0.05')

        subp = subprocess.run(["python3", model_path], text=True, input=sim_month_type + '\n' + cost)
        LOG.info('Model executed, execution details : %s', subp)

        sim_df = pd.read_csv(model_output, names=['custid', 'month', 'churn_prop'], skiprows=[0], delimiter=',')
        return {'churn_agg': {'avg_churn': sim_df['churn_prop'].mean(),
                              'min_churn': sim_df['churn_prop'].min(),
                              'max_churn': sim_df['churn_prop'].max()},
                'churn_prop': sim_df.pivot_table(columns=pd.cut(sim_df['churn_prop'],
                                                                bins=buckets,
                                                                labels=[f"{x:.1f}" for x in buckets[1:]], 
                                                                right=True,
                                                                include_lowest=True),
                                                                aggfunc='size').to_dict()}
    except Exception as exp:
        LOG.error('Simulation api failed due to %s', exp)

if __name__ == "__main__":
    LOG.info("Server is running on localhost!!")
    app.run(host=ip, port=port, debug=False)
