import React, { useState } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function AddPageNumbersTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageMode, setPageMode] = useState("single");
  const [position, setPosition] = useState("bottom-center");
  const [margin, setMargin] = useState(20);
  const [firstNumber, setFirstNumber] = useState(1);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState("");
  const [font, setFont] = useState("Helvetica");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF");
    }
    setPdfFile(file);
    setError(null);
    setDownloadUrl(null);
  };

  const handleAddNumbers = async () => {
    if (!pdfFile) return setError("Upload a PDF first");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("pageMode", pageMode);
      formData.append("position", position);
      formData.append("margin", margin);
      formData.append("firstNumber", firstNumber);
      formData.append("fromPage", fromPage);
      formData.append("toPage", toPage);
      formData.append("font", font);

      const resp = await api.post("/add-page-numbers", formData, {
        responseType: "blob",
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Failed to add page numbers");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Add Page Numbers</h3>

      <FileUploader
        onFilesSelected={handleFile}
        accept="application/pdf"
        fileName={pdfFile?.name}
      />

      {/* Page Mode */}
      <div className="mt-3">
        <label className="fw-bold">Page mode</label>
        <select
          className="form-select"
          value={pageMode}
          onChange={(e) => setPageMode(e.target.value)}
        >
          <option value="single">Single page</option>
          <option value="facing">Facing pages</option>
        </select>
      </div>

      {/* Position */}
      <div className="mt-3">
        <label className="fw-bold">Position</label>
        <select
          className="form-select"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="bottom-center">Bottom – Center</option>
          <option value="bottom-right">Bottom – Right</option>
          <option value="bottom-left">Bottom – Left</option>
          <option value="top-center">Top – Center</option>
        </select>
      </div>

      {/* Margin */}
      <div className="mt-3">
        <label className="fw-bold">Margin (px)</label>
        <input
          type="number"
          className="form-control"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
        />
      </div>

      {/* Page Range */}
      <div className="row mt-3">
        <div className="col">
          <label className="fw-bold">From page</label>
          <input
            type="number"
            className="form-control"
            value={fromPage}
            onChange={(e) => setFromPage(e.target.value)}
          />
        </div>
        <div className="col">
          <label className="fw-bold">To page</label>
          <input
            type="number"
            className="form-control"
            value={toPage}
            onChange={(e) => setToPage(e.target.value)}
            placeholder="Last page"
          />
        </div>
      </div>

      {/* First Number */}
      <div className="mt-3">
        <label className="fw-bold">First number</label>
        <input
          type="number"
          className="form-control"
          value={firstNumber}
          onChange={(e) => setFirstNumber(e.target.value)}
        />
      </div>

      {/* Font */}
      <div className="mt-3">
        <label className="fw-bold">Text format</label>
        <select
          className="form-select"
          value={font}
          onChange={(e) => setFont(e.target.value)}
        >
          <option value="Helvetica">Arial</option>
          <option value="TimesRoman">Times New Roman</option>
          <option value="Courier">Courier</option>
        </select>
      </div>
    
      
      <button
        className="btn btn-primary mt-4"
        disabled={!pdfFile || loading}
        onClick={handleAddNumbers}
      >
        {loading ? "Processing..." : "Add Page Numbers"}
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="page-numbered.pdf"
          className="btn btn-success mt-3"
        >
          Download PDF
        </a>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
