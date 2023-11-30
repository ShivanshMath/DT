export const churnDataFormatter = (data) => {
  let churnData = [
    {
      type: "spline",
      name: "Churn Rate",
      data: [],
      color: "#6c5ce7",
    },
  ];
  let categories = [];
  for (const churn of data) {
    churnData[0]["data"].push(Number(churn.churn_rate.toFixed(2)));
    categories.push(churn.date);
  }
  return { churnData, categories };
};

export const callsConnectFormatter = (data) => {
  let customerConnectData = [
    {
      type: "area",
      name: "Customer Connect",
      data: [],
      color: "#7ed6df",
      dataGrouping: {
        enabled: false,
      },
    },
  ];
  for (const custConnect of data) {
    customerConnectData[0]["data"].push(custConnect.complaintcalls);
  }

  return customerConnectData;
};

export const customerSpendingsFormatter = (data) => {
  return [
    {
      name: "Data",
      y: data.data,
      color: "#0984e3",
    },
    {
      name: "Calls",
      y: data.calls,
      color: "#00cec9",
    },
    {
      name: "SMS",
      y: data.sms,
      color: "#fdcb6e",
    },
    {
      name: "Services",
      y: data.services,
      color: "#00b894",
    },
  ];
};

export const decileDistributionFormatter = (data) => {
  let categories = [];
  let decileData = [
    {
      type: "column",
      name: "events",
      data: [],
      color: "#6c5ce7",
    },
  ];

  for (const key in data) {
    categories.push(key);
    decileData[0]["data"].push(data[key]);
  }

  return { categories: categories, decileData: decileData };
};

// simulation churn propensity chart formatter
export const churnPropensityDataFormatter = (data) => {
  let churnPropensity = [
    {
      type: "column",
      name: "Churn Propensity",
      data: [],
      color: "#6c5ce7",
    },
  ];
  let categories = [];
  for (const key in data) {
    categories.push(key);
    churnPropensity[0]["data"].push(data[key]);
  }
  return { churnPropensity, categories };
};

// what-if ltv chart
export const ltvDataFormatter = (data) => {
  let ltvData = [
    {
      type: "column",
      name: "ltv",
      data: [],
      color: "#8e44ad",
    },
  ];
  let categories = [];
  for (const key in data) {
    categories.push(key);
    ltvData[0]["data"].push(data[key]);
  }
  return { ltvData, categories };
};

// what-if survival curve chart
export const survivalCurveDataFormatter = (data) => {
  let survivalData = [
    {
      type: "spline",
      name: "survival",
      data: [],
      color: "#8e44ad",
    },
  ];
  let categories = [];
  for (const key in data) {
    categories.push(key);
    survivalData[0]["data"].push(data[key]);
  }
  return { survivalData, categories };
};
