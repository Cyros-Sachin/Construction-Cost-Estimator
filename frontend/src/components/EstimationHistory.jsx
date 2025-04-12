import React, { useEffect, useState } from 'react';

const EstimationHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://construction-cost-estimator-production.up.railway.app/api/history');
        const data = await res.json();
        setHistory(data);
        console.log(data);

      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📚 Estimation History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">No estimations saved yet.</p>
      ) : (
        <div className="space-y-6">
          {history.map((item, index) => (
            <div
              // {...console.log(item)}
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">🧱 Materials</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {item.materials.map((mat, i) => (
                      <li key={i}>
                        {mat.name}: {mat.quantity} units
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">👷 Labor</h4>
                  <p className="text-sm text-gray-600">
                    Hours: {item.laborHours}, Rate: ₹{item.laborRate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-medium text-gray-700 mb-1">Total Cost</h5>
                  <p className="text-lg font-semibold text-gray-800">₹{item.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h5 className="font-medium text-gray-700 mb-1">Optimized Cost</h5>
                  <p className="text-lg font-semibold text-green-700">₹{item.optimizedTotal}</p>
                  <p className="text-sm text-green-600 mt-1">
                    Saved ₹{item.total - item.optimizedTotal}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-1">💡 Suggestions</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {item.suggestions && item.suggestions.length > 0 ? (
                    item.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No suggestions available.</p>
                  )}
                </ul>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EstimationHistory;
