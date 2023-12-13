import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import variablepie from "highcharts/modules/variable-pie";
 
variablepie(Highcharts);

const StackedBarChart = (props) => {
    
    const chartOptions = {
      chart: {
        type: props.data[6]
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
        labels: {
          enabled:false
        },
        title:"",
        gridLineWidth: 0
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          pointWidth:45,
          dataLabels: {
            enabled: true
        }
        },
      },
      series: [
        {
          name: props.data[3],
          data: [props.data[0]+props.data[1]],
          color: props.data[4] || 'blue',
        },
        {
          name: props.data[2],
          data: [props.data[1]],
          color: props.data[5] || 'green',
        },
        
      ],
      credits: {
        enabled: false
      }
    };
  
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  };
export default StackedBarChart;
