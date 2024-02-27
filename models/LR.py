import sys
import json
import pandas as pd
from sklearn.linear_model import LinearRegression
 
df = pd.read_csv('data\syntheticdata_v1.csv')
df=df.drop(['Bearer Setup Failure Voice%','TIMESTAMP','Unnamed: 0'],axis=1)
lst = df.columns.to_list()
lst.remove('Avg_Connected_UEs')
 
data = df
mse_scores = {}
r2_scores = {}
predicted_values={}
actual_values={}
 
dependent_variables = lst
 
results = {}
 
def linear_regression(avg_connected_ue_value):
    for dependent_variable in dependent_variables:
 
        y = data[dependent_variable]  
        X = pd.DataFrame({'Avg_Connected_UEs': [avg_connected_ue_value]})
 
        linear_regressor = LinearRegression()
        linear_regressor.fit(data[['Avg_Connected_UEs']], y)
 
        predicted_value = linear_regressor.predict(X)
        if dependent_variable in ['HO Failures', 'HO_fail_InterFreq']:
            threshold = 0.5
            predicted_value = 1 if predicted_value >= threshold else 0
        else:
            predicted_value = round(predicted_value[0], 3)

        results[dependent_variable] = abs(predicted_value)
        
 
    network_utilization= results['PRB Util%'] + results['HO Failure%']
    results['network_utilization']=round(abs(network_utilization),3)
 
    network_coverage_map= (results['DL_Coverage_Ratio'] + results['UL_Coverage_Ratio'])/2
    results['network_coverage_map']=round(abs(network_coverage_map),3)
       
    call_drop= results['HO Failure%']
    results['call_drop']=round(abs(call_drop),3)
 
    dataspeed= 10 * results['Avg CQI']
    results['dataspeed']=round(abs(dataspeed),3)
       
    packetloss= results['DL Packet Loss Pct']
    results['packetloss']=round(abs(packetloss),3)
 
       
    res_uti= results['PRB Util%']
    results['res_uti']=round(abs(res_uti),3)
       
    qos_comp= 100- (results['ERAB Setup Fail%'] + results['QCI 1 Bearer Drop%'])
    results['qos_comp']=round(abs(qos_comp),3)
       
    qes_im= 8 * (results['HO Failure%'])
    results['qes_im']=round(abs(qes_im),3)
   
    return results
 
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python LR.py <avg_connected_ue_value>")
        sys.exit(1)
    avg_connected_ue_value = float(sys.argv[1])
    results = linear_regression(avg_connected_ue_value)
    print(results)