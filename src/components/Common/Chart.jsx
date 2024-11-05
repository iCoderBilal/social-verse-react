// AdminDashboard.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export const DoughnutChart = ({ labels = [], data = [], color = [] }) => {
  const doughnutData = {
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
    <Doughnut data={doughnutData} options={options} />
  )
}