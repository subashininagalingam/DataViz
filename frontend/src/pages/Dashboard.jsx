import React, { useState } from "react";
import { Chart } from "react-google-charts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../api/apiClient";
import "./Dashboard.css";

const Dashboard = ({ username }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState({ numeric: [], categorical: [] });
  const [selectedChart, setSelectedChart] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  /* ======================
     FILE HANDLING
  ====================== */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file!");

    const fd = new FormData();
    fd.append("file", file);

    try {
      await api.post(`/upload?username=${username}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const rep = await api.get(`/reports?username=${username}`);
      const latest = rep.data[rep.data.length - 1];
      const parsed = JSON.parse(latest.data);

      const numericCols = [];
      const categoricalCols = [];
      const first = parsed[0];

      Object.keys(first).forEach((k) => {
        if (!isNaN(first[k])) numericCols.push(k);
        else categoricalCols.push(k);
      });

      setColumns({ numeric: numericCols, categorical: categoricalCols });
      setData(parsed);
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  /* ======================
     CHART DATA
  ====================== */
  const cat = columns.categorical[0];
  const num = columns.numeric[0];

  const baseData = data
    ? [[cat, num], ...data.map((row) => [row[cat], Number(row[num])])]
    : [];

  const bubbleData = () => {
    if (columns.numeric.length < 3) return null;
    const [x, y, size] = columns.numeric;

    return [
      ["ID", x, y, size],
      ...data.map((row, i) => [
        `Point ${i + 1}`,
        Number(row[x]),
        Number(row[y]),
        Number(row[size]),
      ]),
    ];
  };

  const allCharts = [
    "BarChart",
    "ColumnChart",
    "PieChart",
    "LineChart",
    "AreaChart",
    "ScatterChart",
    "Histogram",
    "ComboChart",
    "BubbleChart",
    "SteppedAreaChart",
    "Table",
  ];

  /* ======================
     PDF EXPORT
  ====================== */
  const generateImage = async () => {
    const chartContainer = document.querySelector(".single-chart");
    if (!chartContainer) return null;

    const canvas = await html2canvas(chartContainer, { scale: 2 });
    return canvas.toDataURL("image/png");
  };

  const downloadPDF = async (mode) => {
    const pdf = new jsPDF("landscape");

    if (mode === "SINGLE") {
      const img = await generateImage();
      if (!img) return alert("Chart not loaded ❌");

      pdf.text(`${selectedChart} Chart`, 10, 10);
      pdf.addImage(img, "PNG", 10, 20, 270, 150);
      pdf.save(`${selectedChart}.pdf`);
      return;
    }

    if (mode === "ALL") {
      pdf.text("All Charts Export", 15, 15);

      for (const c of allCharts) {
        setSelectedChart(c);
        await new Promise((r) => setTimeout(r, 900));

        const img = await generateImage();
        if (img) {
          pdf.addPage();
          pdf.text(`${c} Chart`, 10, 10);
          pdf.addImage(img, "PNG", 10, 20, 270, 150);
        }
      }

      pdf.save("All_Charts.pdf");
    }
  };

  /* ======================
     POPUPS
  ====================== */
  const DownloadPopup = () => (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>Select Download</h3>

        <button className="popup-btn cancel" onClick={() => setShowPopup(false)}>
          ❌ Cancel
        </button>

        <button
          className="popup-btn single"
          onClick={async () => {
            setShowPopup(false);
            await downloadPDF("SINGLE");
          }}
        >
          📄 Current Chart
        </button>

        <button
          className="popup-btn all"
          onClick={() => {
            setShowPopup(false);
            downloadPDF("ALL");
          }}
        >
          📚 All Charts
        </button>
      </div>
    </div>
  );

  const UploadSuccessPopup = () => (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>🎉 Upload Successful</h3>
        <p>Dataset ready for visualization</p>
        <button className="popup-btn ok" onClick={() => setUploadSuccess(false)}>
          OK
        </button>
      </div>
    </div>
  );

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="page-wrapper">
      {showPopup && <DownloadPopup />}
      {uploadSuccess && <UploadSuccessPopup />}

      <div className="glass-card dashboard-container">
        <div className="dashboard-header">
          <h2 className="dash-title">📊 Data Visualization Dashboard</h2>
          <p className="dash-sub">
            Upload your dataset and explore insights visually
          </p>
        </div>

        {!data && (
          <div className="upload-card">
            <h3 className="section-title">📁 Upload Dataset</h3>

            <div className="upload-section">
              <input
                type="file"
                className="file-input-new"
                onChange={handleFileChange}
              />
              <button className="upload-btn-new" onClick={handleUpload}>
                ⬆ Upload File
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            <div className="chart-controls">
              <select
                className="chart-select-new"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <option value="">Select Chart Type</option>
                <option value="ALL">ALL Charts</option>
                {allCharts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {selectedChart && (
                <button
                  className="download-btn"
                  onClick={() => setShowPopup(true)}
                >
                  📥 Export PDF
                </button>
              )}
            </div>

            {selectedChart && selectedChart !== "ALL" && (
              <div className="single-chart glass-chart">
                <h3 className="chart-title">{selectedChart}</h3>

                <Chart
                  chartType={selectedChart}
                  data={
                    selectedChart === "BubbleChart"
                      ? bubbleData()
                      : baseData
                  }
                  width="100%"
                  height="420px"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
