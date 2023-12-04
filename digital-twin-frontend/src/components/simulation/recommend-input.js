import { useEffect, useReducer, useState } from "react";
import { Row, Col, Divider } from "antd";
import Dropdown from "../UI/dropdown/Dropdown";
import RadioGroup from "../UI/AntRadio/ant-radio";
import AntInput from "../UI/AntInput/AntInput";
import HandleRow from "./handel-rows";
import classes from "./simulation.module.css";
import Button from "../UI/button/Button";
const objectiveOptions = [
  {
    label: "Revenue",
    value: "Revenue",
  },
  {
    label: "Churn Count",
    value: "Churn",
  },
];

const criteriaList = [
  {
    label: "Min",
    value: "Min",
  },
  {
    label: "Max",
    value: "Max",
  },
  {
    label: "User Defined",
    value: "user-defined",
  },
];

const handlesMinMaxReducer = (state, action) => {
  if (action.type === "MIN") {
    return { min: action.val, max: state.max };
  }
  if (action.type === "MAX") {
    return { min: state.min, max: action.val };
  }
};

const InputSection = ({ runHandler }) => {
  const [objective, setObjective] = useState("Revenue");
  const [criteria, setCriteria] = useState("Min");
  // constraint state
  const [constraint, setConstraint] = useState("Churn");
  // handles

  const [dataRates, dispatchDataRates] = useReducer(handlesMinMaxReducer, {
    min: 0.1,
    max: 1,
  });
  const [callRates, dispatchCallRates] = useReducer(handlesMinMaxReducer, {
    min: 0.1,
    max: 1,
  });
  const [smsRates, dispatchSmsRates] = useReducer(handlesMinMaxReducer, {
    min: 0.1,
    max: 1,
  });
  const [offer, dispatchOffer] = useReducer(handlesMinMaxReducer, {
    min: 0.1,
    max: 1,
  });
  const [constraintVal, dispatchConstraint] = useReducer(handlesMinMaxReducer, {
    min: 0.1,
    max: 1,
  });

  const onObjectiveChange = (value) => {
    setObjective(value);
    setConstraint(value === "Revenue" ? "Churn" : "Revenue");
  };

  const onSelectCriteria = (e) => {
    setCriteria(e.target.value);
  };

  const dataRatesMinHandler = (e) => {
    dispatchDataRates({ type: "MIN", val: e.target.value });
  };

  const dataRatesMaxHandler = (e) => {
    dispatchDataRates({ type: "MAX", val: e.target.value });
  };

  const callRatesMinHandler = (e) => {
    dispatchCallRates({ type: "MIN", val: e.target.value });
  };

  const callRatesMaxHandler = (e) => {
    dispatchCallRates({ type: "MAX", val: e.target.value });
  };

  const smsRatesMinHandler = (e) => {
    dispatchSmsRates({ type: "MIN", val: e.target.value });
  };

  const smsRatesMaxHandler = (e) => {
    dispatchSmsRates({ type: "MAX", val: e.target.value });
  };

  const offerMinHandler = (e) => {
    dispatchOffer({ type: "MIN", val: e.target.value });
  };

  const offerMaxHandler = (e) => {
    dispatchOffer({ type: "MAX", val: e.target.value });
  };

  const constraintMinHandler = (e) => {
    dispatchConstraint({ type: "MIN", val: e.target.value });
  };

  const constraintMaxHandler = (e) => {
    dispatchConstraint({ type: "MAX", val: e.target.value });
  };

  const runRecommender = () => {
    runHandler({
      objective,
      criteria,
      constraint,
      dataRates,
      callRates,
      smsRates,
      offer,
      constraintVal,
    });
  };

   
  useEffect(() => {
    runRecommender();
  }, [runRecommender]);
  

  const disableRun =
    objective &&
    criteria &&
    constraint.min !== "" &&
    constraint.max !== "" &&
    dataRates.min !== "" &&
    dataRates.max !== "" &&
    callRates.min !== "" &&
    callRates.max !== "" &&
    smsRates.min !== "" &&
    smsRates.max !== "" &&
    offer.min !== "" &&
    offer.max !== "" &&
    constraintVal.min !== "" &&
    constraintVal.max !== ""
      ? false
      : true;

  return (
    <>
      <Row gutter={16} type="flex" align={"top"}>
        <Col xm={12} sm={24} md={6} lg={6}>
          <Dropdown
            label="Objective"
            placeholder="Select Objective"
            value={objective}
            options={objectiveOptions}
            handleChange={onObjectiveChange}
          />
        </Col>
        <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 16, offset: 1 }}>
          <div style={{ display: "flex" }}>
            <div>
              <label>Criteria</label>
              <RadioGroup
                groupName="criteria"
                value={criteria}
                changeHandler={onSelectCriteria}
                options={criteriaList}
              />
            </div>
            {criteria === "user-defined" && (
              <div style={{ alignSelf: "end" }}>
                <AntInput
                  label=""
                  placeholder="Enter min Value"
                  value={constraintVal.min}
                  handleChange={constraintMinHandler}
                  type="number"
                  width="100px"
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row gutter={16} className={classes["ant-row-pos"]}>
        <Divider />
        <div className={classes["header-definition"]}>
          <h3>Handles</h3>
        </div>
      </Row>
      <Row>
        <Col span={18}>
          <Row
            gutter={[16, 16]}
            type="flex"
            justify="space-between"
            className={` ${classes["rows"]} ${classes["header-row"]}`}
          >
            <Col
              span={8}
              offset={8}
              className={`${classes["header-cell"]} ${classes["cell"]}`}
            >
              <span>Min</span>
            </Col>
            <Col
              span={8}
              className={`${classes["header-cell"]} ${classes["cell"]}`}
            >
              <span>Max</span>
            </Col>
          </Row>
          <HandleRow
            icon={<i className="fa-solid fa-download"></i>}
            label="Data Rates"
            value1={dataRates.min}
            changeHandler1={dataRatesMinHandler}
            placeholder1={"Enter Min Value ..."}
            value2={dataRates.max}
            changeHandler2={dataRatesMaxHandler}
            placeholder2={"Enter Max Value ..."}
          />
          <Divider className={classes["row-divider"]} />
          {/* Call Rates */}
          <HandleRow
            icon={<i className="fa-solid fa-phone"></i>}
            label="Call Rates"
            value1={callRates.min}
            changeHandler1={callRatesMinHandler}
            placeholder1={"Enter Min Value ..."}
            value2={callRates.max}
            changeHandler2={callRatesMaxHandler}
            placeholder2={"Enter Max Value ..."}
          />
          <Divider className={classes["row-divider"]} />
          {/* SMS Rates */}
          <HandleRow
            icon={<i className="fa-regular fa-comment-dots"></i>}
            label="SMS Rates"
            value1={smsRates.min}
            changeHandler1={smsRatesMinHandler}
            placeholder1={"Enter Min Value ..."}
            value2={smsRates.max}
            changeHandler2={smsRatesMaxHandler}
            placeholder2={"Enter Max Value ..."}
          />
          <Divider className={classes["row-divider"]} />

          {/* Offer */}
          <HandleRow
            icon={<i class="fa-brands fa-buffer"></i>}
            label="Offer"
            value1={offer.min}
            changeHandler1={offerMinHandler}
            placeholder1={"Enter Min Value ..."}
            value2={offer.max}
            changeHandler2={offerMaxHandler}
            placeholder2={"Enter Max Value ..."}
          />
        </Col>
      </Row>
      <Row gutter={16} className={classes["ant-row-pos"]}>
        <Divider />
        <div className={classes["header-definition"]}>
          <h3>Constraints</h3>
        </div>
      </Row>
      <Row>
        <Col span={18}>
          <Row gutter={16}>
            <Col span={8}>
              <Dropdown
                // label="Objective"
                placeholder="Select Constraint"
                value={constraint}
                options={objectiveOptions}
                // handleChange={onObjectiveChange}
                disabled={true}
              />
            </Col>
            <Col span={8}>
              <AntInput
                label=""
                placeholder="Enter min Value"
                value={constraintVal.min}
                handleChange={constraintMinHandler}
                type="number"
              />
            </Col>
            <Col span={8}>
              <AntInput
                label=""
                placeholder="Enter max value"
                value={constraintVal.max}
                handleChange={constraintMaxHandler}
                type="number"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <br />
      <Row>
        <Button onClick={runRecommender} disabled={disableRun}>
          Run
        </Button>
      </Row>
    </>
  );
};

export default InputSection;
