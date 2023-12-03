import React, { useState } from 'react';
import './WhatIfEngineNetwork.css'; 
import PieChart from "C:/Users/shivansh.mathur/Downloads/DigitalTwin/digital-twin-frontend/src/components/Charts/Piecharts";


const WhatIfEngineNetwork = () => {
  const [ueConnected, setUEConnected] = useState('');
  // const [ueConnected, setUEConnected] = useState('');
  // const [ueConnected, setUEConnected] = useState('');
  // const [ueConnected, setUEConnected] = useState('');
  const [apiResult, setApiResult] = useState(null);

  const onClickSubmit = async () => {
    try {
      console.log(ueConnected)
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
  

  return (<>
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
          {/* Placeholder for PieChart */}
          <div className='chart-box' >    
          <div className='card-header'>
              <h3>PRB Util%</h3>
              </div>       
          {apiResult && 'PRB Util%' in apiResult && (
            <div className="chart-container">
              <PieChart data={apiResult['PRB Util%']} />
            </div>
          )}
          </div>
          {/* Placeholder for PieChart */}
          <div className='chart-box'>
            <div className='card-header'>
              <h3>Call Drops%</h3>
              </div>
          {apiResult && 'PRB Util%' in apiResult && (
            <div className="chart-container">
              <PieChart data={apiResult['PRB Util%']} />
            </div>
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
                  {Object.entries(apiResult).map(([key, value]) => (
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