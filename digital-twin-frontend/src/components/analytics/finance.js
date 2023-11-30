import { Row, Col } from "antd";
import { numFormatter } from "../../utils";
import Card from "../UI/Card";
import classes from "./analytics.module.css";

const Finance = (props) => {
  return (
    <div className={classes["content"]}>
      <h3>Financials</h3>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <div
              className={`${classes["info-card"]} ${classes["finance-cards"]}`}
            >
              <div className={classes["card-icon"]}>
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className={classes["info"]}>
                <span className={classes["value"]}>
                  {props.data?.revenue ? numFormatter(props.data.revenue) : 0}
                  {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                </span>
                <span className={classes["label"]}>Revenue</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div
              className={`${classes["info-card"]} ${classes["finance-cards"]}`}
            >
              <div className={classes["card-icon"]}>
                <i className="fa-solid fa-comment-dollar"></i>
              </div>
              <div className={classes["info"]}>
                <span className={classes["value"]}>
                  {props.data?.spending_atl
                    ? numFormatter(props.data.spending_atl)
                    : 0}
                  {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                </span>
                <span className={classes["label"]}>Spendings ATL</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div
              className={`${classes["info-card"]} ${classes["finance-cards"]}`}
            >
              <div className={classes["card-icon"]}>
                <i className="fa-solid fa-comments-dollar"></i>
              </div>
              <div className={classes["info"]}>
                <span className={classes["value"]}>
                  {props.data?.spending_btl
                    ? numFormatter(props.data.spending_btl)
                    : 0}
                  {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                </span>
                <span className={classes["label"]}>Spendings BTL</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div
              className={`${classes["info-card"]} ${classes["finance-cards"]}`}
            >
              <div className={classes["card-icon"]}>
                <i className="fa-solid fa-comment-dollar"></i>
              </div>
              <div className={classes["info"]}>
                <span className={classes["value"]}>
                  {props.data?.spending_oths
                    ? numFormatter(props.data.spending_oths)
                    : 0}
                  {/* <i className={`fa-solid fa-caret-down ${classes.down}`}></i> */}
                </span>
                <span className={classes["label"]}>Spendings Others</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Finance;
