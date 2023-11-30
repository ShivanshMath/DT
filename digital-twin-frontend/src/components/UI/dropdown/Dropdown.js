import classes from "./Dropdown.module.css";
import { Select } from "antd";

const Dropdown = (props) => {
  return (
    <>
      <label>{props.label}</label>
      <Select
        style={{
          width: "100%",
        }}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
        options={props.options}
        disabled={props.disabled}
      />
    </>
  );
};

export default Dropdown;
