import React, { useEffect, useState } from 'react';

const EstimationHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Failed to load history', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Estimation History</h2>
      {history.length === 0 ? (
        <p className="text-gray-600">No estimations saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item, idx) => (
            <li key={idx} className="border-b pb-4">
              <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹{item.total}</p>
              <p><strong>Labor:</strong> {item.laborHours} hours × ₹{item.laborRate}</p>
              <p><strong>Materials:</strong></p>
              <ul className="ml-4 list-disc">
                {item.materials.map((mat, i) => (
                  <li key={i}>{mat.name} - {mat.quantity} units</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EstimationHistory;
