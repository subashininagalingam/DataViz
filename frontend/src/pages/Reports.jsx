import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import {
  Table,
  Button,
  Spinner,
  Card,
  Container,
  Modal,
  Form
} from "react-bootstrap";
import { Chart } from "react-google-charts";
import "./Reports.css";

const Reports = ({ username }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & chart state
  const [showModal, setShowModal] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);

  // Load reports list
  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await api.get(`/reports?username=${username}`);
        setReports(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [username]);

  // Open modal
  const openViewModal = (file) => {
    setSelectedFile(file);
    setChartType("");
    setChartData([]);
    setShowModal(true);
  };

  // View chart
  const viewChart = async () => {
    if (!chartType) {
      alert("⚠ Please select chart type");
      return;
    }

    if (!selectedFile) return;

    setLoadingChart(true);
    setChartData([]);

    try {
      const res = await api.get(`/report/${selectedFile.id}/view`);
      console.log("Chart API response:", res.data);

      let formattedData = [];

      // CASE 1: { columns, data }
      if (res.data.columns && res.data.data) {
        formattedData = [
          res.data.columns,
          ...res.data.data
        ];
      }
      // CASE 2: array of objects
      else if (Array.isArray(res.data) && res.data.length > 0) {
        const headers = Object.keys(res.data[0]);
        const rows = res.data.map(obj =>
          headers.map(h => {
            const value = obj[h];
            // number convert (important for charts)
            if (typeof value === "string" && !isNaN(value)) {
              return Number(value);
            }
            return value;
          })
        );
        formattedData = [headers, ...rows];
      } else {
        throw new Error("Invalid chart data");
      }

      setChartData(formattedData);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load chart");
    } finally {
      setLoadingChart(false);
    }
  };

  // Delete report
  const handleDelete = async (file_id) => {
    if (!window.confirm("⚠ Delete permanently?")) return;
    try {
      await api.delete(`/report/${file_id}`);
      setReports(prev => prev.filter(r => r.id !== file_id));
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
            <Table bordered hover responsive className="reports-table">
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
                        className="view-btn me-2"
                        onClick={() => openViewModal(r)}
                      >
                        View
                      </Button>

                      <Button
                        className="delete-btn"
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

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            📊 Report — {selectedFile?.file_name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Chart selector */}
          <Form.Group className="mb-3">
            <Form.Label>Select Chart Type</Form.Label>
            <Form.Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="ColumnChart">Column Chart</option>
              <option value="PieChart">Pie Chart</option>
              <option value="Table">Table</option>
              <option value="ComboChart">Combo Chart</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" onClick={viewChart}>
            View Chart
          </Button>

          {/* Chart view */}
          <div className="mt-4">
            {loadingChart && <p>Loading chart...</p>}

            {!loadingChart && chartData.length > 0 && (
              <Chart
                chartType={chartType}
                width="100%"
                height="350px"
                data={chartData}
                loader={<p>Loading chart...</p>}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reports;
