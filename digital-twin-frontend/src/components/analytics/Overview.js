import { Row, Col } from "antd";
import Card from "../UI/Card";
import { numFormatter } from "../../utils";
import classes from "./analytics.module.css";

const Overview = (props) => {
  return (
    <div className={classes["content"]}>
      <h3>Overview</h3>
      <Card>
        <div className={classes["row-layout"]}>
          <div className={classes["row"]}>
            <Row justify="space-between">
              <Col span={12}>
                <span className={classes["label"]}>Customer Base</span>
              </Col>
              <Col span={8}>
                <div className={classes["val-box"]}>
                  <span className={classes["value"]}>
                    {props.data?.customer_base
                      ? 1000
                      : // numFormatter(props.data.customer_base)
                        0}{" "}
                  </span>
                  <i className={`fa-solid fa-thumbs-down ${classes.down}`}></i>
                </div>
              </Col>
            </Row>
          </div>
          <div className={classes["row"]}>
            <Row justify="space-between">
              <Col span={12}>
                <span className={classes["label"]}>Total Churn</span>
              </Col>
              <Col span={8}>
                <div className={classes["val-box"]}>
                  <span className={classes["value"]}>
                    {props.data?.total_churn
                      ? numFormatter(props.data.total_churn)
                      : 0}
                  </span>
                  <i className={`fa-solid fa-thumbs-up ${classes.up}`}></i>
                </div>
              </Col>
            </Row>
          </div>
          <div className={classes["row"]}>
            <Row justify="space-between">
              <Col span={12}>
                <span className={classes["label"]}>Churn %</span>
              </Col>
              <Col span={8}>
                <div className={classes["val-box"]}>
                  <span className={classes["value"]}>
                    {props.data?.churn_per
                      ? numFormatter(props.data.churn_per)
                      : 0}
                    %
                  </span>
                  <i className={`fa-solid fa-thumbs-up ${classes.up}`}></i>
                </div>
              </Col>
            </Row>
          </div>
          <div className={classes["row"]} style={{ borderBottom: "none" }}>
            <Row justify="space-between">
              <Col span={12}>
                <span className={classes["label"]}>Avg. Sentiment</span>
              </Col>
              <Col span={8}>
                <div className={classes["val-box"]}>
                  <span className={classes["value"]}>
                    {props.data?.avg_sentiment
                      ? numFormatter(props.data.avg_sentiment)
                      : 0}
                  </span>
                  <i className={`fa-solid fa-thumbs-down ${classes.down}`}></i>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Overview;
