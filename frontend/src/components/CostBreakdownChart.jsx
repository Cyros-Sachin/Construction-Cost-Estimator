import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981'];

const CostBreakdownChart = ({ breakdown }) => {
  if (!breakdown) return null;

  const data = [
    { name: 'Materials', value: breakdown.materials },
    { name: 'Labor', value: breakdown.labor },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx={150}
          cy={100}
          outerRadius={80}
          label
          dataKey="value"
        >
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CostBreakdownChart;
