import sys
import json
import pandas as pd
from sklearn.linear_model import LinearRegression
 
df = pd.read_csv('data\LR-model-dataset.csv')
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
 
        results[dependent_variable] = predicted_value[0]
    
    return results
 
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python LR.py <avg_connected_ue_value>")
        sys.exit(1)
    avg_connected_ue_value = float(sys.argv[1])
    results = linear_regression(avg_connected_ue_value)
    print(results)