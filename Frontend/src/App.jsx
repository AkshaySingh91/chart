import React, { useState } from 'react';
import FileUpload from './Fileupload';
import ChartRenderer from './ChartRenderer';
import InsightsPanel from './InsightsPanel';
import "./index.css";

// Import Chart.js components and register them
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


function App() {
  const [processedData, setProcessedData] = useState(null);
  const [chartType, setChartType] = useState('line');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sales Dashboard</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <FileUpload onDataProcessed={setProcessedData} />
        </div>

        {processedData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <InsightsPanel data={processedData} />
            </div>

            <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Visualization</h2>
                <select
                  onChange={(e) => setChartType(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-white text-gray-700"
                >
                  {['line', 'bar', 'pie', 'scatter', 'doughnut', 'radar', 'polarArea'].map(type => (
                    <option key={type} value={type}>{type.toUpperCase()} CHART</option>
                  ))}
                </select>
              </div>

              <ChartRenderer data={processedData} chartType={chartType} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
