import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import './ChartsDashboard.css';

const data = [
  { date: 'Jul 1', bp: 120, sugar: 90 },
  { date: 'Jul 2', bp: 125, sugar: 95 },
  { date: 'Jul 3', bp: 118, sugar: 100 },
  { date: 'Jul 4', bp: 130, sugar: 110 },
  { date: 'Jul 5', bp: 128, sugar: 105 },
];

const ChartsDashboard = () => {
  return (
    <div className="charts-container">
      <h1 className="charts-title">📊 Health Charts</h1>

      <div className="chart-section">
        <h3>Blood Pressure</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="bp" stroke="#ff7675" strokeWidth={3} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis domain={[100, 140]} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Sugar Level</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="sugar" stroke="#0984e3" strokeWidth={3} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis domain={[80, 120]} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsDashboard;
