import React from "react";

export default function About() {
  return (
    <div className="container py-5">
      
      {/* Heading */}
      <h1 className="display-4 fw-bold text-center mb-4">About PDF Tools</h1>
      
      {/* Subtitle */}
      <p className="lead text-center mb-5">
        Our mission is to make PDF management simple, fast, and accessible for everyone.  
        With our collection of free PDF tools, you can compress, merge, split, convert, and edit PDF documents effortlessly.
      </p>

      {/* Content Sections */}
      <div className="row text-center">
        
        <div className="col-md-4 mb-4">
          <h3 className="fw-bold mb-2">Easy to Use</h3>
          <p>
            Our intuitive interface allows you to process PDF files in just a few clicks, no technical knowledge required.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <h3 className="fw-bold mb-2">Fast & Secure</h3>
          <p>
            All file processing happens instantly and securely. We do not store your documents longer than necessary.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <h3 className="fw-bold mb-2">Free Tools</h3>
          <p>
            Access a wide range of PDF tools for free. We aim to provide a complete PDF toolkit for all users.
          </p>
        </div>

      </div>

      {/* Optional closing note */}
      <div className="text-center mt-5">
        <p className="text-muted">
          Built with care for individuals and professionals who work with documents daily.
        </p>
      </div>

    </div>
  );
}
