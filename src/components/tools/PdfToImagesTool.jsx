import React, { useState, useRef } from "react";
import FileUploader from "../FileUploader";
import api from "../../utils/api"; 
import JSZip from "jszip";

export default function PdfToImagesTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFile = (files) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") return setError("Select a PDF file");
    setSelectedFile(file);
    setPreview([]);
    setDownloadUrl(null);
    setError(null);
  };

  const handleConvert = async () => {
  if (!selectedFile) return setError("Select a PDF file first");
  setLoading(true);
  setError(null);
  setPreview([]);
  setDownloadUrl(null);

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    abortRef.current = new AbortController();

    const resp = await api.post("/pdf-to-images", formData, {
      responseType: "blob",
      signal: abortRef.current.signal,
    });

    const blob = resp.data;
    let contentType = resp.headers["content-type"] || "";

    // Safe ZIP detection
    const isZip =
      contentType.includes("zip") ||
      (blob && blob.type && blob.type.includes("zip"));

    // If backend directly returns a single image
    if (!isZip && contentType.startsWith("image/")) {
      const url = URL.createObjectURL(blob);
      setPreview([{ name: "page-1.png", url }]);
      setDownloadUrl(url);
      setDownloadName("page-1.png");
    } else {
      // ZIP case
      const zip = await JSZip.loadAsync(blob);
      const imgs = [];

      for (const fileName of Object.keys(zip.files)) {
        const file = zip.files[fileName];
        if (!file.dir) {
          const imgBlob = await file.async("blob");
          const imgUrl = URL.createObjectURL(imgBlob);
          imgs.push({ name: fileName, url: imgUrl });
        }
      }

      // If only one image inside ZIP
      if (imgs.length === 1) {
        setPreview(imgs);
        setDownloadUrl(imgs[0].url);
        setDownloadName(imgs[0].name);
      } else {
        setPreview(imgs);
        const zipUrl = URL.createObjectURL(blob);
        setDownloadUrl(zipUrl);
        setDownloadName("pdf-images.zip");
      }
    }
  } catch (err) {
    console.error(err);
    setError("Conversion failed");
  }

  setLoading(false);
};




  return (
    <div className="card p-4">
      <h3>PDF to Images</h3>

<FileUploader
  onFilesSelected={handleFile}
  accept="application/pdf"
  fileName={selectedFile ? selectedFile.name : ""}
/>
      
      
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleConvert} disabled={loading}>
          {loading ? "Processing..." : "Convert"}
        </button>
        {loading && <button className="btn btn-outline-secondary" onClick={() => abortRef.current?.abort()}>Cancel</button>}
      

     

      {downloadUrl && (
        <a className="btn btn-success" href={downloadUrl} download={downloadName}>
          Download
        </a>
      )}
      </div>
      {preview.length > 0 && (
        <div className="mt-3">
          <h5>Preview</h5>
          <div className="image-preview-grid">
            {preview.map((img, i) => (
              <div key={i} className="image-card">
                <img src={img.url} alt={img.name} className="img-fluid" />
                <span>{img.name}</span>
              </div>
            ))}
          </div>
           {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      )}
    </div>
  );
}
