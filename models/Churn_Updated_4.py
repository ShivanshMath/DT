import mesa
import pandas as pd
from datetime import datetime
from mesa import time

import csv
customers = []
customer_ID=[]
date=[]
utility_values=[]
nominal_utility_values=[]
ltv_values= []
with open('data/Syn_Dataset1.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            pass #skips the column headers
            line_count += 1
        else: 
            customers.append(row)

class ABM_Agent(mesa.Agent):
    def __init__(self, unique_id,model,row,cost):
        super().__init__(unique_id, model)
        self.unique_id=unique_id
        self.CustomerID=int(row[0])
        self.Date=datetime.strptime(row[1], '%d-%m-%Y')
        self.Number_of_calls_O = int(row[2])
        self.Duration_outgoing_min=int(row[3])
        self.Number_of_calls_I=int(row[4])
        self.Duration_of_I_min=int(row[5])
        self.Data_usage=int(row[6])
        self.Complaint_calls=int(row[7])
        self.SMS_sent=int(row[8])
        self.SMS_received=int(row[9])
        self.month=str(row[10])
        self.x1=0.2
        self.x2=0.4
        self.x3=0.2
        self.x4=0.1
        self.x5=0.1
        self.weight_call_count = 0.5
        self.weight_call_duration = 0.1
        self.weight_data = 0.0067
        self.weight_sms = 1
        self.weight_complaint_calls =  5

        self.total_utility=0
        self.total_nominal_utility=0
        self.cost=cost
        self.cost_punit=0.05
        self.cost_call=cost_call
        self.cost_punit_call=0.05    
        self.cost_sms=cost_sms
        self.cost_punit_sms=0.05
        self.resolution_efficiency= resolution_efficiency
        self.resolution_efficiency_punit = 0.05      
        self.weight_call_Count_for_ltv = 1
        self.weight_call_duration_for_ltv = 0.2
        self.weight_data_for_ltv = 0.013
        self.Competitor_Offer = Competitor_offer
        self.Self_Offer = Self_offer

    def utility(self,customer_ID,date,utility_values,nominal_utility_values):
        self.total_utility=(Competitor_offer/Self_offer)*((self.x1*self.weight_call_count *self.Number_of_calls_O*(self.cost_call/self.cost_punit_call))+(self.x2*self.weight_data*self.Data_usage*(self.cost/self.cost_punit))+(self.x3*self.weight_complaint_calls*self.Complaint_calls*(self.resolution_efficiency/self.resolution_efficiency_punit))+(self.x4*self.weight_sms*self.SMS_sent*(self.cost_sms/self.cost_punit_sms))+(self.x5*self.SMS_received))
        self.total_nominal_utility=(self.x1*self.weight_call_count *self.Number_of_calls_O)+(self.x2*self.weight_data*self.Data_usage*(1))+(self.x3*self.weight_complaint_calls*self.Complaint_calls)+(self.x4*self.weight_sms*self.SMS_sent)+(self.x5*self.SMS_received)
        self.ltv_m=(self.weight_call_Count_for_ltv*self.Number_of_calls_O)+(self.weight_data_for_ltv*self.Data_usage)+(self.weight_call_duration_for_ltv*self.Duration_outgoing_min)
        
        
        customer_ID.append(self.CustomerID)
        date.append(self.month)
        utility_values.append(round(self.total_utility,4))
        nominal_utility_values.append(round(self.total_nominal_utility,4)) 
        ltv_values.append(round(self.ltv_m,4))

        
    
    def step(self):
        self.utility(customer_ID,date,utility_values,nominal_utility_values)      
        #self.nominal_utility(customer_ID,date,nominal_utility_values)
        #self.ltv(customer_ID,date,ltv_values)


class ABM_model(mesa.Model):
    def __init__(self,N,month,cost):
        self.num_agents = N
        self.schedule = mesa.time.RandomActivation(self)
        for i in range(N): 
            if customers[i][10]==month:
                a = ABM_Agent(i, self,customers[i],cost)
                self.schedule.add(a)
    def step(self):
        x=self.schedule.step()

month= input("Enter the Month in this format 'Mon'") # Month Selection
cost= float(input("Enter the cost: ")) # Data Rates
cost_call= float(input("Enter the call cost: ")) # Call Rates
cost_sms= float(input("Enter the sms cost: ")) # SMS Rates
resolution_efficiency = float(input("Enter average probability that CC executive is able to resovle query: ")) # CC Efficiency
Churn_Threshold = float(input("Enter the threshold for churn probability: ")) # Churn Threshold
Competitor1_offer = float(input("Enter the Competitor 1 Discount: ")) # Competitor 1 Offer
Competitor2_offer = float(input("Enter the Competitor 2 Discount: ")) # Competitor 2 Offer
Competitor_offer = max(Competitor1_offer,Competitor2_offer)
Self_offer = float(input("Enter the Self Discount: "))  # Self Offer

empty_model = ABM_model(len(customers),month,cost)
empty_model.step()


list1=list(zip(customer_ID,date,utility_values,nominal_utility_values,ltv_values))
df=pd.DataFrame(list1,columns=['CustomerId','Month','Utility','nominal_utility','ltv_values'])
df = df.sort_values(by = ["CustomerId","Month"])
df = df.reset_index(drop = True)
df.head()

df1 = df.groupby(["CustomerId","Month"])["Utility"].mean().reset_index()
df2 = df.groupby(["CustomerId","Month"])["nominal_utility"].mean().reset_index()
df3 = df.groupby(["CustomerId","Month"])["ltv_values"].mean().reset_index()

min_utility = min(min(df2['nominal_utility']),min(df1['Utility']))
max_utility = max(max(df2['nominal_utility']),max(df1['Utility']))
#(utilty - min utility / max utlity - min utility)
df1["Churn_Propensity"]=(df1['Utility']-min_utility)/(max_utility-min_utility) # Churn Propensity 
df1["Churn_Binary"]=df1["Churn_Propensity"]
df1["Churn_Binary"][df1["Churn_Binary"]<Churn_Threshold]=0
df1["Churn_Binary"][df1["Churn_Binary"]>0]=1
df1["Individual_Account_Revenue"] = (1-df1["Churn_Binary"])*60
df1["LTV"] = df3["ltv_values"] #LTV
df1["ChurnCount"] = ''
df1["ChurnCount"].iloc[0]= df1["Churn_Binary"].sum()
df1["TotalRevenue"] = ''
df1["TotalRevenue"].iloc[0]= df1["Individual_Account_Revenue"].sum()
df1["TotalLostRevenue"] = ''
df1["TotalLostRevenue"].iloc[0]= (df1["Churn_Binary"].sum())*60*12
df1["Expenses"] = ''
df1["Expenses"].iloc[0]= (df1["ChurnCount"].count())*(Self_offer*0.2)
df1["Survival_Curve"] = ''
df1["Survival_Curve"] = pd.Series([0.9,0.8,0.7,0.7,0.8,0.4,0.4,0.2,0.1,0.1,0.1,0.1])

'''
#Histogram
import matplotlib.pyplot as plt
plt.hist(df1['Churn_Propensity'], bins=10,histtype='bar', rwidth=0.9)
plt.xlabel('Churn_Propensity')
plt.ylabel('Count')
plt.title('Churn_Propensity count')
plt.show()
'''

df1 = df1.sort_values(by = ["CustomerId","Month"])
df1 = df1.reset_index(drop = True)
df1["Churn_Propensity"]=df1["Churn_Propensity"].round(4)
df1.to_csv("data/Churn_Propensity_updated.csv",index = False)

