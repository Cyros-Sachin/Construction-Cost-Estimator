import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dashboard from './Dashboard';

const EstimatorForm = () => {
  const [materials, setMaterials] = useState([
    { name: 'Cement', quantity: 0 },
    { name: 'Steel', quantity: 0 },
    { name: 'Bricks', quantity: 0 }
  ]);
  const [laborHours, setLaborHours] = useState(0);
  const [laborRate, setLaborRate] = useState(0);
  const [result, setResult] = useState(null);
  const [optimizedResult, setOptimizedResult] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...materials];
    updated[index].quantity = parseInt(value) || 0;
    setMaterials(updated);
  };

  const handleEstimate = async () => {
    const response = await fetch('https://construction-cost-estimator-production.up.railway.app/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materials, laborHours, laborRate }),
    });
    const data = await response.json();
    setResult(data);
  };

  const handleOptimize = async () => {
    const response = await fetch('https://construction-cost-estimator-production.up.railway.app/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materials, laborHours, laborRate }),
    });
    const data = await response.json();
    setOptimizedResult(data);
  };

  const handleSaveEstimation = async () => {
    if (!result || !optimizedResult) {
      alert('Please generate and optimize estimation first.');
      return;
    }

    try {
      const res = await fetch('https://construction-cost-estimator-production.up.railway.app/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materials,
          laborHours,
          laborRate,
          total: result.total,
          optimizedTotal: optimizedResult.optimizedTotal,
          suggestions: optimizedResult.suggestions
        })
      });

      const data = await res.json();
      console.log('Saved successfully:', data);
      alert('Estimation saved!');
    } catch (err) {
      console.error('Error saving estimation:', err);
      alert('Failed to save estimation.');
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('pdf-report');

    if (!input) {
      alert('Please wait for the content to be loaded.');
      return;
    }

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cost-estimation-report.pdf');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF.');
    });
  };

  return (
    <div id="pdf-report">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-3xl space-y-6 mt-10 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🏗️ Construction Cost Estimator
        </h2>

        {materials.map((mat, idx) => (
          <div key={mat.name} className="flex justify-between items-center">
            <label className="font-medium text-gray-700">{mat.name} Quantity:</label>
            <input
              type="number"
              className="border border-gray-300 p-3 w-36 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={mat.quantity}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-between items-center">
          <label className="font-medium text-gray-700">Labor Hours:</label>
          <input
            type="number"
            className="border border-gray-300 p-3 w-36 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={laborHours}
            onChange={(e) => setLaborHours(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-medium text-gray-700">Labor Rate:</label>
          <input
            type="number"
            className="border border-gray-300 p-3 w-36 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={laborRate}
            onChange={(e) => setLaborRate(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={handleEstimate}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            📐 Estimate Cost
          </button>
          <button
            onClick={handleOptimize}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            🧠 Optimize Cost
          </button>
          <button
            onClick={generatePDF}
            className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            📄 Download PDF
          </button>
          <button
            onClick={handleSaveEstimation}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            💾 Save Estimation
          </button>
        </div>

        {result && <Dashboard breakdown={result.breakdown} />}

        {optimizedResult && (
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ✨ Optimized Estimation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-2xl bg-gray-50 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Original</h4>
                <p><strong>Total:</strong> ₹{result.total}</p>
                <p><strong>Material:</strong> ₹{result.breakdown.materials}</p>
                <p><strong>Labor:</strong> ₹{result.breakdown.labor}</p>
              </div>

              <div className="p-6 border rounded-2xl bg-green-50 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-2">Optimized</h4>
                <p><strong>Total:</strong> ₹{optimizedResult.optimizedTotal}</p>
                <p><strong>Material:</strong> ₹{optimizedResult.breakdown.materials}</p>
                <p><strong>Labor:</strong> ₹{optimizedResult.breakdown.labor}</p>
                <p className="mt-2 text-green-700 font-medium">
                  🔻 Saved ₹{result.total - optimizedResult.optimizedTotal}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Suggestions:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {optimizedResult.suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimatorForm;
