import React from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import pdfAnimation from "../assets/pdf-animation.json";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {

       const navigate = useNavigate();

  

  return (
    <section className="hero-section py-5">
      <div className="container">
        <div className="row align-items-center">
          
          {/* LEFT SIDE - TEXT */}
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <h1 className="display-3 fw-bold mb-3">
              We make PDF easy.
            </h1>
           <h6 className="lead mb-4">
  All the tools you’ll need to be more productive <br />
  and work smarter with documents.
</h6>


              <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/tools")}
            >
              All PDF Tools
            </button>
          </div>

          {/* RIGHT SIDE - HERO IMAGE */}
          <div className="col-md-6 text-center">
            
              <Player
      autoplay
      loop
      src={pdfAnimation}
      style={{ height: "500", width: "500" }}
    />
          </div>

        </div>
      </div>
    </section>
  );
}
