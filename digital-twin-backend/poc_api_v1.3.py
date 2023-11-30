import os
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
#from churn_updated_00 import churn_updated as model

logging.basicConfig(filename="log_pvt_data_resetter.log", datefmt='%Y-%m-%d %I:%M:%S %p %Z', \
     level=logging.INFO, format='%(levelname)s : %(asctime)s : %(message)s', filemode='a')
LOG = logging.getLogger()

CONFIG = ConfigParser()
CONFIG.read('config.ini')

try:
    churn_data_file = CONFIG['Files']['churn_data_file']
    func_data_file = CONFIG['Files']['func_data_file']
    syn_data_file = CONFIG['Files']['syn_data_file']
    model_path = CONFIG['Files']['model_path']
except Exception as exe:
    LOG.error(exe)
    print('One or more Parameters are missing/parameter dtype mismatch happened.')
    sys.exit()

app = Flask(__name__)
CORS(app)

churn_df = pd.read_csv(churn_data_file, names=['date', 'churn_rate', 'churn_bucket','cust_sentiment'], skiprows=1,  delimiter=',')
churn_df['date'] = pd.to_datetime(churn_df['date'], dayfirst=True, format='%d-%m-%Y').dt.date
churn_df['month'] = pd.DatetimeIndex(churn_df['date']).month

fin_df = pd.read_csv(func_data_file, names=['monthly', 'revenue', 'atl', 'btl', 'others'], skiprows=1, delimiter=',')
lower_ma = [m.lower() for m in month_abbr]
fin_df['month'] = fin_df['monthly'].str.lower().map(lambda m: lower_ma.index(m)).astype('Int8')

consum_df = pd.read_csv(syn_data_file, names=['customerid', 'date', 'numberofcalls_o', 'duration_o_min', 'numberofcalls_i', 'duration_i_min', 'datausage', 'complaintcalls', 'sms_sent', 'sms_received', 'services'], skiprows=1, delimiter=',' )
consum_df['date'] = pd.to_datetime(consum_df['date'], infer_datetime_format=True).dt.date
consum_df['month'] = pd.DatetimeIndex(consum_df['date']).month

buckets = np.arange(0.0, 1.1, 0.1)


@app.route('/analytics/behavior', methods=['GET'])
def analytics_behavior():
    if request.method == 'GET':
        from_date = request.args.get('FromDate')
        to_date = request.args.get('ToDate')

        if from_date and to_date:
            LOG.info('Analytics behaviour GET method is triggered along with from and to dates!')
            from_date = datetime.strptime(from_date, '%d-%m-%Y').date()
            to_date = datetime.strptime(to_date,  '%d-%m-%Y').date()
            churn_df_s = churn_df.loc[(churn_df['date'] >= from_date) & (churn_df['date'] <= to_date)]
            fin_df_s = fin_df.loc[(fin_df['month'] >= from_date.month) & (fin_df['month'] <= to_date.month)]
            consum_df_s = consum_df.loc[(consum_df['date'] >= from_date) & (consum_df['date'] <= to_date)]

            churn_df_s['date'] = pd.to_datetime(churn_df_s.date).dt.strftime('%d-%m-%Y').astype(str)
            consum_df_s['date'] = pd.to_datetime(consum_df_s.date).dt.strftime('%d-%m-%Y').astype(str)
            response = {'overview_vals': {'customer_base': churn_df_s.date.nunique(),
                                        'total_churn': churn_df_s.churn_rate.mean(),
                                        'churn_per': churn_df_s.churn_bucket.mean(),
                                        'avg_sentiment': churn_df_s.cust_sentiment.mean()},
                        'financials_vals': {'revenue': fin_df_s.revenue.mean(),
                                        'spending_atl': fin_df_s.atl.mean(),
                                        'spending_btl': fin_df_s.btl.mean(),
                                        'spending_oths': fin_df_s.others.mean()},
                        'churn_profile_vals' : churn_df_s[['date', 'churn_rate']].to_dict(orient='records'),
                        'decile_distribution': consum_df_s.pivot_table(columns=pd.cut(consum_df_s['complaintcalls']/consum_df_s['complaintcalls'].max(), 
                                                                    bins=buckets, labels=[int(x*10) for x in buckets[1:]], 
                                                                    right=True, include_lowest=True), aggfunc='size').to_dict(),
                        'customer_spendings': {'calls': int(consum_df_s.numberofcalls_o.sum()),
                                            'sms': int(consum_df_s.sms_sent.sum()*10) ,
                                            'services': int(consum_df_s.services.sum()*2),
                                            'data': int(consum_df_s.datausage.sum())},
                        'cust_connect_vals': consum_df_s[['date', 'complaintcalls']].groupby('date').sum().reset_index().to_dict(orient='records')}
        else:
            LOG.info('Analytics behaviour GET method is triggered for full dataset!')
            response = {'overview_vals': {'customer_base': churn_df.date.nunique(), 
                                        'total_churn': churn_df.churn_rate.mean(),
                                        'churn_per': churn_df.churn_bucket.mean(),
                                        'avg_sentiment': churn_df.cust_sentiment.mean()}, 
                        'financials_vals': {'revenue': fin_df.revenue.mean(),
                                        'spending_atl': fin_df.atl.mean(),
                                        'spending_btl': fin_df.btl.mean(),
                                        'spending_oths': fin_df.others.mean()},
                        'churn_profile_vals': churn_df[['date', 'churn_rate']].to_dict(orient='records'),
                        'decile_distribution': consum_df.pivot_table(columns=pd.cut(consum_df['complaintcalls']/consum_df['complaintcalls'].max(), 
                                                                    bins=buckets, labels=[int(x*10) for x in buckets[1:]], 
                                                                    right=True, include_lowest=True), aggfunc='size').to_dict(),
                        'customer_spendings': {'calls': int(consum_df.numberofcalls_o.sum()),
                                            'sms':  int(consum_df.sms_sent.sum()*10) ,
                                            'services': int(consum_df.services.sum()*2),
                                            'data': int(consum_df.datausage.sum())},
                        'cust_connect_vals': consum_df[['date', 'complaintcalls']].groupby('date').sum().reset_index().to_dict(orient='records')}
    LOG.info('Analytics behaviour response %s is returned', response)
    return response

@app.route('/analytics/consumption', methods=['GET'])
def analytics_consumption():
    if request.method == 'GET':
        consumption_type = request.args.get('Consumption')
        from_date = request.args.get('FromDate')
        to_date = request.args.get('ToDate')

        if from_date and to_date:
            from_date = datetime.strptime(from_date, '%d-%m-%Y').date()
            to_date = datetime.strptime(to_date,  '%d-%m-%Y').date()

            consum_df_s = consum_df.loc[(consum_df['month'] >= from_date.month) & (consum_df['month'] < to_date.month)]
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
        else:
            LOG.info('Analytics consumption GET method is triggered for full dataset with Total of values!')
            if consumption_type == 'Average':
                LOG.info('Analytics consumption GET method is triggered along with from and to dates with Average of values!')
                response = {'voice_calls': consum_df.numberofcalls_o.mean(),
                            'data_usage': consum_df.datausage.mean(),
                            'call_duration': consum_df.duration_o_min.mean(),
                            'sms': consum_df.sms_sent.mean(),
                            'services': consum_df.services.mean()}
            elif consumption_type == 'Total':
                LOG.info('Analytics consumption GET method is triggered along with from and to dates with Total of values!')
                response = {'voice_calls': int(consum_df.numberofcalls_o.sum()),
                            'data_usage': int(consum_df.datausage.sum()),
                            'call_duration': int(consum_df.duration_o_min.sum()),
                            'sms': int(consum_df.sms_sent.sum()),
                            'services': int(consum_df.services.sum())}
    LOG.info('Analytics consumption response %s is returned', response)
    return response

@app.route('/simulation', methods=['GET'])
def simulation():
    try:
        #response = subprocess.Popen(model_path, shell=True)
        #response = model.wait()
        #subp = subprocess.run(model_path, shell=True, capture_output=True)
        #subp = subprocess.run(model_path, shell=True)
        #print(subp)
        #subp.wait()
        #return response
        os.system('python ' + model_path)
        os.waitpid()
    except Exception as exp:
        print(exp)
        LOG.error('Simulation api failed due to %s', exp)

if __name__ == "__main__":
    print("Server is running on localhost!!")
    app.run(debug=True, host='127.0.0.1', port=5050)
