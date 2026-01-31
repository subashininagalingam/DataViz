import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import {
  Table,
  Button,
  Spinner,
  Card,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { Chart } from "react-google-charts";
import "./Reports.css";

/* ✅ Chart options */
const CHART_OPTIONS = {
  ColumnChart: {},
  BarChart: {},
  LineChart: {},
  AreaChart: {},
  PieChart: {},
  Table: {
    showRowNumber: true,
    width: "100%",
  },
  ComboChart: {
    seriesType: "bars",
    series: { 1: { type: "line" } },
  },
};

/* ✅ FIXED data formatter (NO STRING ERROR) */
const prepareChartData = (rawData, chartType) => {
  let formatted = [];

  // Case 1: backend returns array of objects
  if (Array.isArray(rawData) && rawData.length > 0) {
    const headers = Object.keys(rawData[0]);

    const rows = rawData.map((obj) =>
      headers.map((h, index) => {
        const value = obj[h];

        // X-axis (first column) → string allowed
        if (index === 0) return value;

        // Y-axis → force number
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      })
    );

    formatted = [headers, ...rows];
  }

  // Case 2: backend returns { columns, data }
  if (rawData?.columns && rawData?.data) {
    formatted = [
      rawData.columns,
      ...rawData.data.map((row) =>
        row.map((v, i) => (i === 0 ? v : Number(v) || 0))
      ),
    ];
  }

  // PieChart must have only 2 columns
  if (chartType === "PieChart" && formatted.length > 0) {
    formatted = formatted.map((row, i) =>
      i === 0 ? row.slice(0, 2) : [row[0], Number(row[1]) || 0]
    );
  }

  return formatted;
};

const Reports = ({ username }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);

  /* ✅ Load reports */
  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await api.get(`/reports?username=${username}`);
        setReports(res.data);
      } catch {
        alert("❌ Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [username]);

  const openViewModal = (file) => {
    setSelectedFile(file);
    setChartType("");
    setChartData([]);
    setShowModal(true);
  };

  /* ✅ View chart */
  const viewChart = async () => {
    if (!chartType) return alert("⚠ Select chart type");

    setLoadingChart(true);
    try {
      const res = await api.get(`/report/${selectedFile.id}/view`);
      const data = prepareChartData(res.data, chartType);
      setChartData(data);
    } catch {
      alert("❌ Failed to load chart");
    } finally {
      setLoadingChart(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await api.delete(`/report/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="reports-page">
      <Container className="py-5 text-center">
        <Card className="p-4 reports-card">
          <h2 className="fw-bold mb-4 text-info">📁 Uploaded Reports</h2>

          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>File Name</th>
                  <th>Uploaded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.file_name}</td>
                    <td>{new Date(r.uploaded_at).toLocaleString()}</td>
                    <td>
                      <Button
                        className="me-2"
                        onClick={() => openViewModal(r)}
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            📊 Report — {selectedFile?.file_name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Chart Type</Form.Label>
            <Form.Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="ColumnChart">Column</option>
              <option value="BarChart">Bar</option>
              <option value="LineChart">Line</option>
              <option value="AreaChart">Area</option>
              <option value="PieChart">Pie</option>
              <option value="ComboChart">Combo</option>
              <option value="Table">Table</option>
            </Form.Select>
          </Form.Group>

          <Button onClick={viewChart}>View Chart</Button>

          <div className="mt-4">
            {loadingChart && <p>Loading chart...</p>}

            {!loadingChart && chartData.length > 0 && (
              <Chart
                key={chartType} // 🔥 force re-render
                chartType={chartType}
                width="100%"
                height="350px"
                data={chartData}
                options={CHART_OPTIONS[chartType] || {}}
                loader={<p>Loading...</p>}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reports;
