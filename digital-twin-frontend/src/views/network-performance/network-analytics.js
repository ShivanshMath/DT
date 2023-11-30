import { Row, Col } from "antd";
import classes from "./styles.module.css";
import Topology from "./topolgy-map/topology";

const NetworkAnalysis = () => {
  return (
    <section className={classes["layout"]}>
      <header>
        <h2>Network Performance</h2>
      </header>
      <main className={classes.main}>
        <Row>
          <Col span={24}>
            <Topology />
          </Col>
        </Row>
      </main>
    </section>
  );
};

export default NetworkAnalysis;
