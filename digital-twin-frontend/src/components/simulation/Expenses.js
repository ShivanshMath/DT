import { Row, Col } from "antd";
// eslint-disable-next-line 
// import Card from "../UI/Card";
import { numFormatter } from "../../utils";
import classes from "../analytics/analytics.module.css";

const Expenses = (props) => {
  return (
    // <div className={classes["content"]}>
    //   <h3>Overview</h3>
    //   <Card>
    <div className={classes["row-layout"]}>
      <div className={classes["row"]}>
        <Row justify="space-between">
          <Col span={12}>
            <span className={classes["label"]}>Churn Count</span>
          </Col>
          <Col span={8}>
            <div className={classes["val-box"]}>
              <span className={classes["value"]}>
                {props.churnCount ? numFormatter(props.churnCount) : 0}
              </span>
              {/* <i className={`fa-solid fa-thumbs-down ${classes.down}`}></i> */}
            </div>
          </Col>
        </Row>
      </div>
      <div className={classes["row"]}>
        <Row justify="space-between">
          <Col span={12}>
            <span className={classes["label"]}>Expenses</span>
          </Col>
          <Col span={8}>
            <div className={classes["val-box"]}>
              <span className={classes["value"]}>
                {props.expenses ? numFormatter(props.expenses) : 0}
              </span>
              {/* <i className={`fa-solid fa-thumbs-up ${classes.up}`}></i> */}
            </div>
          </Col>
        </Row>
      </div>
      <div className={classes["row"]}>
        <Row justify="space-between">
          <Col span={12}>
            <span className={classes["label"]}>Total Lost Revenue</span>
          </Col>
          <Col span={8}>
            <div className={classes["val-box"]}>
              <span className={classes["value"]}>
                {props.totalLostRevenue
                  ? numFormatter(props.totalLostRevenue)
                  : 0}
              </span>
              {/* <i className={`fa-solid fa-thumbs-up ${classes.up}`}></i> */}
            </div>
          </Col>
        </Row>
      </div>
      <div className={classes["row"]} style={{ borderBottom: "none" }}>
        <Row justify="space-between">
          <Col span={12}>
            <span className={classes["label"]}>Total Revenue</span>
          </Col>
          <Col span={8}>
            <div className={classes["val-box"]}>
              <span className={classes["value"]}>
                {props.totalRevenue ? numFormatter(props.totalRevenue) : 0}
              </span>
              {/* <i className={`fa-solid fa-thumbs-down ${classes.down}`}></i> */}
            </div>
          </Col>
        </Row>
      </div>
    </div>
    //   </Card>
    // </div>
  );
};

export default Expenses;
