import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import variablepie from "highcharts/modules/variable-pie";
 
variablepie(Highcharts);

const StackedBarChart = (props) => {
    
    const chartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: '',
      },
      xAxis: {
        min:0,
        categories: [''],
      },
      yAxis: {
        min: 0,
        max:props.data[0] + props.data[1],
        title: {
          text: 'Total',
        },
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
        },
      },
      series: [
        {
          name: 'Total Coverage',
          data: [props.data[0]+props.data[1]],
          color: props.data[2] || 'blue',
        },
        {
          name: 'Current Coverage',
          data: [props.data[1]],
          color: props.data[3] || 'green',
        },
      ],
    };
  
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  };
export default StackedBarChart;
