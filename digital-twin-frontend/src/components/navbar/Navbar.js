import { useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className={classes["navbar"]}>
      <div
        className={classes["brand-logo"]}
        onClick={() => navigate("/")}
      ></div>
      <div className={classes["actions"]}>
        <div className={classes["user-info"]}>
          <div>
            <p className={classes["name"]}>Pawan Dhami</p>
            <p className={classes["role"]}>Admin</p>
          </div>
          <div className={classes["dp"]}>
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
        <div className={classes["action-icons"]}>
          <div className={`${classes["icon"]} ${classes["notification"]}`}>
            <i className="fa-regular fa-bell"></i>
          </div>
          <div
            onClick={() => navigate("/")}
            className={`${classes["icon"]} ${classes["logout"]}`}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
