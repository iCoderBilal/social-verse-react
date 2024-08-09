// AdminDashboard.js
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


export const BarChart = ({ labels = [], label = [], data = [], color = '#6b0092' }) => {
  // Bar chart data
  const barData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
        barPercentage: 0.5,
      },
    ],
  };
  return (
    <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
  )
}
export const PieChart = ({ labels = [], data = [], color = [] }) => {

  // Pie chart data
  const pieData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  }
  return (
    <Pie data={pieData} options={options} />
  )
}

