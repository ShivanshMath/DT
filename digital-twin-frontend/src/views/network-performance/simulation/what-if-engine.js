import React, { useState } from 'react';
import './WhatIfEngineNetwork.css';
import PieChart from "C:/Users/shivansh.mathur/Downloads/DigitalTwin/digital-twin-frontend/src/components/Charts/Piecharts";
import Chart from "C:/Users/shivansh.mathur/Downloads/DigitalTwin/digital-twin-frontend/src/components/Charts/Chart";
import StackedBarChart from '../../../components/Charts/BarChart';

const WhatIfEngineNetwork = () => {
  const [ueConnected, setUEConnected] = useState('');
  const [apiResult, setApiResult] = useState(null);

  const onClickSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5050/lr-model/${ueConnected}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const correctedJsonString = data.result.replace(/'/g, '"');
      const resultObject = JSON.parse(correctedJsonString);

      const roundedResult = Object.fromEntries(
        Object.entries(resultObject).map(([key, value]) => [key, parseFloat(value).toFixed(2)])
      );

      setApiResult(roundedResult);

    } catch (error) {
      console.error('Error:', error);
    }
  };
  const excludedKeys = ['network_utilization','packetloss','dataspeed','DL Packet Loss Pct','res_uti','network_coverage_map'];

  const networkData = apiResult && 'network_utilization' in apiResult
    ? [{ name: 'Network Utilization', y: parseFloat(apiResult['network_utilization']), color: '#eb4e14' },
    { name:'', y:100-parseFloat(apiResult['network_utilization']),dataLabels: {enabled: false} , color: '#D3D3D3' }]
    : [];

  const pl = apiResult && 'packetloss' in apiResult? parseFloat(apiResult['packetloss'])*100 : 0;
  const packetlossData = apiResult && 'packetloss' in apiResult
    ? [{ name: '', y:100-pl , dataLabels: {enabled: false} , color: '#D3D3D3' },
    { name: 'PacketLoss', y:  pl, color: '#eb4e14' },
    ]
    : [];

  const resUtil = apiResult && 'res_uti' in apiResult? parseFloat(apiResult['res_uti']): 0;
  const networkStatus = apiResult && 'res_uti' in apiResult 
  ?[{name:'Resource Utilization',y: resUtil, color:'#eb4e14'},{name:'',y:100-resUtil, dataLabels:{enabled: false},color:'#D3D3D3'},]:[];
 
  const healthStatus = [{name:'Health Status', y:80,color:'#eb4e14'},{name:'',y:20,dataLabels:{enabled: false},color:'#D3D3D3'},]
    
  const energyData = [{name:'Energy Efficiency', y:80,color:'#eb4e14'},{name:'',y:20,dataLabels:{enabled: false},color:'#D3D3D3'},]
  //   const ResourseUtilData = apiResult && 'PRB Util%' in apiResult
  // ? [{
  //   name: 'Resource Utilization',
  //   data: [90,80,40,65,90,87,39,99,79,25,88,54],
  //   color: '#6c5ce7',
  //   type: 'column',
  // }]
  // : [];

  // const ResourceCat = [
  //   "00:00", "02:00", "04:00", "06:00", "08:00",
  //   "10:00", "12:00", "14:00", "16:00", "18:00","20:00","22:00"
  // ];

  const dataspeedVal = apiResult && 'dataspeed' in apiResult? parseFloat(apiResult['dataspeed']) : 0;
  const dataspeedVar=[125-dataspeedVal,dataspeedVal,'#D3D3D3','#eb4e14'];
  const batteryConsumptionVal =[20,80,'#D3D3D3','#eb4e14'];

  return (
    <>
      <div className="layout" id='Layout'>
        <header>
          <h2>What If Engine</h2>
        </header>
        <main className="main">
          <label htmlFor="ueConnected" className="label">
            Enter no of UEs connected:
          </label>
          <input
            type="text"
            id="ueConnected"
            name="ueConnected"
            value={ueConnected}
            onChange={(e) => setUEConnected(e.target.value)}
            className="input"
            required
          />
          <button type="button" onClick={onClickSubmit} className="button">
            Submit
          </button>
          <div className="charts-container">
            <div className={`col chart-box ${apiResult && 'network_utilization' in apiResult ? 'show' : ''}`}>
              {apiResult && 'network_utilization' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Resource Utilization</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={networkStatus} chartTitle="Resource Utilization" />
                  </div>
                </>
              )}
            </div>
            <div className={`col chart-box ${apiResult && 'network_utilization' in apiResult ? 'show' : ''}`}>
              {apiResult && 'network_utilization' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Health Status</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={healthStatus} chartTitle="Health Status" />
                  </div>
                </>
              )}
            </div>
            <div className={`col chart-box ${apiResult && 'network_utilization' in apiResult ? 'show' : ''}`}>
              {apiResult && 'network_utilization' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Energy Efficiency</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={energyData} chartTitle="Energy Efficiency" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="charts-container">
            <div className={`chart-box ${apiResult && 'network_utilization' in apiResult ? 'show' : ''}`}>
              {apiResult && 'network_utilization' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Network Utilization%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={networkData} chartTitle="Network Utilization" />
                  </div>
                </>
              )}
            </div>
            <div className={`chart-box ${apiResult && 'dataspeed' in apiResult ? 'show' : ''}`}>
              {apiResult && 'dataspeed' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Data Speed</h3>
                  </div>
                  <div className="chart-container">
                    <StackedBarChart data={dataspeedVar}/>
                  </div>
                </>
              )}
            </div>
            <div className={` chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Battery Consumption%</h3>
                  </div>
                  <div className="chart-container">
                    <StackedBarChart data={batteryConsumptionVal} />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="charts-container">
            <div className={`chart-box ${apiResult && 'packetloss' in apiResult ? 'show' : ''}`}>
              {apiResult && 'packetloss' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Packet Loss%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={packetlossData} chartTitle="Packet Loss%" />
                  </div>
                </>
              )}
            </div>
            
          </div>
          <div className="result-container">
            {apiResult && (
              <div>
                <h2 className="result-title">Simulation Result:</h2>
                <table className="result-table">
                  <thead>
                    <tr>
                      <th>KPI</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(apiResult)
                      .filter(([key, value]) => !excludedKeys.includes(key)) // Filter out excluded keys
                      .map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default WhatIfEngineNetwork;
