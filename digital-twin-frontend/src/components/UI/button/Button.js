import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={classes.button}
    >
      {props.children}
    </button>
  );
};

export default Button;
