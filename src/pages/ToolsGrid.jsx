import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFilePdf, 
  FaCompress, 
  FaRedo,      
  FaImages, 
  FaFileUpload, 
  FaLayerGroup,
  FaSortAmountDown,
  FaTrashAlt,
  FaFileAlt,
  FaStamp,
  FaLock,
  FaUnlock,
  FaListOl,
  FaFile,
  FaCrop
} from "react-icons/fa";

const tools = [
  { mode: "merge", name: "Merge PDF", desc: "Combine multiple PDFs into one", color: "#f97316", icon: <FaLayerGroup size={30}/> },
  { mode: "split", name: "Split PDF", desc: "Split PDF into multiple files", color: "#3b82f6", icon: <FaFilePdf size={30}/> },
  { mode: "compress", name: "Compress PDF", desc: "Reduce PDF size", color: "#16a34a", icon: <FaCompress size={30}/> },
  { mode: "rotate", name: "Rotate PDF", desc: "Rotate PDF pages", color: "#e11d48", icon: <FaRedo size={30}/> },
  { mode: "pdf-to-images", name: "PDF → Images", desc: "Convert PDF pages to images", color: "#8b5cf6", icon: <FaImages size={30}/> },
  { mode: "images-to-pdf", name: "Images → PDF", desc: "Convert images to PDF", color: "#0ea5e9", icon: <FaFileUpload size={30}/> },

  { mode: "reorder-pdf", name: "Reorder Pages", desc: "Drag & arrange PDF pages", color: "#d946ef", icon: <FaSortAmountDown size={30}/> },

   {
    mode: "delete-pdf",
    name: "Delete Pages",
    desc: "Remove unwanted pages from PDF",
    color: "#dc2626",
    icon: <FaTrashAlt size={30} />,
  },
  {
  mode: "extract-text",
  name: "Extract Text",
  desc: "Extract text content from PDF",
  color: "#059669",
  icon: <FaFileAlt size={30} />
},
  {
  mode: "add-watermark",
  name: "Add Watermark",
  desc: "Add text or image watermark to PDF",
  color: "#0f766e",
  icon: <FaStamp size={30} />,
},
{
  mode: "protect-pdf",
  name: "Protect PDF",
  desc: "Secure PDF with password protection",
  color: "#7c3aed",
  icon: <FaLock size={30} />,
},

  {
    mode: "unlock-pdf",
    name: "Unlock PDF",
    desc: "Remove password protection from PDF",
    color: "#f59e0b",
    icon: <FaUnlock size={30} />,
  },
{
  mode: "add-page-numbers",
  name: "Add Page Numbers",
  desc: "Insert page numbers into PDF",
  color: "#2563eb",
  icon: <FaListOl size={30} />,
},

  { mode: "pdf-to-pdfa", name: "PDF → PDF/A", desc: "Convert PDF to archival PDF/A format", color: "#0d9488", icon: <FaFile size={30} /> },

  { mode: "crop-pdf", name: "Crop PDF", desc: "Trim PDF margins easily", color: "#8b5c2c", icon: <FaCrop size={30} /> }, // ← new tool

];

export default function ToolGrid() {
  const navigate = useNavigate();

  return (
    <div className="container py-4 text-center" style={{ paddingTop: "100-0px", paddingBottom: "50px" }}>
       
           
           



      <h2 className="display-4 fw-bold mb-3">
    PDF Tools
  </h2>
  <p className="lead mb-5">
    Make use of our collection of PDF tools to process digital documents and streamline your workflow seamlessly.
  </p>
      <div className="row g-3">
        {tools.map((tool) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={tool.mode}>
            <div 
              className="card tool-card text-white p-3 d-flex flex-column align-items-center justify-content-center"
              style={{ 
                backgroundColor: tool.color, 
                minHeight: "180px", 
                cursor: "pointer", 
                transition: "transform 0.2s" 
              }}
              onClick={() => navigate(`/tools/${tool.mode}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <div className="icon-wrapper" style={{ transition: "transform 0.3s" }}>
                {tool.icon}
              </div>
              <h5 className="mt-3">{tool.name}</h5>
              <p className="text-center" style={{ fontSize: "0.85rem" }}>{tool.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          .tool-card:hover .icon-wrapper {
            transform: rotate(15deg) scale(1.2);
          }
        `}
      </style>
    </div>
  );
}
