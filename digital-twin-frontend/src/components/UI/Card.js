const classes = {
  card: {
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    borderRadius: "8px",
    height: "100%",
  },
};

const Card = (props) => {
  return <div style={classes.card}>{props.children}</div>;
};

export default Card;
