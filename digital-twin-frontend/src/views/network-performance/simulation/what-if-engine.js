import React, { useState } from 'react';
import './WhatIfEngineNetwork.css';
import PieChart from "C:/Users/shivansh.mathur/Downloads/DigitalTwin/digital-twin-frontend/src/components/Charts/Piecharts";
import Chart from "C:/Users/shivansh.mathur/Downloads/DigitalTwin/digital-twin-frontend/src/components/Charts/Chart";

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
  const excludedKeys = ['PRB Util%'];
  const PRBData = apiResult && 'PRB Util%' in apiResult
    ? [{ name: 'PRB Util%', y: parseFloat(apiResult['PRB Util%']), color: '#eb4e14' },
    { name: '', y:100-parseFloat(apiResult['PRB Util%']) , color: '#D3D3D3' },]
    : [];
  const CallDropsData = apiResult && 'PRB Util%' in apiResult
    ? [{ name: '', y: 40, color: '#D3D3D3' },
    { name: 'CallDrop%', y: 60, color: '#eb4e14' },
    ]
    : [];

    const NetworkUtilData = apiResult && 'PRB Util%' in apiResult
    ? [{ name: '', y: 37, color: '#D3D3D3' },
    { name: 'Network Utilization', y: 63, color: '#eb4e14' },
    ]
    : [];
    
    const ResourseUtilData = apiResult && 'PRB Util%' in apiResult
  ? [{
    name: 'Resource Utilization',
    data: [90,80,40,65,90,87,39,99,79,25,88,54],
    color: '#6c5ce7',
    type: 'column',
  }]
  : [];

  const ResourceCat = [
    "00:00", "02:00", "04:00", "06:00", "08:00",
    "10:00", "12:00", "14:00", "16:00", "18:00","20:00","22:00"
  ];

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
            <div className={`chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>PRB Util%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={PRBData} chartTitle="PRB Util%" />
                  </div>
                </>
              )}
            </div>
            <div className={`chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Call Drop%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={CallDropsData} chartTitle="Call Drop%" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="charts-container">
            <div className={`chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Network Utilization%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={NetworkUtilData} chartTitle="Network Utilization%" />
                  </div>
                </>
              )}
            </div>
            <div className={`chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Resource Utilization%</h3>
                  </div>
                  <div className="chart-container">
                    <Chart data={ResourseUtilData} categories={ResourceCat} maxY={100} />
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
