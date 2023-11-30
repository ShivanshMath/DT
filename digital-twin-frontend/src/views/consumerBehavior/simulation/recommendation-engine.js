import { useEffect, useState } from "react";
import { Divider, Spin } from "antd";
import InputSection from "../../../components/simulation/recommend-input";
import OutputSection from "../../../components/simulation/recommender-output";
import classes from "./view.module.css";
import CONSTANT from "../../../constant";

const RecommendationEngine = () => {
  const [loader, setLoader] = useState(false);
  const [output, setOutput] = useState({});

  const runRecommender = async (inputs) => {
    setLoader(true);
    try {
      const response = await fetch(
        `${CONSTANT.optimization}?objective=${inputs.objective}&criterion=${inputs.criteria}&DR_lb=${inputs.dataRates.min}&DR_ub=${inputs.dataRates.max}&Call_lb=${inputs.callRates.min}&Call_ub=${inputs.callRates.max}&SMS_lb=${inputs.smsRates.min}&SMS_ub=${inputs.smsRates.max}&Offer_lb=${inputs.offer.min}&Offer_ub=${inputs.offer.max}&Constraint_lb=${inputs.constraintVal.min}&Constraint_ub=${inputs.constraintVal.max}`
      );

      if (response.status === 200) {
        const data = await response.json();
        setOutput({ ...data });
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      alert("something went wrong, please try again with later!");
    }
  };

  return (
    <div className={classes["layout"]}>
      {loader && <Spin />}

      <header>
        <h2>Optimization Engine</h2>
      </header>
      <main className={classes.main}>
        <InputSection runHandler={runRecommender} />
        <Divider
          style={{
            height: "2px",
            background: "rgb(0 0 0 / 34%)",
          }}
        />
        <OutputSection result={output} />
        {/* <Collapse items={items} defaultActiveKey={["1"]} onChange={onChange} /> */}
        {/* <Collapse accordion items={items} /> */}
      </main>
    </div>
  );
};

export default RecommendationEngine;
