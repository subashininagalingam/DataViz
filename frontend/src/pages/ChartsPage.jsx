import React from "react";
import { Chart } from "react-google-charts";
import "./ChartsPage.css";

const sampleData = [
  ["Month", "Sales", "Expenses", "Profit"],
  ["Jan", 12000, 5000, 7000],
  ["Feb", 15000, 6000, 9000],
  ["Mar", 18000, 7000, 11000],
  ["Apr", 21000, 9000, 12000],
  ["May", 25000, 11000, 14000],
];

const ChartsPage = () => {
  const charts = [
    { type: "PieChart", title: "Sales Pie Chart", options: { pieHole: 0 } },
    { type: "PieChart", title: "Sales Donut Chart", options: { pieHole: 0.6 } },
    { type: "BarChart", title: "Sales Bar Chart" },
    { type: "ColumnChart", title: "Sales Column Chart" },
    { type: "LineChart", title: "Sales Line Chart", options: { curveType: "function" } },
    { type: "AreaChart", title: "Sales Area Chart" },
    { type: "ComboChart", title: "Sales vs Expenses", options: { seriesType: "bars", series: { 2: { type: "line" } } } },
    { type: "ScatterChart", title: "Profit Scatter Chart" },
    { type: "BubbleChart", title: "Sales Bubble Chart" },
    { type: "SteppedAreaChart", title: "Stepped Area Chart" },
    { type: "Histogram", title: "Profit Histogram" },
    {
      type: "Gauge",
      title: "Performance Gauge",
      data: [["Label", "Value"], ["Performance", 80]],
      options: {
        width: 300,
        height: 250,
        redFrom: 0,
        redTo: 30,
        yellowFrom: 30,
        yellowTo: 70,
        greenFrom: 70,
        greenTo: 100,
        minorTicks: 5,
      },
    },
    {
      type: "CandlestickChart",
      title: "Candlestick Chart",
      data: [
        ["Day", "Low", "Open", "Close", "High"],
        ["Mon", 20, 28, 38, 45],
        ["Tue", 31, 38, 55, 66],
        ["Wed", 50, 55, 77, 80],
        ["Thu", 77, 77, 66, 50],
        ["Fri", 68, 66, 22, 15],
      ],
    },
    {
      type: "Table",
      title: "Data Table",
      data: [["Month", "Sales", "Expenses", "Profit"], ...sampleData.slice(1)],
    },
    {
      type: "GeoChart",
      title: "Geo Distribution",
      data: [
        ["Country", "Popularity"],
        ["Germany", 200],
        ["United States", 300],
        ["Brazil", 400],
        ["Canada", 500],
        ["France", 600],
        ["RU", 700],
      ],
    },
  ];

  return (
    <div className="charts-page">
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="container py-5 text-center">
        <h1 className="charts-title">📊 Data Visualization Dashboard</h1>
        <p className="charts-subtext">Explore various chart types powered by Google Charts</p>

        <div className="row g-4 mt-4">
          {charts.map((chart, index) => {
            const data = chart.data || sampleData;
            const options = { title: chart.title, ...chart.options };

            return (
              <div key={index} className="col-md-6">
                <div className="chart-card p-3 shadow-sm">
                  <h5 className="text-info fw-semibold mb-2">{chart.title}</h5>
                  <Chart
                    chartType={chart.type}
                    width="100%"
                    height="260px"
                    data={data}
                    options={options}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
