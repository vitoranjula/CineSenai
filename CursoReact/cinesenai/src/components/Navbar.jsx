import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <svg
            className="navbar-logo-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
          </svg>
          <span className="navbar-logo-text">
            Cine<span>Senai</span>
          </span>
        </a>

        <div className="navbar-links">
          <a href="/" className="nav-link active">
            Catálogo
          </a>
          <a href="/sessoes" className="nav-link">
            Sessões
          </a>
        </div>

        <div className="navbar-auth">
          <a href="/login" className="navbar-login-btn">
            Entrar
          </a>
        </div>
      </div>
    </nav>
  );
};
