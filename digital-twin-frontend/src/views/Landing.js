import { useNavigate } from "react-router-dom";
import classes from "./Landing.module.css";
import RectCard from "../components/UI/RectCard";
import bg from "../images/bg.jpeg";
import Navbar from "../components/navbar/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  const redirection = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div className={`${classes["layout"]}`}>
        <img src={bg} className={classes["bg"]} />
        <div className={classes["content"]}>
          <h1>Digital Twin</h1>
          <p>
            Digital Twin Consortium defines digital twin is a virtual
            representation of real-world entities and processes, synchronized at
            a specified frequency and fidelity.Digital twins are being used
            across industries to understand behavior from object to enterprise
            Level.
            <br />
            <br />
            <b>Incedo’s DT portfolio </b> offers a range of industry-relevant
            solutions from supply chain & logistics to consumer behavior.
          </p>
          <div className={classes["cards-container"]}>
            <div className={classes["wrapper"]}>
              <RectCard>
                <div
                  onClick={() => redirection("/dt/analytics")}
                  className={classes["inner-card-wrapper"]}
                >
                  <i className="fa-solid fa-republican"></i>
                  <span>Consumer Behavior</span>
                </div>
              </RectCard>
            </div>
            <div className={classes["wrapper"]}>
              <RectCard>
                <div
                  onClick={() => redirection("/dt/network/analytics")}
                  className={classes["inner-card-wrapper"]}
                >
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                  <span>Network Performance</span>
                </div>
              </RectCard>
            </div>
            <div className={classes["wrapper"]}>
              <RectCard>
                <div className={classes["inner-card-wrapper"]}>
                  <i className="fa-solid fa-truck-field"></i>
                  <span>Supply Chain & Logistics</span>
                </div>
              </RectCard>
            </div>
          </div>
          <p className={classes["dt-link"]}>
              
            <a href="#">Learn more about Digital Twins..</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Landing;
