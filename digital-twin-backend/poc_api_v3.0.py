"""
Author          : Potnuru Suresh Kumar
Description     : This to provide apis for the Analytics and Simulation dashboards for Incedo DigitalTwin POC.
Version         : v0.5
Version Desc    : Simulation API will takes various other values along with month and cost value to run the model, also responds the data for survival_curve and ltv graphs.
Params          : Analytics API takes to and from dates to filter data for the date range,
                  Consumption API takes the to and from dates to filter the data and also Total or Average parameter to return whether Sum/Mean values to dashboard,
                  Simulation API takes the month in the format of Jan/Feb/Mar/...etc and various other parameters to run the model to generate Churn_propensity.
"""
 
import sys
import logging
import subprocess
from configparser import ConfigParser
from datetime import datetime
from calendar import month_abbr
 
from flask import Flask, make_response, request, jsonify
from flask_cors import CORS,cross_origin
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
    modelopt_path = CONFIG['Model']['modelopt_path']
    model_output = CONFIG['Model']['model_output']
    modelopt_output = CONFIG['Model']['modelopt_output']
 
    ip = CONFIG['Env']['ip']
    port = CONFIG['Env']['port']
except Exception as exe:
    LOG.error(exe)
    print('One or more Parameters are missing/parameter dtype mismatch happened.')
    sys.exit()
 
 
 
app = Flask(__name__)


cors = CORS(app, resources={r"/*": {"origins": "*"}})

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
                                                                (consum_df_s_decile_dist['complaintcalls']
                                                                    - consum_df_s_decile_dist['complaintcalls'].min())
                                                                    /(consum_df_s_decile_dist['complaintcalls'].max()
                                                                    - consum_df_s_decile_dist['complaintcalls'].min()),
                                                                bins=buckets,
                                                                labels=[f"{x:.1f}" for x in buckets[1:]],
                                                                right=True,
                                                                include_lowest=True),
                                                                aggfunc='size').to_dict(),
                        'customer_spendings': {'calls': int(consum_df_s.numberofcalls_o.sum()),
                                            'sms':  int(consum_df_s.sms_sent.sum()*10) ,
                                            'services': int(consum_df_s.services.sum()*2),
                                            'data': int(consum_df_s.datausage.sum())},
                        'cust_connect_vals': consum_df_s[['date', 'complaintcalls']].groupby('date').sum().reset_index().to_dict(orient='records')}
    LOG.info('Analytics behaviour response returned as : %s', response)
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
    LOG.info('Analytics consumption response returned as : %s', response)
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
        cost_call = request.args.get('call_rates',  default='0.05')
        cost_sms = request.args.get('sms_rates', default='0.05')
        resolution_efficiency = request.args.get('cc_efficiency', default='0.8')
        churn_threshold = request.args.get('churn_threshold', default='0.9')
        competitor1_offer = request.args.get('competitor1', default='1000')
        competitor2_offer = request.args.get('competitor2', default='1000')
        self_offer = request.args.get('self_offer', default='1000')
 
        LOG.info('Simulation api GET method is triggered!')
        subp = subprocess.run(["python3", model_path], text=True, input=sim_month_type + '\n' +
                                                                        cost + '\n' +
                                                                        cost_call + '\n' +
                                                                        cost_sms + '\n' +
                                                                        resolution_efficiency + '\n' +
                                                                        churn_threshold + '\n' +
                                                                        competitor1_offer + '\n' +
                                                                        competitor2_offer + '\n' +
                                                                        self_offer
                            )
        LOG.info('Model executed, execution details : %s', subp)
 
        cols = ['custid', 'month', 'utility', 'churn_prop', 'churn_binary', 'indiv_acc_revenue', 'ltv',
                'churn_count', 'total_revenue', 'total_lost_revenue', 'expenses', 'survival_curve']
        sim_df = pd.read_csv(model_output, names=cols, skiprows=[0], delimiter=',')
        sim_df.index += 1
 
        response =  {'churn_agg': {'churn_count': int(sim_df.at[1, 'churn_count']),
                                    'total_revenue': int(sim_df.at[1, 'total_revenue']),
                                    'total_lost_revenue': int(sim_df.at[1, 'total_lost_revenue']),
                                    'expenses': int(sim_df.at[1, 'expenses'])},
                    'churn_prop': sim_df.pivot_table(columns=pd.cut(sim_df['churn_prop'],
                                                bins=buckets,
                                                labels=[f"{x:.1f}" for x in buckets[1:]],
                                                right=True,
                                                include_lowest=True),
                                                aggfunc='size').to_dict(),
                    'survival_curve': sim_df['survival_curve'].iloc[0:12].to_dict(),
                    'ltv': sim_df.pivot_table(columns=pd.cut(
                                        (sim_df['ltv']
                                            - sim_df['ltv'].min())
                                            /(sim_df['ltv'].max()
                                            - sim_df['ltv'].min()),
                                        bins=buckets,
                                        labels=[f"{x:.1f}" for x in buckets[1:]],
                                        right=True,
                                        include_lowest=True),
                                        aggfunc='size').to_dict()}
        LOG.info('Simulation api response returned as : %s', response)
        return response
    except Exception as exp:
        LOG.error('Simulation api failed due to %s', exp)
 
 
@app.route('/optimization', methods=['GET'])
def optimization():
    """
    This API takes optimization objective, handles and constraints as parameter to execute the model
    and generate optimization output data in a file
    and returns it.
    """
    try:
        opt_objective_type = request.args.get('objective')
        opt_criterion = request.args.get('criterion')
        data_rate_lb = request.args.get('DR_lb')
        data_rate_ub = request.args.get('DR_ub')
        call_rate_lb = request.args.get('Call_lb')
        call_rate_ub = request.args.get('Call_ub')
        SMS_rate_lb = request.args.get('SMS_lb')
        SMS_rate_ub = request.args.get('SMS_ub')
        Offer_lb = request.args.get('Offer_lb')
        Offer_ub = request.args.get('Offer_ub')
        Constraint_lb = request.args.get('Constraint_lb')
        Constraint_ub = request.args.get('Constraint_ub')
 
        LOG.info('Optimization api GET method is triggered!')
        subp = subprocess.run(["python3", modelopt_path], text=True, input=opt_objective_type + '\n' +
                                                                        opt_criterion + '\n' +
                                                                        data_rate_lb + '\n' +
                                                                        data_rate_ub + '\n' +
                                                                        call_rate_lb + '\n' +
                                                                        call_rate_ub + '\n' +
                                                                        SMS_rate_lb + '\n' +
                                                                        SMS_rate_ub + '\n' +
                                                                        Offer_lb + '\n' +
                                                                        Offer_ub + '\n' +
                                                                        Constraint_lb + '\n' +
                                                                        Constraint_ub
                            )
        LOG.info('Optimization Model executed, execution details : %s', subp)
 
        cols = ['Revenue' , 'Churn',    'cost_Data',    'cost_Call',    'avg_revenue',  'expenses']
        sim_df = pd.read_csv(modelopt_output, names=cols, skiprows=[0], delimiter=',')
        # sim_df = pd.read_csv("opt2_output.csv", names=cols, skiprows=[0], delimiter=',')
        sim_df.index += 1
 
        response =  {'BestMaxRevenue': {'Revenue': sim_df.at[1, 'Revenue'],
                                    'Data_rates': sim_df.at[1, 'cost_Data'],
                                    'SMS_rates': sim_df.at[1, 'cost_Data'],
                                    'Call_rates': sim_df.at[1, 'cost_Call'],
                                    'Offer': sim_df.at[1, 'cost_Call'],
                                    'Churn_count': sim_df.at[1, 'Churn'],
                                    'Avg_ac_Rev': sim_df.at[1, 'avg_revenue'],
                                    'expenses': sim_df.at[1, 'expenses']},
                    'SecondBestMaxRevenue': {'Revenue': sim_df.at[2, 'Revenue'],
                                    'Data_rates': sim_df.at[2, 'cost_Data'],
                                    'SMS_rates': sim_df.at[2, 'cost_Data'],
                                    'Call_rates': sim_df.at[2, 'cost_Call'],
                                    'Offer': sim_df.at[2, 'cost_Call'],
                                    'Churn_count': sim_df.at[2, 'Churn'],
                                    'Avg_ac_Rev': sim_df.at[2, 'avg_revenue'],
                                    'expenses': sim_df.at[2, 'expenses']},
                    'ThirdBestMaxRevenue': {'Revenue': sim_df.at[3, 'Revenue'],
                                    'Data_rates': sim_df.at[3, 'cost_Data'],
                                    'SMS_rates': sim_df.at[3, 'cost_Data'],
                                    'Call_rates': sim_df.at[3, 'cost_Call'],
                                    'Offer': sim_df.at[3, 'cost_Call'],
                                    'Churn_count': sim_df.at[3, 'Churn'],
                                    'Avg_ac_Rev': sim_df.at[3, 'avg_revenue'],
                                    'expenses': sim_df.at[3, 'expenses']},
                    }
        LOG.info('Optimization api response returned as : %s', response)
        return response
    except Exception as exp:
        LOG.error('Optimization api failed due to %s', exp)


@app.route('/lr-model/<float:avg_connected_ue_value>', methods=['GET'])
def model_1(avg_connected_ue_value):
    try:
        result = subprocess.run(['python', 'models/LR.py', str(avg_connected_ue_value)], capture_output=True, text=True)
        if result.returncode == 0:
            return jsonify({'result': result.stdout})
            # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        else:
            return jsonify({'error': result.stderr}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
@app.route('/model-2', methods=['GET'])
def model_2():
    return "Model 2"
 
 
 
if __name__ == "__main__":
    LOG.info("Server is running on localhost!!")
    app.run(host=ip, port=port, debug=True)