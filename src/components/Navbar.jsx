import { Link, NavLink } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";
import Collapse from "bootstrap/js/dist/collapse";

export default function Navbar() {
  useEffect(() => {
    const navbar = document.getElementById("mypdflabNavbar");
    const bsCollapse = new Collapse(navbar, { toggle: false });

    const handleOutsideClick = (e) => {
      // agar menu open hai aur click navbar ke bahar hua
      if (
        navbar.classList.contains("show") &&
        !navbar.contains(e.target) &&
        !e.target.classList.contains("navbar-toggler")
      ) {
        bsCollapse.hide();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand py-0" to="/">
          <img src={logo} alt="MyPDFLab Logo" className="navbar-logo" />
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler hamburger collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mypdflabNavbar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="mypdflabNavbar">
          <ul className="navbar-nav ms-auto gap-lg-2">
            <li className="nav-item">
<NavLink className="nav-link" to="/tools/compress">
                Compress PDF
              </NavLink>            </li>
            <li className="nav-item">
<NavLink className="nav-link" to="/tools/split">
                Split PDF
              </NavLink>            </li>
            <li className="nav-item">
<NavLink className="nav-link" to="/tools/merge">
                Merge PDF
              </NavLink>            </li>
           
            <li className="nav-item">
<NavLink className="nav-link" to="/tools/reorder-pdf">Reorder PDF</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
