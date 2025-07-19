import { useState } from "react";
import "../global.scss";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const year = new Date().getFullYear();
  
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "»" : "«"}
      </button>
      
      <div className="sidebar-header">Rats Journey</div>
      
      <nav className="sidebar-links">
        <a href="/about-me" data-initial="A">
          <h3>About Me</h3>
        </a>
        <a href="/blog" data-initial="B">
          <h3>Blog</h3>
        </a>
        <a href="/projects" data-initial="P">
          <h3>Projects</h3>
        </a>
      </nav>
      
      <div className="sidebar-footer">
        <div className="copyright">
          <small>&copy; {year} Rats Journey</small>
        </div>
        <div className="social-links">
          <a 
            href="https://m.webtoo.ls/@astro" 
            target="_blank" 
            className="social-link mastodon"
            title="Mastodon"
          >
            <span className="social-icon">🐘</span>
            <span className="social-label">Linkedin</span>
          </a>
          <a 
            href="https://twitter.com/astrodotbuild" 
            target="_blank" 
            className="social-link twitter"
            title="Twitter"
          >
            <span className="social-icon">⚡</span>
            <span className="social-label">Leetcode</span>
          </a>
          <a 
            href="https://github.com/withastro/astro" 
            target="_blank" 
            className="social-link github"
            title="GitHub"
          >
            <span className="social-icon">⚡</span>
            <span className="social-label">GitHub</span>
          </a>
        </div>
      </div>
    </aside>
  );
}