import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ breakdown }) => {
  if (!breakdown) return null;

  const data = {
    labels: ['Materials', 'Labor'],
    datasets: [
      {
        label: 'Cost Breakdown',
        data: [breakdown.materials, breakdown.labor],
        backgroundColor: ['#60A5FA', '#34D399'],
        borderColor: ['#3B82F6', '#10B981'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow rounded-2xl">
      <h3 className="text-xl font-bold mb-4 text-center">Cost Breakdown</h3>
      <Pie data={data} />
    </div>
  );
};

export default Dashboard;
