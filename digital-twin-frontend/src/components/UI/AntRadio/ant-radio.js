import { Radio } from "antd";

const RadioGroup = ({ groupName, value, changeHandler, options }) => {
  return (
    <div style={{ height: 32, display: "flex", alignItems: "center" }}>
      <Radio.Group
        name={groupName}
        value={value}
        onChange={changeHandler}
        options={options}
      ></Radio.Group>
    </div>
  );
};

export default RadioGroup;
