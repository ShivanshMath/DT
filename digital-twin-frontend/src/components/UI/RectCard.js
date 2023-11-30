import classes from "./RectCard.module.css";

const ReactCard = (props) => {
  return <div className={classes["rect-card"]}>{props.children}</div>;
};

export default ReactCard;
