import classes from "./view.module.css";
import Dropdown from "../../../components/UI/dropdown/Dropdown";
import AntInput from "../../../components/UI/AntInput/AntInput";
import { Row, Col, Divider, Spin } from "antd";
import Card from "../../../components/UI/Card";
import Chart from "../../../components/Charts/Chart";
import ProfitImg from "../../../images/profits.png";
import Button from "../../../components/UI/button/Button";
import CONSTANT from "../../../constant";
import Expenses from "../../../components/simulation/Expenses";

// data source
import {
  churnPropensityDataFormatter,
  ltvDataFormatter,
  survivalCurveDataFormatter,
} from "../../helper/ChartdataFormatter";
// import propensityData from "../datasources/decile-distribution.json";
import { useEffect, useState } from "react";

const months = [
  {
    label: "January",
    value: "Jan",
  },
  {
    label: "February",
    value: "Feb",
  },
  {
    label: "March",
    value: "Mar",
  },
  {
    label: "April",
    value: "Apr",
  },
  {
    label: "May",
    value: "May",
  },
  {
    label: "June",
    value: "Jun",
  },
  {
    label: "July",
    value: "Jul",
  },
  {
    label: "August",
    value: "Aug",
  },
  {
    label: "September",
    value: "Sep",
  },
  {
    label: "October",
    value: "Oct",
  },
  {
    label: "November",
    value: "Nov",
  },
  {
    label: "December",
    value: "Dec",
  },
];

const WhatIfEngine = () => {
  // input fields
  const [dataUsage, setDataUsage] = useState(1);
  const [month, setMonth] = useState("Jan");
  const [dataRates, setDataRates] = useState(0.05);
  const [callRates, setCallRates] = useState(0.05);
  const [smsRates, setSmsRates] = useState(0.05);
  const [selfOffer, setSelfOffer] = useState(1000);
  const [compititorOffer_1, setCompititorOffer_1] = useState(1000);
  const [compititorOffer_2, setCompititorOffer_2] = useState(1000);
  const [ccEfficiency, setCcEfficiency] = useState(0.8);
  const [churnThreshold, setChurnThreshold] = useState(0.8);
  const [overviewData, setOverviewData] = useState({});

  // output fields
  const [loader, setLoader] = useState(false);
  // const [avgChurn, setAvgChurn] = useState(0);
  // const [minChurn, setMinChurn] = useState(0);
  // const [maxChurn, setMaxChurn] = useState(0);
  const [churnPropensityData, setChurnPropensityData] = useState([]);
  const [propensityCategories, setPropensityCategories] = useState([]);
  const [ltvData, setLtvData] = useState([]);
  const [ltvCategories, setLtvCategories] = useState([]);
  const [survivalCurveData, setSurvivalCurveData] = useState([]);
  const [survivalCategories, setSurvivalCategories] = useState([]);

  const runSimulation = async () => {
    setLoader(true);
    const simulationResult = await fetch(
      `${CONSTANT.simulation}?month=${month}&cost=${dataUsage}&call_rates=${callRates}&sms_rates=${smsRates}&cc_efficiency=${ccEfficiency}&churn_threshold=${churnThreshold}&competitor1=${compititorOffer_1}&competitor2=${compititorOffer_2}&self_offer=${selfOffer}`
    );

    if (simulationResult.status === 200) {
      const jsonResult = await simulationResult.json();
      const { churnPropensity, categories: propCategory } =
        churnPropensityDataFormatter(jsonResult.churn_prop);
      const { ltvData, categories: ltvCategory } = ltvDataFormatter(
        jsonResult.ltv
      );
      const { survivalData, categories: survivalCategory } =
        survivalCurveDataFormatter(jsonResult.survival_curve);

      setChurnPropensityData(churnPropensity);
      setPropensityCategories(propCategory);
      setLtvData(ltvData);
      setLtvCategories(ltvCategory);
      setSurvivalCurveData(survivalData);
      setSurvivalCategories(survivalCategory);
      setOverviewData(jsonResult.churn_agg);
      // setAvgChurn(jsonResult.churn_agg.avg_churn);
      // setMinChurn(jsonResult.churn_agg.min_churn);
      // setMaxChurn(jsonResult.churn_agg.max_churn);
      setLoader(false);
    }
  };

  const onSelectMonth = (value) => {
    setMonth(value);
  };

  const onEnterDataUsageCost = (event) => {
    setDataUsage(event.target.value);
  };

  const onEnterDataRates = (event) => {
    setDataRates(event.target.value);
  };

  const onEnterCallRates = (event) => {
    setCallRates(event.target.value);
  };

  const onEnterSmsRates = (event) => {
    setSmsRates(event.target.value);
  };

  const onEnterSelfOffer = (event) => {
    setSelfOffer(event.target.value);
  };

  const onEnterCompititorOffer_1 = (event) => {
    setCompititorOffer_1(event.target.value);
  };

  const onEnterCompititorOffer_2 = (event) => {
    setCompititorOffer_2(event.target.value);
  };

  const onEnterCcEfficiency = (event) => {
    setCcEfficiency(event.target.value);
  };

  const onEnterChurnThreshold = (event) => {
    setChurnThreshold(event.target.value);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const disableBtn =
    !dataUsage ||
    !dataRates ||
    !callRates ||
    !smsRates ||
    !selfOffer ||
    !compititorOffer_1 ||
    !compititorOffer_2 ||
    !ccEfficiency ||
    !churnThreshold;

  return (
    <section className={classes["layout"]}>
      {loader && <Spin />}

      <header>
        <h2>Core Engine</h2>
      </header>
      <main className={classes.main}>
        <Row gutter={16}>
          <Col span={6}>
            <Dropdown
              label="Month"
              placeholder="Select quarter"
              value={month}
              options={months}
              handleChange={onSelectMonth}
            />
          </Col>
          <Col span={6}>
            <AntInput
              label="Data Usage Cost"
              placeholder="Data usage cost"
              value={dataUsage}
              handleChange={onEnterDataUsageCost}
              type="number"
            />
          </Col>
        </Row>
        <br />
        <Row gutter={16} className={classes["ant-row-pos"]}>
          <Divider />
          <div className={classes["header-definition"]}>
            <h3>Charges</h3>
          </div>
          <Col span={6}>
            <AntInput
              label="Services Cost"
              placeholder="Enter value ..."
              value={dataRates}
              handleChange={onEnterDataRates}
              type="number"
            />
          </Col>
          <Col span={6}>
            <AntInput
              label="Call Rates"
              placeholder="Enter value ..."
              value={callRates}
              handleChange={onEnterCallRates}
              type="number"
            />
          </Col>
          <Col span={6}>
            <AntInput
              label="SMS Rates"
              placeholder="Enter value ..."
              value={smsRates}
              handleChange={onEnterSmsRates}
              type="number"
            />
          </Col>
        </Row>
        <br />
        <Row gutter={16} className={classes["ant-row-pos"]}>
          <Divider />
          <div className={classes["header-definition"]}>
            <h3>Offers</h3>
          </div>

          <Col span={6}>
            <AntInput
              label="Self Offer"
              placeholder="Enter value ..."
              value={selfOffer}
              handleChange={onEnterSelfOffer}
              type="number"
            />
          </Col>
          <Col span={6}>
            <AntInput
              label="Competitor 1 Offer"
              placeholder="Enter value ..."
              value={compititorOffer_1}
              handleChange={onEnterCompititorOffer_1}
              type="number"
            />
          </Col>
          <Col span={6}>
            <AntInput
              label="Competitor 2 Offer"
              placeholder="Enter value ..."
              value={compititorOffer_2}
              handleChange={onEnterCompititorOffer_2}
              type="number"
            />
          </Col>
        </Row>
        <br />
        <Row gutter={16} className={classes["ant-row-pos"]}>
          <Divider />
          <div className={classes["header-definition"]}>
            <h3>Service Quality</h3>
          </div>

          <Col span={6}>
            <AntInput
              label="CC Efficiency"
              placeholder="Enter value ..."
              value={ccEfficiency}
              handleChange={onEnterCcEfficiency}
              type="number"
            />
          </Col>
        </Row>
        <br />
        <Row gutter={16} className={classes["ant-row-pos"]}>
          <Divider />
          <div className={classes["header-definition"]}>
            <h3>Churn Definition</h3>
          </div>
          <Col span={6}>
            <AntInput
              label="Churn Threshold"
              placeholder="Enter value ..."
              value={churnThreshold}
              handleChange={onEnterChurnThreshold}
              type="number"
            />
          </Col>
          <Col
            span={4}
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Button onClick={runSimulation} disabled={disableBtn}>
              <i className="fa-solid fa-arrow-right"></i>
            </Button>
          </Col>
        </Row>
        <br />

        <Divider />

        <Row gutter={[16, 16]}>
          {/* <Col span={8}>
            <div className={classes["pretty-card"]}>
              <div className={classes["card-wrap"]}>
                <img
                  src={ProfitImg}
                  alt="bg"
                  className={classes["card-img"]}
                ></img>
                <div className={classes["card-info"]}>
                  <span className={classes["value"]}>
                    {(avgChurn * 100).toFixed(2)}%
                  </span>
                  <span className={classes["label"]}>
                    Average Churn Propensity
                  </span>
                </div>
              </div>
              <div className={classes["card-wrap"]}>
                <img
                  src={ProfitImg}
                  alt="bg"
                  className={classes["card-img"]}
                ></img>
                <div className={classes["card-info"]}>
                  <span className={classes["value"]}>
                    {(minChurn * 100).toFixed(2)}%
                  </span>
                  <span className={classes["label"]}>Min Churn Propensity</span>
                </div>
              </div>
              <div className={classes["card-wrap"]}>
                <img
                  src={ProfitImg}
                  alt="bg"
                  className={classes["card-img"]}
                ></img>
                <div className={classes["card-info"]}>
                  <span className={classes["value"]}>
                    {(maxChurn * 100).toFixed(2)}%
                  </span>
                  <span className={classes["label"]}>Max Churn Propensity</span>
                </div>
              </div>
            </div>
          </Col> */}
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Churn Aggregation</h3>
              </div>
              <div style={{ padding: 15 }}>
                <div className={classes["chart-container"]}>
                  <Expenses
                    churnCount={overviewData.churn_count}
                    expenses={overviewData.expenses}
                    totalLostRevenue={overviewData.total_lost_revenue}
                    totalRevenue={overviewData.total_revenue}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Survival Curve</h3>
              </div>
              <div style={{ padding: 15 }}>
                <div className={classes["chart-container"]}>
                  <Chart
                    data={survivalCurveData}
                    categories={survivalCategories}
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Churn Propensity</h3>
              </div>
              <div style={{ padding: 15 }}>
                <div className={classes["chart-container"]}>
                  <Chart
                    data={churnPropensityData}
                    categories={propensityCategories}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>LTV</h3>
              </div>
              <div style={{ padding: 15 }}>
                <div className={classes["chart-container"]}>
                  <Chart data={ltvData} categories={ltvCategories} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </section>
  );
};

export default WhatIfEngine;
