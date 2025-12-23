import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function AddWatermarkTool() {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [type, setType] = useState("text"); // text | image

  const [text, setText] = useState("Sampletext");
  const [position, setPosition] = useState("center");
  const [opacity, setOpacity] = useState(1);
const [rotation, setRotation] = useState(30);

  const [totalPages, setTotalPages] = useState(0);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [layer, setLayer] = useState("over"); // over | below

  

  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

const handlePdf = async (files) => {
  const file = files[0];
  if (!file || file.type !== "application/pdf") {
    return setError("Select a valid PDF");
  }

  setPdfFile(file);
  setError(null);
  setDownloadUrl(null);

  try {
    const { PDFDocument } = await import("pdf-lib");
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);

    const pages = pdf.getPageCount();

    setTotalPages(pages);
    setFromPage(1);
    setToPage(pages);
  } catch (err) {
    console.error(err);
    setError("Failed to read PDF pages");
  }
};


  const handleApplyWatermark = async () => {
    if (!pdfFile) return setError("Upload a PDF first");

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("type", type);
      formData.append("text", text);
      formData.append("position", position);
      formData.append("opacity", opacity);
      formData.append("rotation", rotation);
      formData.append("fromPage", fromPage);
      formData.append("toPage", toPage);
      formData.append("layer", layer);

      if (type === "image" && imageFile) {
        formData.append("image", imageFile);
      }

      abortRef.current = new AbortController();

      const resp = await api.post("/watermark", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Failed to apply watermark");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Add Watermark to PDF</h3>

      <FileUploader
        onFilesSelected={handlePdf}
        accept="application/pdf"
        fileName={pdfFile ? pdfFile.name : ""}
      />

      <hr />

      {/* Watermark Type */}
      <div className="mb-3">
        <label className="fw-bold">Watermark Type</label>
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Text Watermark */}
      {type === "text" && (
        <div className="mb-3">
          <label className="fw-bold">Text</label>
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      {/* Image Watermark */}
      {type === "image" && (
        <div className="mb-3">
          <label className="fw-bold">Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Position */}
      <div className="mb-3">
        <label className="fw-bold">Position</label>
        <select
          className="form-select"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="center">Center</option>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      {/* Transparency */}
      <div className="mb-3">
        <label className="fw-bold">Transparency</label>
        <input
          type="range"
          className="form-range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(e.target.value)}
        />
      </div>

      {/* Rotation */}
      <div className="mb-3">
        <label className="fw-bold">Rotation (degrees)</label>
        <input
          type="number"
          className="form-control"
          value={rotation}
          onChange={(e) => setRotation(e.target.value)}
        />
      </div>

      {/* Pages */}
      <div className="row mb-3">
  <div className="col">
    <label className="fw-bold">
      From page (1 – {totalPages})
    </label>
    <input
      type="number"
      className="form-control"
      min={1}
      max={totalPages}
      value={fromPage}
      onChange={(e) =>
        setFromPage(
          Math.min(Math.max(1, Number(e.target.value)), totalPages)
        )
      }
    />
  </div>

  <div className="col">
    <label className="fw-bold">
      To page (1 – {totalPages})
    </label>
    <input
      type="number"
      className="form-control"
      min={fromPage}
      max={totalPages}
      value={toPage}
      onChange={(e) =>
        setToPage(
          Math.min(Math.max(fromPage, Number(e.target.value)), totalPages)
        )
      }
    />
  </div>
</div>


      {/* Layer */}
      <div className="mb-3">
        <label className="fw-bold">Layer</label>
        <select
          className="form-select"
          value={layer}
          onChange={(e) => setLayer(e.target.value)}
        >
          <option value="over">Over the PDF content</option>
          <option value="below">Below the PDF content</option>
        </select>
      </div>
        <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary"
        disabled={!pdfFile || loading}
        onClick={handleApplyWatermark}
      >
        {loading ? "Processing..." : "Apply Watermark"}
      </button>

      {downloadUrl && (
        <a
          className="btn btn-success "
          href={downloadUrl}
          download="watermarked.pdf"
        >
          Download PDF
        </a>
      )}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
