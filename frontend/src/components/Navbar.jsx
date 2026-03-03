import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <style>{`
        .nav-shell {
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.86);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .nav-brand .brand-icon {
          font-size: 18px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-link,
        .nav-ghost,
        .nav-solid,
        .nav-danger {
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border-radius: 10px;
          padding: 9px 14px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-link {
          color: #334155;
        }

        .nav-link:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .nav-user {
          font-size: 13px;
          color: #64748b;
          padding: 0 2px;
        }

        .nav-ghost {
          color: #0f172a;
          border-color: #dbe3ee;
          background: #ffffff;
        }

        .nav-ghost:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .nav-solid {
          color: #ffffff;
          background: #0f172a;
          border-color: #0f172a;
        }

        .nav-solid:hover {
          background: #1e293b;
          border-color: #1e293b;
        }

        .nav-danger {
          color: #ffffff;
          background: #dc2626;
          border-color: #dc2626;
          cursor: pointer;
        }

        .nav-danger:hover {
          background: #b91c1c;
          border-color: #b91c1c;
        }

        @media (max-width: 720px) {
          .nav-inner {
            padding: 10px 18px;
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-links {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>

      <nav className="nav-shell">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="brand-icon">✈️</span>
            <span>AI Travel</span>
          </Link>

          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Chuyến đi của tôi
                </Link>
                <span className="nav-user">Xin chào, {user.name}</span>
                <button onClick={handleLogout} className="nav-danger" type="button">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-ghost">
                  Đăng nhập
                </Link>
                <Link to="/register" className="nav-solid">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
