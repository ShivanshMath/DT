from Churn_ForOpt import *
import numpy as np
import pandas as pd 

df1=pd.DataFrame(columns=['Revenue','Churn','cost_Data','cost_Call'])
#def Churn_ForOpt(cost, cost_call, cost_sms, Competitor1_offer):

# Variables

#revenue_lb = 53000
#revenue_ub = 54000
lb_costdata = 0.01 # lower bound for data cost
ub_costdata = 1 # upper bound for data cost 
int_costdata = 0.4 # interval size for increment of data cost 

lb_costcall = 0.01 # lower bound for data cost
ub_costcall = 1 # upper bound for data cost 
int_costcall = 0.4 # interval size for increment of data cost 

min_churn =  1000 # starting point for churn value
max_revenue = 50

opt_objective_type = input("Enter the Objective function 'Revenue/Churn'") 
opt_criterion = input("Enter the criterian 'Min/Max'") 
data_rate_lb = float(input("Enter the data rate lower bound"))
data_rate_ub = float(input("Enter the data rate upper bound"))
call_rate_lb = float(input("Enter the call rate lower bound")) 
call_rate_ub = float(input("Enter the call rate upper bound")) 
SMS_rate_lb = float(input("Enter the SMS rate lower bound"))
SMS_rate_ub = float(input("Enter the SMS rate upper bound")) 
Offer_lb = float(input("Enter the Offer value lower bound")) 
Offer_ub = float(input("Enter the Offer value upper bound")) 
Constraint_lb = float(input("Enter the constraint lower bound")) 
Constraint_ub = float(input("Enter the constraint upper bound")) 

lb_costdata = data_rate_lb # lower bound for data cost
ub_costdata = data_rate_ub # upper bound for data cost 
int_costdata = 0.4 # interval size for increment of data cost 

lb_costcall = call_rate_lb # lower bound for call cost
ub_costcall = call_rate_ub # upper bound for call cost 
int_costcall = 0.4 # interval size for increment of call cost 

# Run the churn function to find minimum churn value 

for i_costdata in np.arange(lb_costdata,ub_costdata, int_costdata ):
    for i_costcall in np.arange(lb_costcall,ub_costcall, int_costcall ):
        (churn,revenue) = Churn_ForOpt(i_costdata, i_costcall,0.05,1050)
        series = {"Revenue" : revenue, "Churn" : churn, "cost_Data" : i_costdata, "cost_Call" :i_costcall , "avg_revenue" :  revenue/(1000-churn)  , "expenses" : 10*(1000-churn)  }
        df1= df1.append(series, ignore_index =  True)
        #df1.append({revenue,i_costdata,i_costcall})
        if revenue>max_revenue:
            data_cost,call_cost = i_costdata, i_costcall
            max_revenue = max(max_revenue,revenue)    
            
#print(min_churn)
#print(max_revenue)
sorted_df = df1.sort_values(by='Revenue',ascending = False)
sorted_df_maxones = sorted_df.head(3)
sorted_df_maxones.to_csv("opt2_output.csv",index = False)
# from mpl_toolkits.mplot3d import Axes3D
# import matplotlib.pyplot as plt
# from matplotlib import cm
# fig = plt.figure()
# ax = Axes3D(fig)
# ax.scatter3D(df1["cost_Data"], df1["cost_Call"],df1["Revenue"])
# plt.show()
# print(churn)
# from mpl_toolkits.mplot3d import Axes3D
# import matplotlib.pyplot as plt
# import numpy as np
# fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')
# P1 = np.array(df1["Revenue"])
# P1 = np.reshape(P1, (10,10))
# P = P1.astype(float)
# Y = np.array(df1["cost_Call"])
# Y = np.reshape(Y, (10,10))
# Y=Y.astype(float)
# X = np.array(df1["cost_Data"])
# X = np.reshape(X, (10,10))
# X=X.astype(float)
# ax.plot_surface(X,Y,P)
# plt.show()
# print(X)