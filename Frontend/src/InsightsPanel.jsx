import React from 'react';

const InsightsPanel = ({ data }) => {
  const calculateInsights = () => {
    const products = data.rawData.reduce((acc, item) => {
      if (!acc[item.Product]) {
        acc[item.Product] = { count: 0, totalProfit: 0, totalSales: 0 };
      }
      acc[item.Product].count++;
      acc[item.Product].totalProfit += Number(item.Profit);
      acc[item.Product].totalSales += Number(item.Sales);
      return acc;
    }, {});
    const mostSold = Object.entries(products).sort((a, b) => b[1].count - a[1].count)[0];
    const mostProfitable = Object.entries(products).sort((a, b) => b[1].totalProfit - a[1].totalProfit)[0];

    return {
      totalProducts: data.rawData.length,
      totalSales: data.rawData.reduce((sum, item) => sum + Number(item.Sales), 0),
      totalProfit: data.rawData.reduce((sum, item) => sum + Number(item.Profit), 0),
      mostSold: mostSold ? `${mostSold[0]} (${mostSold[1].count})` : 'N/A',
      mostProfitable: mostProfitable ? `${mostProfitable[0]} ($${mostProfitable[1].totalProfit})` : 'N/A'
    };
  };

  const insights = calculateInsights();

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-600">Total Products Sold</h3>
        <p className="mt-2 text-2xl font-semibold text-blue-700">{insights.totalProducts}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-600">Total Sales</h3>
        <p className="mt-2 text-2xl font-semibold text-green-700">${insights.totalSales}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-600">Most Popular Product</h3>
        <p className="mt-2 text-lg font-semibold text-purple-700">{insights.mostSold}</p>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-indigo-600">Most Profitable Product</h3>
        <p className="mt-2 text-lg font-semibold text-indigo-700">{insights.mostProfitable}</p>
      </div>
    </div>
  );
};

export default InsightsPanel;
