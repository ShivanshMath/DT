import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import classes from "./rootLayout.module.css";
import Sidebar from "./sidebar/Sidebar";
import { useEffect } from "react";

const items = [
  {
    key: "/dt/analytics",
    icon: <i className="fa-solid fa-chart-simple"></i>,
    label: "Operational Awareness",
  },
  {
    key: "simulation",
    label: "Simulation",
    icon: <i className="fa-solid fa-gears"></i>,
    children: [
      {
        key: "/dt/simulation/core-engine",
        label: "Core Engine",
        // icon: <i className="fa-solid fa-gear"></i>,
      },
      {
        key: "/dt/simulation/what-if-engine",
        label: "What-if Engine",
        // icon: <i className="fa-regular fa-life-ring"></i>,
        // disabled: true,
      },
      {
        key: "/dt/simulation/optimization-engine",
        label: "Optimization Engine",
        // icon: <i className="fa-solid fa-thumbs-up"></i>,
        // disabled: false,
      },
      {
        key: "/dt/simulation/root-cause-engine",
        label: "Root Cause Engine",
        // icon: <i className="fa-brands fa-searchengin"></i>,
        disabled: true,
      },
    ],
  },
];

const RootLayout = (props) => {
  const location = useLocation();
  const pathName = location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  return (
    <>
      <Navbar />
      <div className={classes.group}>
        <Sidebar items={items} />
        <div className={classes["root-content"]}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
