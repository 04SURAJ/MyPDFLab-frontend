// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";
import Navbar from "./components/Navbar";
import ToolsGrid from "./pages/ToolsGrid";
import Footer from "./pages/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/tools" element={<ToolsGrid />} />
      {/* Dynamic route for tools */}
      <Route path="/tools/:mode" element={<ToolPage />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/faq" element={<FAQ />} />
      {/* Optional: Catch-all 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
<Footer />
    </>
  );
}

export default App;
