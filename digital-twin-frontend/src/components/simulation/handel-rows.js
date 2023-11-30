import { Row, Col } from "antd";
import AntInput from "../UI/AntInput/AntInput";
import classes from "./simulation.module.css";

const HandleRow = ({
  label,
  icon,
  changeHandler1,
  changeHandler2,
  value1,
  value2,
  placeholder1,
  placeholder2,
}) => {
  return (
    <Row
      gutter={[16, 16]}
      type="flex"
      justify="space-between"
      className={` ${classes["rows"]} ${classes["tab-rows"]}`}
    >
      <Col span={8} className={classes["cell"]}>
        <div className={classes["row-icon"]}>{icon}</div>
        <label>{label}</label>
      </Col>
      <Col span={8}>
        <AntInput
          label=""
          placeholder={placeholder1}
          value={value1}
          handleChange={changeHandler1}
          type="number"
        />
      </Col>
      <Col span={8}>
        <AntInput
          label=""
          placeholder={placeholder2}
          value={value2}
          handleChange={changeHandler2}
          type="number"
        />
      </Col>
    </Row>
  );
};

export default HandleRow;
