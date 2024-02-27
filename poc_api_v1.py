import imp
import sys
#import json
import logging
from configparser import ConfigParser

#import flask
from flask import Flask, request
import pandas as pd

logging.basicConfig(filename="POC_Digital_Twin\log_pvt_data_resetter.log", datefmt='%Y-%m-%d %I:%M:%S %p %Z', \
     level=logging.INFO, format='%(levelname)s : %(asctime)s : %(message)s', filemode='a')
LOG = logging.getLogger()

CONFIG = ConfigParser()
CONFIG.read('POC_Digital_Twin\config.ini')

try:
    syn_data_file = CONFIG['Files']['syn_data_file']
    churn_data_file = CONFIG['Files']['churn_data_file']
    func_data_file = CONFIG['Files']['func_data_file']
except Exception as exe:
    LOG.error(exe)
    print('One or more Parameters are missing/parameter dtype mismatch happened.')
    sys.exit()

app = Flask(__name__)

churn_df = pd.read_csv(churn_data_file, names=['Date', 'churn_rate', 'churn_bucket','cust_sentiment'], skiprows=1)

fin_df = pd.read_csv(func_data_file, header=[0])
fin_df.columns = map(str.lower, fin_df.columns)

consum_df = pd.read_csv(syn_data_file, header=[0], delimiter=',')
#overview = df[].groupby(['Date'])['NumberOfCalls_O', 'Duration_O_min', 'NumberOfCalls_I', 'Duration_I_min', 'DataUsage', 'ComplaintCalls', 'SMS_sent', 'SMS_received', 'Services'].mean()
consum_df.columns = map(str.lower, consum_df.columns)

#df = pd.read_csv(syn_data_file, header=[0], delimiter=',')
#print(df.head(5))

@app.route('/analytics/con_behavior', methods=['GET'])
def analytics_behavior_default():
    response = {'overview_vals': {'customer_base': churn_df.Date.nunique(), 
                                'total_churn': churn_df.churn_rate.mean(), 
                                'churn_per': churn_df.churn_bucket.mean(),
                                'avg_sentiment': churn_df.cust_sentiment.mean()}, 
                'financials_vals': {'revenue': fin_df.revenue.mean(),
                                'spending_atl': fin_df.atl.mean(),
                                'spending_btl': fin_df.btl.mean(),
                                'spending_oths': fin_df.others.mean()}}
    LOG.info('Analytics Page is loaded with full data')
    return response

@app.route('/analytics/con_behavior', methods=['POST'])
def analytics_behavior_post():
    #quaters = {'Q1': ''}
    #fin_df.columns = [x.lower() for x in fin_df.columns]
    #df = pd.read_csv(syn_data_file, header=[0], delimiter=',')
    #df.groupby()
    #print(df.head(5))

    from_date = request.data.get('FromDate')
    to_date = request.data.get('ToDate')
    
    response = {'overview_vals': {'customer_base': churn_df.Date.nunique(), 
                                'total_churn': churn_df.churn_rate.mean(), 
                                'churn_per': churn_df.churn_bucket.mean(),
                                'avg_sentiment': churn_df.cust_sentiment.mean()}, 
                'financials_vals': {'revenue': fin_df.revenue.mean(),
                                'spending_atl': fin_df.atl.mean(),
                                'spending_btl': fin_df.btl.mean(),
                                'spending_oths': fin_df.others.sum()}}
    LOG.info('Analytics Page is loaded with full data')
    return response

@app.route('/analytics/consumption', methods=['GET'])
def analytics_consumption_total():
    #consumption_type = request.form.get('Consumption')
    consumption_vals = {'voice_calls': int(consum_df.numberofcalls_o.sum()),
                        'data_usage': int(consum_df.datausage.sum()),
                        'call_duration': int(consum_df.duration_o_min.sum()),
                        'sms': int(consum_df.sms_sent.sum()),
                        'services': int(consum_df.services.sum())}
    LOG.info('Analytics Page is loaded with the consumption data with total data')
    #print(consumption_vals)
    return consumption_vals

@app.route('/analytics/consumption', methods=['POST'])
def analytics_consumption_avg():
    #consumption_type = request.form.get('Consumption')
    consumption_vals = {'voice_calls': consum_df.numberofcalls_o.mean(),
                        'data_usage': consum_df.datausage.mean(),
                        'call_duration': consum_df.duration_o_min.mean(),
                        'sms': consum_df.sms_sent.mean(),
                        'services': consum_df.services.mean()}
    #print(consumption_vals)
    LOG.info('Analytics Page is loaded with the consumption data with average data')
    return consumption_vals

if __name__ == "__main__":
    print("Server is running on localhost!!")
    app.run(debug=True, host='127.0.0.1', port=5050)
