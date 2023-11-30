import classes from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";

import { Menu } from "antd";

const Sidebar = ({ items }) => {
  const navigate = useNavigate();

  const onMenuChange = ({ item, key }) => {
    navigate(key);
  };

  const defaultKey = window.location.pathname;

  return (
    <section className={classes["sidebar"]}>
      <Menu
        style={{
          width: 200,
        }}
        onClick={onMenuChange}
        defaultSelectedKeys={[defaultKey]}
        defaultOpenKeys={["simulation"]}
        mode="inline"
        // theme={theme}
        items={items}
      />
    </section>
  );
};

export default Sidebar;
