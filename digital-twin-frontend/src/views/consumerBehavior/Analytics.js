import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Spin } from "antd";
import dayjs from "dayjs";
import InputSection from "../../components/analytics/inputSection";
import Overview from "../../components/analytics/Overview";
import Finance from "../../components/analytics/finance";
import Consumption from "../../components/analytics/consumption";
import Card from "../../components/UI/Card";
import Chart from "../../components/Charts/Chart";
import PieChart from "../../components/Charts/Piecharts";
import classes from "./Analytics.module.css";

// dataformatter
import {
  churnDataFormatter,
  callsConnectFormatter,
  customerSpendingsFormatter,
  decileDistributionFormatter,
} from "../helper/ChartdataFormatter";

import CONSTANT from "../../constant";

const dateFormat = "DD-MM-YYYY";
let initialRender = true;

const Analytics = () => {
  //input section state
  const [startDate, setStartDate] = useState(dayjs("01-01-2022", dateFormat));
  const [endDate, setEndDate] = useState(dayjs("31-12-2022", dateFormat));
  const [dataRangeDate, setDataRangeDate] = useState({});
  const [consumptionFilter, setConsumptionFilter] = useState("Total");
  const [overviewData, setOverviewData] = useState({});
  const [financialData, setFinancialData] = useState({});
  const [consumptionData, setConsumptionData] = useState({});

  // charts state
  const [churnProfile, setChurnProfile] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [customerSpendings, setCustomerSpendings] = useState([]);
  const [customerConnect, setCustomerConnect] = useState([]);
  const [decileDistribution, setDecileDistribution] = useState([]);
  const [decileCategories, setDecileCategories] = useState([]);

  const [loader, setLoader] = useState(false);

  // runs only for initial render
  useEffect(() => {
    applyDateFilter();

    return () => {
      initialRender = true;
    };
  }, []);

  const onStartDateSelect = (date, dateString) => {
    if (endDate && date > endDate) {
      setEndDate("");
    }
    setStartDate(date);
  };

  const applyDateFilter = async () => {
    setLoader(true);
    await fetchBehaviorData();
    await fetchConsumerData();
    setDataRangeDate({ startDate, endDate });
    setLoader(false);
  };

  // runs when consumption filter change
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      await fetchConsumerData();
      setLoader(false);
    };
    !initialRender && fetchData();
    initialRender = false;
  }, [consumptionFilter]);

  const fetchBehaviorData = async () => {
    let searchParams = "";
    if (startDate && endDate) {
      searchParams = `?FromDate=${startDate.format(
        dateFormat
      )}&ToDate=${endDate.format(dateFormat)}`;
    }
    const behaviorResponse = await fetch(`${CONSTANT.behavior}${searchParams}`);
    if (behaviorResponse.status === 200) {
      const responseJson = await behaviorResponse.json();
      // data formatters
      const { churnData, categories } = churnDataFormatter(
        responseJson.churn_profile_vals
      );
      const customerConnectData = callsConnectFormatter(
        responseJson.cust_connect_vals
      );
      const customerSpendings = customerSpendingsFormatter(
        responseJson.customer_spendings
      );
      const decileData = decileDistributionFormatter(
        responseJson.decile_distribution
      );

      setChartCategories(categories); //charts x-axis
      setChurnProfile(churnData);
      setCustomerSpendings(customerSpendings);
      setOverviewData(responseJson.overview_vals);
      setFinancialData(responseJson.financials_vals);
      setCustomerConnect(customerConnectData);
      setDecileDistribution(decileData.decileData);
      setDecileCategories(decileData.categories);
    }
  };

  const fetchConsumerData = async () => {
    let searchParams = "";
    if (startDate && endDate) {
      searchParams = `&FromDate=${startDate.format(
        dateFormat
      )}&ToDate=${endDate.format(dateFormat)}`;
    }
    const behaviorResponse = await fetch(
      `${CONSTANT.consumption}?Consumption=${consumptionFilter}${searchParams}`
    );
    if (behaviorResponse.status === 200) {
      const responseJson = await behaviorResponse.json();
      setConsumptionData(responseJson);
    }
  };
  console.log(customerSpendings);
  return (
    <section className={classes["layout"]}>
      {loader && <Spin />}
      <header>
        <h2>Consumer Behavior</h2>
      </header>
      <main className={classes.main}>
        <InputSection
          data={{ startDate, endDate }}
          onStartDateSelect={onStartDateSelect}
          onEndDateSelect={(date, dateString) => setEndDate(date)}
          applyDateFilter={applyDateFilter}
          dataRangeDate={dataRangeDate}
        />
        <Divider />
        <Row gutter={16}>
          <Col span={6}>
            <Overview data={overviewData} />
          </Col>
          <Col span={18}>
            <Finance data={financialData} />
            <br />
            <Consumption
              data={consumptionData}
              value={consumptionFilter}
              onSelectFilter={(val) => setConsumptionFilter(val)}
            />
          </Col>
        </Row>

        <br />
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Churn Profile</h3>
              </div>
              <div className={classes["chart-container"]}>
                <Chart data={churnProfile} categories={chartCategories} />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Decile Distribution</h3>
              </div>
              <div className={classes["chart-container"]}>
                <Chart
                  data={decileDistribution}
                  categories={decileCategories}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <br />
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Customer Spendings</h3>
              </div>
              <div className={classes["chart-container"]}>
                <PieChart data={customerSpendings} />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Customer Connect</h3>
              </div>
              <div className={classes["chart-container"]}>
                <Chart
                  data={customerConnect}
                  categories={chartCategories}
                  minY={true}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </section>
  );
};

export default Analytics;

export function loader({ request, params }) {
  return "response from analytics loader";
}
