import classes from "./view.module.css";
import Dropdown from "../../../components/UI/dropdown/Dropdown";
import { Row, Col, Divider, Spin } from "antd";
import Propensity from "../../../components/simulation/propensity";
import Card from "../../../components/UI/Card";
import Chart from "../../../components/Charts/Chart";
import Expenses from "../../../components/simulation/Expenses";
import Button from "../../../components/UI/button/Button";
import CONSTANT from "../../../constant";

// data source
import {
  churnPropensityDataFormatter,
  ltvDataFormatter,
  survivalCurveDataFormatter,
} from "../../helper/ChartdataFormatter";
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

const CoreEngine = () => {
  const [month, setMonth] = useState("Jan");
  const [loader, setLoader] = useState(false);
  const [overviewData, setOverviewData] = useState({});
  const [churnPropensityData, setChurnPropensityData] = useState([]);
  const [propensityCategories, setPropensityCategories] = useState([]);
  const [ltvData, setLtvData] = useState([]);
  const [ltvCategories, setLtvCategories] = useState([]);
  const [survivalCurveData, setSurvivalCurveData] = useState([]);
  const [survivalCategories, setSurvivalCategories] = useState([]);

  const runSimulation = async () => {
    setLoader(true);
    const simulationResult = await fetch(
      `${CONSTANT.simulation}?month=${month}`
    );

    if (simulationResult.status == 200) {
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
      setLoader(false);
    }
  };

  const onSelectMonth = (value) => {
    setMonth(value);
  };

  useEffect(() => {
    runSimulation();
  }, []);

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
              label=" Month"
              placeholder="Select quarter"
              value={month}
              options={months}
              handleChange={onSelectMonth}
            />
          </Col>
          <Col
            span={4}
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Button onClick={runSimulation}>
              <i className="fa-solid fa-arrow-right"></i>
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Propensity />
          </Col>
        </Row>
        <br />

        <Row gutter={[16, 16]}>
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

        {/* <Row gutter={16}>
          <Col span={8}>
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
          </Col>
          <Col span={16}>
            <Card>
              <div className={classes["card-header"]}>
                <h3>Churn Propensity</h3>
              </div>
              <div style={{ padding: 15 }}>
                <div className={classes["chart-container"]}>
                  <Chart data={churnPropensityData} categories={categories} />
                </div>
              </div>
            </Card>
          </Col>
        </Row> */}
      </main>
    </section>
  );
};

export default CoreEngine;
