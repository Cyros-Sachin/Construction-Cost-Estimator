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
    const response = await fetch('http://localhost:5000/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materials, laborHours, laborRate }),
    });
    const data = await response.json();
    setResult(data);
  };

  const handleOptimize = async () => {
    const response = await fetch('http://localhost:5000/api/optimize', {
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
      const res = await fetch('http://localhost:5000/api/save', {
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

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('cost-estimation-report.pdf');
    });
  };

  return (
    <div id="pdf-report">
      <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-4 mt-10">
        <h2 className="text-2xl font-bold">Construction Cost Estimator</h2>

        {materials.map((mat, idx) => (
          <div key={mat.name} className="flex justify-between items-center">
            <label className="font-medium">{mat.name} Quantity:</label>
            <input
              type="number"
              className="border p-2 w-32 rounded"
              value={mat.quantity}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-between items-center">
          <label className="font-medium">Labor Hours:</label>
          <input
            type="number"
            className="border p-2 w-32 rounded"
            value={laborHours}
            onChange={(e) => setLaborHours(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-medium">Labor Rate:</label>
          <input
            type="number"
            className="border p-2 w-32 rounded"
            value={laborRate}
            onChange={(e) => setLaborRate(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-x-4">
          <button
            onClick={handleEstimate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Estimate Cost
          </button>
          <button
            onClick={handleOptimize}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Optimize Cost
          </button>
          <button
            onClick={generatePDF}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Download PDF
          </button>
          <button
            onClick={handleSaveEstimation}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Estimation
          </button>
        </div>

        {result && <Dashboard breakdown={result.breakdown} />}


        {optimizedResult && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Optimized Estimation</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 border rounded-xl bg-gray-50">
                <h4 className="font-bold mb-2">Original</h4>
                <p><strong>Total:</strong> ₹{result.total}</p>
                <p><strong>Material:</strong> ₹{result.breakdown.materials}</p>
                <p><strong>Labor:</strong> ₹{result.breakdown.labor}</p>
              </div>

              <div className="p-4 border rounded-xl bg-green-50">
                <h4 className="font-bold mb-2">Optimized</h4>
                <p><strong>Total:</strong> ₹{optimizedResult.optimizedTotal}</p>
                <p><strong>Material:</strong> ₹{optimizedResult.breakdown.materials}</p>
                <p><strong>Labor:</strong> ₹{optimizedResult.breakdown.labor}</p>
                <p className="mt-2 text-sm text-green-700">
                  ↓ Saved ₹{result.total - optimizedResult.optimizedTotal}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Suggestions:</h4>
              <ul className="list-disc ml-6">
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
