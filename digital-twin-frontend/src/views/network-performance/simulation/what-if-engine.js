import React, { useState } from 'react';
import './WhatIfEngineNetwork.css'; 

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
  

  return (
    <div className="container">
      <h1 className="title">What If Engine</h1>

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
    </div>
  );
};

export default WhatIfEngineNetwork;
