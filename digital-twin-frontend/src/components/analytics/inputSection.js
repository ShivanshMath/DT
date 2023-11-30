import { Row, Col, Radio } from "antd";
import dayjs from "dayjs";
import DateInput from "../UI/dateInput/DateInput";
import Button from "../UI/button/Button";

const dateFormat = "DD-MM-YYYY";

const InputSection = (props) => {
  // disable start date
  const disableStartDate = (current) => {
    const beforeDate = dayjs("01-01-2022", dateFormat);
    const afterDate = dayjs("31-12-2022", dateFormat);

    return (
      (current && current < beforeDate) || (current && current > afterDate)
    );
  };

  // disable end date
  const disableEndDate = (current) => {
    const startDate = props.data.startDate
      ? props.data.startDate.format(dateFormat)
      : "01-01-2022";
    const beforeDate = dayjs(startDate, dateFormat).add(1, "days");
    const afterDate = dayjs("01-01-2023", dateFormat);

    return (
      (current && current < beforeDate) || (current && current > afterDate)
    );
  };

  const disableBtn = !props.data.startDate || !props.data.endDate;

  return (
    <div>
      <Row gutter={16}>
        <Col span={4}>
          <DateInput
            value={props.data.startDate}
            placeholder="Select Start Date"
            onChange={props.onStartDateSelect}
            disableDate={disableStartDate}
            label="Start Date"
          />
        </Col>
        <Col span={4}>
          <DateInput
            value={props.data.endDate}
            placeholder="Select End Date"
            onChange={props.onEndDateSelect}
            disableDate={disableEndDate}
            label="End Date"
          />
        </Col>
        <Col
          span={4}
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Button onClick={props.applyDateFilter} disabled={disableBtn}>
            <i className="fa-solid fa-arrow-right"></i>
          </Button>
        </Col>
        <Col span={12}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Radio.Group>
              <Radio value={1}>National</Radio>
              <Radio value={2}>PEA</Radio>
            </Radio.Group>
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: 10, fontSize: "12px", color: "#878484" }}>
        <Col>
          <i>
            {`Data showing from ${dayjs(props.dataRangeDate.startDate).format(
              dateFormat
            )} - ${dayjs(props.dataRangeDate.endDate).format(dateFormat)}`}{" "}
          </i>
        </Col>
      </Row>
    </div>
  );
};

export default InputSection;
