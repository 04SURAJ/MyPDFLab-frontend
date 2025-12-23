import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      
      <h1 className="display-4 fw-bold text-center mb-3">Contact Us</h1>
      <p className="lead text-center mb-5">
        Have questions or feedback? Reach out to us and we'll get back to you as soon as possible.
      </p>

      {submitted && (
        <div className="alert alert-success text-center">
          Your message has been sent successfully!
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg">
                Send Message
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Optional Contact Info */}
      <div className="text-center mt-5 text-muted">
        <p>Email: support@pdftools.com | Phone: +1 234 567 890</p>
      </div>

    </div>
  );
}
