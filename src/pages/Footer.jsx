import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="py-4 mt-5"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #000"
      }}
    >
      <div className="container text-center">

        {/* Navigation Links */}
        <div className="mb-3">
          <Link to="/" className="text-dark mx-3 text-decoration-none">Home</Link>
          <Link to="/tools" className="text-dark mx-3 text-decoration-none">Tools</Link>
          <Link to="/about" className="text-dark mx-3 text-decoration-none">About</Link>
          <Link to="/contact" className="text-dark mx-3 text-decoration-none">Contact</Link>
          <Link to="/faq" className="text-dark mx-3 text-decoration-none">FAQ</Link>
        </div>

        {/* Copyright */}
        <p className="mb-0 text-dark">
          &copy; {new Date().getFullYear()} PDF Tools. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
