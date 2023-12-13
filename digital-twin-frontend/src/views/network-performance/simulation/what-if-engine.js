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
  const excludedKeys = ['health_sta', 'battery_com', 'time_mana', 'energy_eff', 'qes_im', 'network_utilization', 'packetloss', 'dataspeed', 'DL Packet Loss Pct', 'res_uti', 'network_coverage_map'];

  const networkData = apiResult && 'network_utilization' in apiResult
    ? [{ name: 'Network Utilization', sliced: 'true', y: parseFloat(apiResult['network_utilization']), color: '#eb4e14' },
    { name: '', y: 100 - parseFloat(apiResult['network_utilization']), dataLabels: { enabled: false }, color: '#D3D3D3' }]
    : [];

  const pl = apiResult && 'packetloss' in apiResult ? parseFloat(apiResult['packetloss']) * 100 : 0;
  const packetlossData = apiResult && 'packetloss' in apiResult
    ? [{ name: '', y: 100 - pl, dataLabels: { enabled: false }, color: '#D3D3D3' },
    { name: 'PacketLoss', sliced: 'true', y: pl, color: '#eb4e14' },
    ]
    : [];

  const resUtil = apiResult && 'res_uti' in apiResult ? parseFloat(apiResult['res_uti']) : 0;
  const networkStatus = apiResult && 'res_uti' in apiResult
    ? [{ name: 'Resource Utilization', sliced: 'true', y: resUtil, color: '#eb4e14' }, { name: '', y: 100 - resUtil, dataLabels: { enabled: false }, color: '#D3D3D3' },] : [];

  const hs = apiResult && 'health_sta' in apiResult ? parseFloat(apiResult['health_sta']) : 0;
  const healthStatus = [{ name: 'Health Status', sliced: 'true', y: hs, color: '#eb4e14' }, { name: '', y: 100 - hs, dataLabels: { enabled: false }, color: '#D3D3D3' },]
  const ef = apiResult && 'energy_eff' in apiResult ? parseFloat(apiResult['energy_eff']) : 0;
  const energyData = [{ name: 'Energy Efficiency', sliced: 'true', y: ef, color: '#eb4e14' }, { name: '', y: 100 - ef, dataLabels: { enabled: false }, color: '#D3D3D3' },]


  const KPIvalue = [];
  const KPIkey = [];

  Object.entries(apiResult || {})
    .filter(([key, value]) => !excludedKeys.includes(key) && parseFloat(value) > 0.00)
    .forEach(([key, value]) => {
      KPIkey.push(key);
      if (parseFloat(value) > 1) {
        KPIvalue.push(parseFloat(value));
      }
      else {
        KPIvalue.push(parseFloat(value) * 100);
      }
    });

  const KPIval = apiResult && 'PRB Util%' in apiResult
    ? [
      {
        name: 'KPI Results',
        data: KPIvalue,
        color: '#eb4e14',
        type: 'column',
      }
    ]
    : [];

  const dataspeedVal = apiResult && 'dataspeed' in apiResult ? parseFloat(apiResult['dataspeed']) : 0;


  const dataspeedVar = [110 - dataspeedVal, dataspeedVal, 'Current Speed', 'Max Speed', '#D3D3D3', '#eb4e14', "bar"];
  const bc = apiResult && 'battery_com' in apiResult ? parseFloat(apiResult['battery_com']) : 0;
  const batteryConsumptionVal = [100 - bc, bc, 'Current Consumption', 'Max Consumption', '#D3D3D3', '#eb4e14', "bar"];



  const quesimpVal = [20, 80, 'Current Coverage', 'Total Coverage', '#D3D3D3', '#eb4e14', "column"]
  const qesVal = apiResult && 'qes_im' in apiResult ? parseFloat(apiResult['qes_im']) * 100 : 0;
  const qesChart = [8 - qesVal, qesVal, 'Current Impact', 'Max Impact', '#D3D3D3', '#eb4e14', "column"]

  const ttm = apiResult && 'time_mana' in apiResult ? apiResult['time_mana'] : "120";
  const displayTtm = Number.isInteger(parseFloat(ttm)) ? String(parseInt(ttm)) : String(parseFloat(ttm));


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
                    <h3>Resource Utilization%</h3>
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
                    <h3>Health Status%</h3>
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
                    <h3>Energy Efficiency%</h3>
                  </div>
                  <div className="chart-container">
                    <PieChart data={energyData} chartTitle="Energy Efficiency" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="charts-container">
            <div className={`col chart-box ${apiResult && 'network_utilization' in apiResult ? 'show' : ''}`}>
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
            <div className={`col chart-box ${apiResult && 'dataspeed' in apiResult ? 'show' : ''}`}>
              {apiResult && 'dataspeed' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Data Speed(Mbps)</h3>
                  </div>
                  <div className="chart-container">
                    <StackedBarChart data={dataspeedVar} />
                  </div>
                </>
              )}
            </div>
            <div className={`col chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Avg Battery Consumption%</h3>
                  </div>
                  <div className="chart-container">
                    <StackedBarChart data={batteryConsumptionVal} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="charts-container">
            <div className={`col chart-box ${apiResult && 'packetloss' in apiResult ? 'show' : ''}`}>
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
            <div className={`col chart-box ${apiResult && 'network_coverage_map' in apiResult ? 'show' : ''}`}>
              {apiResult && 'network_coverage_map' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Network Coverage Map(KM)</h3>
                  </div>
                  <div className="chart-container">
                    <div>
                      {/* <p style={{ paddingTop: 20, paddingLeft: 10, fontWeight: 'bold', textAlign: 'center' }}>Max Coverage: 5</p> */}
                    </div>
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="50%" cy="50%" r="40" fill="#D3D3D3" fillOpacity="0.5" strokeWidth="2" />
                      <text
                        x="50%"
                        y="17%"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#000"
                        fontSize="6"
                      >
                        {12}
                      </text>

                      {apiResult && 'network_coverage_map' in apiResult && (
                        <>
                          <circle
                            cx="50%"
                            cy="50%"
                            r={Math.min((40 / 12) * apiResult['network_coverage_map'], 40)}
                            fill="#eb4e14"
                            fillOpacity="1.0"
                            strokeWidth="2"
                          />
                          <text
                            x="50%"
                            y={(50 + Math.min(40, apiResult['network_coverage_map'])).toString()} // Adjust the value to position it outside the inner circle
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="#000" // Black color
                            fontSize="6" // Adjust the font size as needed
                          >
                            {apiResult['network_coverage_map']}
                          </text>
                        </>
                      )}
                    </svg>
                  </div>
                </>
              )}
            </div>

            <div className={`col chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>Time To Maintenance(Hours)</h3>
                  </div>
                  <div className="chart-container">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <rect x="5%" y="40%" width="90%" height="20%" fill="#D3D3D3" fillOpacity="0.5" strokeWidth="2" stroke="#eb4e14" />

                      {apiResult && 'PRB Util%' in apiResult && (
                        <>
                          <foreignObject x="5%" y="40%" width="90%" height="20%">
                            <input
                              type="text"
                              readOnly
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                textAlign: "center",
                                fontSize: "10px",
                                backgroundColor: "transparent",
                              }}
                              value={displayTtm}
                            />
                          </foreignObject>
                        </>
                      )}
                    </svg>
                  </div>
                </>
              )}
            </div>


          </div>
          <div className="charts-container">
            <div className={`col chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              <div className='card-header'>
                <h3>Simulation Result:</h3>
              </div>
              <div className="result-container">
                {apiResult && (
                  <div>
                    {/* <Chart
                      data={KPIval}
                      categories={KPIkey}
                      minY={0}
                    /> */}
                    <table className="result-table">
                  <thead>
                    <tr>
                      <th>KPI</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(apiResult)
                      .filter(([key, value]) => !excludedKeys.includes(key) && parseFloat(value) > 0.00) // Filter out excluded keys
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
            </div>
            <div className={`col chart-box ${apiResult && 'PRB Util%' in apiResult ? 'show' : ''}`}>
              {apiResult && 'PRB Util%' in apiResult && (
                <>
                  <div className='card-header'>
                    <h3>QES Impact%</h3>
                  </div>
                  <div className="chart-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 100%', maxWidth: '50%' }}>
                      <StackedBarChart data={quesimpVal} style={{ width: '50%', maxWidth: '50px' }} />
                    </div>
                    <div style={{ flex: '1 1 100%', maxWidth: '50%' }} >
                      <StackedBarChart data={qesChart} style={{ width: '50%', maxWidth: '50px' }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WhatIfEngineNetwork;
