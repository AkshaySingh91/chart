import React from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import ErrorBoundary from "./ErrorBoundary"

const ChartRenderer = ({ data, chartType }) => {
  const chartRef = React.useRef();
  const processData = (chartType) => {
    // For Bar/Line/Pie (Quarterly Aggregation)
    if (chartType !== 'scatter') {
      const labels = Object.keys(data.quarterlyData);
      const salesData = labels.map(q =>
        data.quarterlyData[q].reduce((acc, cur) => acc + Number(cur.Sales), 0)
      );

      return {
        labels,
        datasets: [{
          label: 'Sales by Quarter',
          data: salesData,
          backgroundColor: 'rgba(75,192,192,0.4)',
        }]
      };
    }

    // For Scatter Plot (Individual Data Points)
    return {
      datasets: [{
        label: 'Sales vs Profit',
        data: data.rawData.map(item => ({
          x: Number(item.Sales),
          y: Number(item.Profit)
        })),
        backgroundColor: 'rgba(255,99,132,1)'
      }]
    };
  };
  const downloadChart = () => {
    html2canvas(chartRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const renderChart = () => {
    const chartData = processData(chartType);

    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
      scales: chartType === 'scatter' ? {
        x: { type: 'linear', position: 'bottom' }
      } : undefined
    };

    switch (chartType) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData} options={options} />;
      case 'line':
        return <Line ref={chartRef} data={chartData} options={options} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData} options={options} />;
      case 'scatter':
        return <Scatter ref={chartRef} data={chartData} options={options} />;
      default:
        return null;
    }
  };
  // Wrap chart rendering with ErrorBoundary
  return (
    <div>
      <ErrorBoundary>
        <div style={{ width: '600px' }}>{renderChart()}</div>
      </ErrorBoundary>
      <button onClick={downloadChart}>Download Chart</button>
    </div>
  );
};

export default ChartRenderer;