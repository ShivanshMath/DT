import { Input } from "antd";

const AntInput = (props) => {
  return (
    <>
      <label>{props.label}</label>
      <Input
        style={{
          width: props.width || "100%",
        }}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
        type={props.type || "text"}
        disabled={props.disabled}
      />
    </>
  );
};

export default AntInput;
