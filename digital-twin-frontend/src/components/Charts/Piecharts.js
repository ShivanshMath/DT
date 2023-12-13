import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import variablepie from "highcharts/modules/variable-pie";
 
variablepie(Highcharts);
 
const PieChart = (props) => {
  const options = {
    chart: {
      type: "pie",
      height: "300px",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",

        dataLabels: {
          enabled: true,
          format:  "<b>{point.name}</b> {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        minPointSize: 10,
        innerSize: "70%",
        zMin: 0,
        name:props.chartTitle ||  "Customer Spendings",
        data: props.data,
      },
    ],
  };
 
  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      options={options}
    />
  );
};
 
export default PieChart;