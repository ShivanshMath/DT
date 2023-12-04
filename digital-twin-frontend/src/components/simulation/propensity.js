import { Row, Col } from "antd";
 
// import { numFormatter } from "../../utils";
import Card from "../UI/Card";
import classes from "../analytics/analytics.module.css";

const Propensity = (props) => {
  return (
    <div className={classes["content"]}>
      <Card>
        <div className={classes["consuption-card-wrapper"]}>
          <div className={classes["consumption-filter"]}>
            <Row gutter={16} justify="space-between">
              <Col span={12}>
                <h3>Service-Wise Impact on Churn Propensity</h3>
              </Col>
            </Row>
          </div>
          <Row gutter={16}>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {/* {props.data?.voice_calls
                      ? numFormatter(props.data.voice_calls)
                      : 0} */}
                    {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                    0.2
                  </span>
                  <span className={classes["label"]}>Outgoing Calls</span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className={`${classes["info-card"]}`}
                // style={{ borderRight: "none" }}
              >
                <div className={classes["card-icon"]}>
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {/* {props.data?.services
                      ? numFormatter(props.data.services)
                      : 0} */}
                    0.2
                  </span>
                  <span className={classes["label"]}>Complaint Calls</span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i className="fa-solid fa-download"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {/* {props.data?.data_usage
                      ? numFormatter(props.data.data_usage)
                      : 0} */}
                    {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                    0.4
                  </span>
                  <span className={classes["label"]}>Data Usage</span>
                </div>
              </div>
            </Col>
            <Col span={4}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i className="fa-regular fa-comment-dots"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {/* {props.data?.sms ? numFormatter(props.data.sms) : 0} */}
                    {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                    0.1
                  </span>
                  <span className={classes["label"]}>SMS Sent</span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {/* {props.data?.call_duration
                      ? numFormatter(props.data.call_duration)
                      : 0} */}
                    0.1
                  </span>
                  <span className={classes["label"]}>SMS Received</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default Propensity;
