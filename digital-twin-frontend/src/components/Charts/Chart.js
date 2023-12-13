import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";

highchartsMore(Highcharts);

const Chart = (props) => {
  const minY = props.minY === true ? 0 : props.minY || 0;

  const options = {
    exporting: {
      enabled: false,
    },
    chart: {
      height: "300px",
      zoomType: "x",
    },
    title: {
      text: ""
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: props.categories,
    },
    yAxis: {
      title: "",
      min: minY,
      max: props.maxY !== undefined ? props.maxY : 100,
      startOnTick: true,
    },

    plotOptions: props.plotOption || {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    series: props.data,
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      options={options}
    />
  );
};

export default Chart;
