import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = ({ breakdown }) => {
  const pieColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const materialVsLaborData = [
    { name: 'Materials', value: breakdown.materials },
    { name: 'Labor', value: breakdown.labor },
  ];

  // Map the material breakdown data
  const materialBreakdownData = breakdown.materialBreakdown || [];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        📊 Estimation Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Materials vs Labor */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Materials vs Labor Cost
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={materialVsLaborData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {materialVsLaborData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Material-wise Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Material-wise Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={materialBreakdownData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {materialBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
