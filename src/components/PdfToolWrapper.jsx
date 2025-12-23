import React, { useState } from "react";
import CompressTool from "./tools/CompressTool";
import RotateTool from "./tools/RotateTool";
import SplitTool from "./tools/SplitTool";
import MergeTool from "./tools/MergeTool";
import PdfToImagesTool from "./tools/PdfToImagesTool";
import ImagesToPdfTool from "./tools/ImagesToPdfTool";
import ReorderTool from "./tools/ReorderPdfTool";
import DeletePdfTool from "./tools/DeletePdfTool";
import ExtractTextTool from "./tools/ExtractTextTool";
import AddWatermarkTool from "./tools/AddWatermarkTool";
import ProtectPdfTool from "./tools/ProtectPdfTool";
import UnlockPdfTool from "./tools/UnlockPdfTool";
import AddPageNumbersTool from "./tools/AddPageNumbersTool";
import PdfToPdfATool from "./tools/PdfToPdfATool"; 
import CropTool from "./tools/CropTool";

const tools = [
  { label: "Compress PDF", value: "compress" },
  { label: "Rotate PDF", value: "rotate" },
  { label: "Split PDF", value: "split" },
  { label: "Merge PDFs", value: "merge" },
  { label: "PDF to Images", value: "pdf-to-images" },
  { label: "Images to PDF", value: "images-to-pdf" },
  { label: "Reorder PDF Pages", value: "reorder-pdf" },
  { label: "Delete PDF Pages", value: "delete-pdf" },
  { label: "Extract text content from PDF", value: "extract-text" },
   { label: "Add Watermark to PDF", value: "add-watermark" },
   { label: "Protect PDF with Password", value: "protect-pdf" },
   { label: "Unlock PDF (Remove Password)", value: "unlock-pdf" },
   { label: "Add Page Numbers", value: "add-page-numbers" },
   { label: "Convert PDF to PDF/A", value: "pdf-to-pdfa" },
   { label: "Crop PDF", value: "crop-pdf" },
];

export default function PdfToolWrapper() {
  const [selectedTool, setSelectedTool] = useState("compress");

  const renderTool = () => {
    switch (selectedTool) {
      case "compress":
        return <CompressTool />;
      case "rotate":
        return <RotateTool />;
      case "split":
        return <SplitTool />;
      case "merge":
        return <MergeTool />;
      case "pdf-to-images":
        return <PdfToImagesTool />;
      case "images-to-pdf":
        return <ImagesToPdfTool />;
        case "reorder-pdf":
  return <ReorderTool />;
  case "delete-pdf":
      return <DeletePdfTool />;
     case "extract-text":
  return <ExtractTextTool />;
      case "add-watermark":
      return <AddWatermarkTool />;
      case "protect-pdf":
  return <ProtectPdfTool />;
      case "unlock-pdf":
  return <UnlockPdfTool />;
      case "add-page-numbers":
    return <AddPageNumbersTool />;
    case "pdf-to-pdfa":
    return <PdfToPdfATool />;
      case "crop-pdf":             
      return <CropTool />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2>PDF Tools</h2>
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
        >
          {tools.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>{renderTool()}</div>
    </div>
  );
}
