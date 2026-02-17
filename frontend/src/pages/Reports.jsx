import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Reports.css";

/* ======================
   DEMO DATA (replace later with CSV)
====================== */
const DATA = [
  { month: "Jan", sales: 400, profit: 240 },
  { month: "Feb", sales: 300, profit: 180 },
  { month: "Mar", sales: 500, profit: 320 },
  { month: "Apr", sales: 450, profit: 260 },
];

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea"];

const Reports = ({ username }) => {
  /* ======================
     STATE
  ====================== */
  const [reports, setReports] = useState([
    "Q1 Sales.csv",
    "Q2 Sales.csv",
    "Revenue_2024.csv",
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [chartType, setChartType] = useState("");
  const [showChart, setShowChart] = useState(false);

  /* ======================
     ACTIONS
  ====================== */
  const openReport = (report) => {
    setSelectedReport(report);
    setChartType("");
    setShowChart(false);
  };

  const handleShowChart = () => {
    if (!chartType) {
      alert("Please select a chart type");
      return;
    }
    setShowChart(true);
  };

  const handleDelete = () => {
    if (!selectedReport) return;

    const ok = window.confirm(
      `Delete ${selectedReport}?`
    );
    if (!ok) return;

    setReports((prev) =>
      prev.filter((r) => r !== selectedReport)
    );

    setSelectedReport(null);
    setChartType("");
    setShowChart(false);
  };

  /* ======================
     CHART RENDER
  ====================== */
  const renderChart = () => {
    if (!showChart) return null;

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={DATA}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" />
            <Bar dataKey="profit" />
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={DATA}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="sales" strokeWidth={2} />
            <Line dataKey="profit" strokeWidth={2} />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={DATA}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area dataKey="sales" />
            <Area dataKey="profit" />
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={DATA}
              dataKey="sales"
              nameKey="month"
              outerRadius={120}
              label
            >
              {DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            <XAxis dataKey="sales" />
            <YAxis dataKey="profit" />
            <Tooltip />
            <Legend />
            <Scatter data={DATA} fill="#2563eb" />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="reports-page">
      <h2 className="reports-title">📊 Reports</h2>
      <p className="reports-user">
        User: <b>{username}</b>
      </p>

      <div className="reports-layout">
        {/* LEFT: REPORT HISTORY */}
        <div className="report-history">
          <h4>📁 Report History</h4>

          {reports.length === 0 && (
            <p className="helper-text">
              No reports available
            </p>
          )}

          {reports.map((r) => (
            <div
              key={r}
              className={`report-item ${
                selectedReport === r ? "active" : ""
              }`}
              onClick={() => openReport(r)}
            >
              {r}
            </div>
          ))}
        </div>

        {/* RIGHT: CHART VIEW */}
        <div className="report-view">
          {!selectedReport && (
            <p className="helper-text">
              Select a report to view charts
            </p>
          )}

          {selectedReport && (
            <>
              <div className="report-title">
                {selectedReport}
              </div>

              <div className="report-controls">
                <select
                  value={chartType}
                  onChange={(e) =>
                    setChartType(e.target.value)
                  }
                >
                  <option value="">Select Chart</option>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="area">Area</option>
                  <option value="pie">Pie</option>
                  <option value="scatter">Scatter</option>
                </select>

                <button
                  className="btn-show"
                  onClick={handleShowChart}
                >
                  Show Chart
                </button>

                <button
                  className="btn-delete"
                  onClick={handleDelete}
                >
                  Delete File
                </button>
              </div>

              {!showChart && (
                <p className="helper-text">
                  Choose a chart and click <b>Show Chart</b>
                </p>
              )}

              {showChart && (
                <div className="chart-box">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
