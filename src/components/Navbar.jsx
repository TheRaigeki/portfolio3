import { useState } from "react";

import { navLinks } from "../constants";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          ~/<b>raigeki</b>
        </a>

        <div className="navlinks">
          {navLinks.map((nav) => (
            <a key={nav.id} href={`#${nav.id}`}>
              {nav.title}
            </a>
          ))}
        </div>

        <button
          className="menu-btn"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "≡"}
        </button>

        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <div className="navlinks">
            {navLinks.map((nav) => (
              <a key={nav.id} href={`#${nav.id}`} onClick={() => setOpen(false)}>
                {nav.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
