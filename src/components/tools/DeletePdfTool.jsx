import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api";

export default function DeletePdfTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  // =============================
  // FILE UPLOAD
  // =============================
  const handleFile = async (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      return setError("Select a valid PDF");
    }

    setSelectedFile(file);
    setError(null);
    setDownloadUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");

      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const totalPages = pdf.getPageCount();

      const thumbList = [];

      for (let i = 0; i < totalPages; i++) {
        // SAME placeholder thumbnail logic
        const canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 200;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#eaeaea";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText(`Page ${i + 1}`, 40, 100);

        thumbList.push({
          id: i + 1,
          pageNumber: i + 1,
          image: canvas.toDataURL("image/png"),
        });
      }

      setThumbnails(thumbList);
    } catch (err) {
      console.error(err);
      setError("Error reading PDF");
    }
  };

  // =============================
  // DELETE PAGE (FRONTEND ONLY)
  // =============================
  const handleDeletePage = (pageNumber) => {
    const updated = thumbnails.filter(
      (item) => item.pageNumber !== pageNumber
    );
    setThumbnails(updated);
  };

  // =============================
  // SEND TO BACKEND
  // =============================
  const handleDelete = async () => {
    if (!selectedFile) return setError("Upload a PDF first");
    if (thumbnails.length === 0)
      return setError("All pages deleted");

    // Pages to keep
    const keepPages = thumbnails.map((t) => t.pageNumber);

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("keepPages", JSON.stringify(keepPages));

      abortRef.current = new AbortController();

      const resp = await api.post("/delete-pages", formData, {
        responseType: "blob",
        signal: abortRef.current.signal,
      });

      setDownloadUrl(URL.createObjectURL(resp.data));
    } catch (err) {
      console.error(err);
      setError("Failed to delete pages");
    }

    setLoading(false);
  };

  return (
    <div className="card p-4">
      <h3>Delete PDF Pages</h3>

      <FileUploader
        onFilesSelected={handleFile}
        accept="application/pdf"
        fileName={selectedFile ? selectedFile.name : ""}
      />

      {thumbnails.length > 0 && (
        <div className="mt-4">
          <h5 className="fw-bold">Click ❌ to delete pages</h5>

          <div className="d-flex flex-wrap gap-3">
            {thumbnails.map((item) => (
              <div
                key={item.id}
                style={{
                  width: "150px",
                  height: "220px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "5px",
                  background: "white",
                  textAlign: "center",
                }}
              >
                <img
                  src={item.image}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div className="fw-bold mt-1">
                  Page {item.pageNumber}
                </div>

                <button
                  className="btn btn-sm btn-danger mt-1"
                  onClick={() => handleDeletePage(item.pageNumber)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
         <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary "
        disabled={!selectedFile || loading}
        onClick={handleDelete}
      >
        {loading ? "Processing..." : "Delete Pages"}
      </button>

      {downloadUrl && (
        <a
          className="btn btn-success "
          href={downloadUrl}
          download="pages-deleted.pdf"
        >
          Download PDF
        </a>
      )}
</div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
