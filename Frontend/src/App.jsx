import React, { useEffect, useState } from 'react';
import FileUpload from './Fileupload';
import ChartRenderer from './ChartRenderer';
// Add at the top of App.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineController, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
function App() {
  const [processedData, setProcessedData] = useState(null);
  const [chartType, setChartType] = useState('bar');
  useEffect(() => {
    console.log(processedData)
  }, [processedData])
  return (
    <div>
      <h1>Sales Data Visualizer</h1>
      <FileUpload onDataProcessed={setProcessedData} />

      {processedData && (
        <>
          <select onChange={(e) => setChartType(e.target.value)}>
            {['bar', 'line', 'pie', 'scatter'].map(type => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>

          <ChartRenderer
            data={processedData}
            chartType={chartType}
          />
        </>
      )}
    </div>
  );
}

export default App;