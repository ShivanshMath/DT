import { DatePicker } from "antd";
import classes from "./DateInput.module.css";

const dateFormat = "DD-MM-YYYY";

const DateInput = (props) => {
  return (
    <div>
      <label>{props.label}</label>
      <DatePicker
        value={props.value}
        format={dateFormat}
        placeholder={props.placeholder}
        className={classes["date-input"]}
        onChange={props.onChange}
        disabledDate={props.disableDate}
      />
    </div>
  );
};

export default DateInput;
