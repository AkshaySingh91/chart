import React from 'react';
import { Bar, Line, Pie, Scatter, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import ErrorBoundary from './ErrorBoundary';

const ChartRenderer = ({ data, chartType }) => {
  const chartRef = React.useRef();

  // Process data for each chart type
  const processData = () => {
    // Common quarterly labels
    console.log("data", data)
    const quarterlyLabels = Object.keys(data.quarterlyData); // {q1 : [], q2: [], q3: [], q4: []}

    switch (chartType) {
      case 'line':
        return {
          labels: quarterlyLabels,
          datasets: [
            {
              label: 'Sales',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
              ),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Profit',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Profit), 0)
              ),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.4,
            },
          ],
        };
      case 'bar':
        return {
          labels: quarterlyLabels,
          datasets: [
            {
              label: 'Sales',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
              ),
              backgroundColor: '#F59E0B',
            },
            {
              label: 'Profit',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Profit), 0)
              ),
              backgroundColor: '#EF4444',
            },
          ],
        };
      case 'pie':
        return {
          labels: quarterlyLabels,
          datasets: [
            {
              label: 'Sales Distribution',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
              ),
              backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444'],
            },
          ],
        };
      case 'scatter':
        return {
          datasets: [
            {
              label: 'Sales vs Profit',
              data: data.rawData.map(item => ({
                x: Number(item.Sales),
                y: Number(item.Profit),
              })),
              backgroundColor: '#8B5CF6',
            },
          ],
        };
      case 'doughnut':
        // Aggregated product sales from rawData for doughnut
        const productSales = data.rawData.reduce((acc, item) => {
          acc[item.Product] = (acc[item.Product] || 0) + Number(item.Sales);
          return acc;
        }, {});
        return {
          labels: Object.keys(productSales),
          datasets: [
            {
              label: 'Product Sales',
              data: Object.values(productSales),
              backgroundColor: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'],
            },
          ],
        };
      case 'radar':
        return {
          labels: quarterlyLabels,
          datasets: [
            {
              label: 'Sales',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
              ),
              borderColor: '#F472B6',
              backgroundColor: 'rgba(244,114,182,0.2)',
            },
            {
              label: 'Profit',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Profit), 0)
              ),
              borderColor: '#34D399',
              backgroundColor: 'rgba(52,211,153,0.2)',
            },
          ],
        };
      case 'polarArea':
        return {
          labels: quarterlyLabels,
          datasets: [
            {
              label: 'Quarterly Sales',
              data: quarterlyLabels.map(q =>
                data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
              ),
              backgroundColor: ['#F87171', '#FBBF24', '#34D399', '#60A5FA'],
            },
          ],
        };
      default:
        return {};
    }
  };

  // Download chart as image using html2canvas
  const downloadChart = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = `chart-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: `${chartType.toUpperCase()} Chart`,
        color: '#1F2937',
        font: { size: 18 },
      },
    },
    scales: chartType === 'scatter' ? {
      x: { type: 'linear', position: 'bottom', ticks: { color: '#6B7280' } },
      y: { ticks: { color: '#6B7280' } }
    } : {
      x: { grid: { display: false }, ticks: { color: '#6B7280' } },
      y: { grid: { color: '#E5E7EB' }, ticks: { color: '#6B7280' } }
    },
  };

  // Render the proper chart component based on chartType
  const renderChart = () => {
    const chartData = processData();
    console.log(chartData)
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'radar':
        return <Radar data={chartData} options={options} />;
      case 'polarArea':
        return <PolarArea data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <ErrorBoundary>
        <div className="h-96" ref={chartRef}>
          {renderChart()}
        </div>
      </ErrorBoundary>
      <button
        onClick={downloadChart}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Download Chart
      </button>
    </div>
  );
};

export default ChartRenderer;
