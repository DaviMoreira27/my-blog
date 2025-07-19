import { useState, useEffect } from "react";
import "../global.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
      if (event.key === "Escape" && isMobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, mobileOpen]);

  return (
    <>
      {isMobile && (
        <div
          className={`sidebar-overlay ${mobileOpen ? "active" : ""}`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {isMobile && !mobileOpen && (
        <button
          className="mobile-menu-button"
          onClick={handleToggle}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      )}

      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          isMobile && mobileOpen ? "open" : ""
        }`}
        aria-label="Menu de navegação"
      >
        <button
          className="toggle-button"
          onClick={handleToggle}
          aria-label={
            isMobile
              ? mobileOpen
                ? "Fechar menu"
                : "Abrir menu"
              : collapsed
              ? "Expandir sidebar"
              : "Recolher sidebar"
          }
        >
          {isMobile ? (mobileOpen ? "×" : "☰") : collapsed ? "»" : "«"}
        </button>

        <div className="sidebar-header">Rats Journey</div>

        <nav
          className="sidebar-links"
          role="navigation"
          aria-label="Menu principal"
        >
          <a href="/about-me" data-initial="A" onClick={handleLinkClick}>
            <h3>About Me</h3>
          </a>
          <a href="/blog" data-initial="B" onClick={handleLinkClick}>
            <h3>Blog</h3>
          </a>
          <a href="/projects" data-initial="P" onClick={handleLinkClick}>
            <h3>Projects</h3>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="copyright">
            <small>&copy; {year} Rats Journey</small>
          </div>
          <div className="social-links" role="list" aria-label="Redes sociais">
            <a
              href="https://m.webtoo.ls/@astro"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link mastodon"
              title="LinkedIn"
              role="listitem"
              onClick={handleLinkClick}
            >
              <span className="social-icon" aria-hidden="true">
                🐘
              </span>
              <span className="social-label">LinkedIn</span>
            </a>
            <a
              href="https://twitter.com/astrodotbuild"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
              title="LeetCode"
              role="listitem"
              onClick={handleLinkClick}
            >
              <span className="social-icon" aria-hidden="true">
                ⚡
              </span>
              <span className="social-label">LeetCode</span>
            </a>
            <a
              href="https://github.com/withastro/astro"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link github"
              title="GitHub"
              role="listitem"
              onClick={handleLinkClick}
            >
              <span className="social-icon" aria-hidden="true">
                ⚡
              </span>
              <span className="social-label">GitHub</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
