import mesa
import pandas as pd
from datetime import datetime

import csv
customers = []
customer_ID=[]
date=[]
utility_values=[]
with open('Syn_Dataset1.csv') as csv_file:
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
        self.total_utility=0
        self.cost=cost
        self.cost_punit=0.05     
    
    def utility(self,customer_ID,date,utility_values):
        self.total_utility=(self.x1*self.Number_of_calls_O)+(self.x2*self.Data_usage*(self.cost/self.cost_punit))+(self.x3*self.Complaint_calls)+(self.x4*self.SMS_sent)+(self.x5*self.SMS_received)
        customer_ID.append(self.CustomerID)
        date.append(self.month)
        utility_values.append(round(self.total_utility,4))
               
    def step(self):
        self.utility(customer_ID,date,utility_values)      


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

month=input("Enter the Month in this format 'Mon'")
cost=float(input("Enter the cost: "))
empty_model = ABM_model(len(customers),month,cost)
empty_model.step()

list1=list(zip(customer_ID,date,utility_values))
df=pd.DataFrame(list1,columns=['CustomerId','Month','Utility'])

df1 = df.groupby(["CustomerId","Month"])["Utility"].mean().reset_index()

#(utilty - min utility / max utlity - min utility)
df1["Churn_Propensity"]=(df1['Utility']-min(df1['Utility']))/(max(df1['Utility'])-min(df1['Utility']))

#Histogram
# import matplotlib.pyplot as plt
# plt.hist(df1['Churn_Propensity'], bins=10,histtype='bar', rwidth=0.9)
# plt.xlabel('Churn_Propensity')
# plt.ylabel('Count')
# plt.title('Churn_Propensity count')
# plt.show()

df1 = df1.sort_values(by = ["CustomerId","Month"])
df1 = df1.reset_index(drop = True)
df1["Churn_Propensity"]=df1["Churn_Propensity"].round(4)
df1.to_csv("Churn_Propensity_updated.csv",index = False)

