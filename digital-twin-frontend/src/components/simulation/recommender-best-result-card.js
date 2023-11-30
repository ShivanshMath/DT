import { Row, Col, Divider } from "antd";
import { numFormatter } from "../../utils";
import Card from "../UI/Card";
import classes from "../analytics/analytics.module.css";

const BestRecommenderResult = ({ title, data }) => {
  return (
    <div className={classes["content"]}>
      <Card>
        <div className={classes["consuption-card-wrapper"]}>
          <div className={classes["consumption-filter"]}>
            <Row gutter={16} justify="space-between">
              <Col span={12}>
                <h3>{title}</h3>
              </Col>
            </Row>
          </div>
          <Row gutter={16}>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i class="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <div className={classes["info"]}>
                  <span
                    className={classes["value"]}
                    style={{ fontWeight: "bold" }}
                  >
                    {Number(data.Revenue.toFixed(2))}
                  </span>
                  <span
                    className={classes["label"]}
                    style={{ fontWeight: 900 }}
                  >
                    Revenue
                  </span>
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
                    {Number(data.Data_rates.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>Data Rates</span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className={`${classes["info-card"]}`}
                // style={{ borderRight: "none" }}
              >
                <div className={classes["card-icon"]}>
                  <i className="fa-regular fa-comment-dots"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {Number(data.SMS_rates.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>SMS Rates</span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {Number(data.Call_rates.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>Call Rate</span>
                </div>
              </div>
            </Col>
            <Col span={4}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i class="fa-brands fa-buffer"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {Number(data.Offer.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>Offer</span>
                </div>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i class="fa-solid fa-suitcase-rolling"></i>
                </div>
                <div className={classes["info"]}>
                  <span
                    className={classes["value"]}
                    style={{ fontWeight: "bold" }}
                  >
                    {data.Churn_count}
                  </span>
                  <span
                    className={classes["label"]}
                    style={{ fontWeight: 900 }}
                  >
                    Churn Count
                  </span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i class="fa-solid fa-money-bill-trend-up"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {Number(data.Avg_ac_Rev.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>
                    Average Account Revenue
                  </span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className={`${classes["info-card"]}`}>
                <div className={classes["card-icon"]}>
                  <i class="fa-solid fa-money-check-dollar"></i>
                </div>
                <div className={classes["info"]}>
                  <span className={classes["value"]}>
                    {Number(data.expenses.toFixed(2))}
                  </span>
                  <span className={classes["label"]}>Expense</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default BestRecommenderResult;
