import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, LogOut, Menu, X, User, LayoutDashboard, PlusCircle, Compass, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar-container ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-icon">
            <Compass size={24} className="icon-pulse" />
          </div>
          <span className="logo-text">LOST<span className="logo-highlight">LINK</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>Browse</Link>
          {user && (
            <>
              <Link to="/report-lost" className={`nav-link ${isActive('/report-lost') ? 'active' : ''}`}>
                <PlusCircle size={16} /> Report Lost
              </Link>
              <Link to="/report-found" className={`nav-link ${isActive('/report-found') ? 'active' : ''}`}>
                <PlusCircle size={16} /> Report Found
              </Link>
              <Link to="/matches" className={`nav-link ${isActive('/matches') ? 'active' : ''}`}>
                <Sparkles size={16} className="sparkle-icon" /> AI Matches
              </Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Right side controls */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-profile-container">
              {/* Notification bell */}
              <div className="notification-bell-wrapper">
                <button 
                  className="icon-button notification-bell"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notifications-dropdown glass">
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                      <span className="badge badge-primary">{unreadCount} new</span>
                    </div>
                    <div className="dropdown-list">
                      {notifications.length === 0 ? (
                        <div className="dropdown-empty">
                          <p>No new notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((noti) => (
                          <div 
                            key={noti._id} 
                            className={`dropdown-item ${noti.read ? 'read' : 'unread'}`}
                            onClick={() => {
                              markAsRead(noti._id);
                              setShowNotifications(false);
                              if (noti.claimId) navigate(`/claims/${noti.claimId}`);
                              else if (noti.matchId) navigate(`/matches`);
                              else navigate('/dashboard');
                            }}
                          >
                            <div className="dropdown-item-header">
                              <span className="dropdown-item-title">{noti.title}</span>
                              {!noti.read && <span className="unread-dot"></span>}
                            </div>
                            <p className="dropdown-item-message">{noti.message}</p>
                            <span className="dropdown-item-time">
                              {new Date(noti.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="dropdown-footer">
                      <Link to="/dashboard" onClick={() => setShowNotifications(false)}>
                        View All Activities
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile link */}
              <Link to="/profile" className="navbar-avatar-link">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="navbar-avatar" />
                ) : (
                  <div className="navbar-avatar-fallback"><User size={18} /></div>
                )}
                <span className="username desktop-only">{user.name.split(' ')[0]}</span>
              </Link>

              {/* Logout Button */}
              <button className="icon-button logout-btn desktop-only" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button 
            className="icon-button mobile-menu-btn mobile-only" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="mobile-drawer glass slide-down">
          <div className="mobile-links">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/browse" onClick={() => setIsOpen(false)}>Browse</Link>
            {user ? (
              <>
                <Link to="/report-lost" onClick={() => setIsOpen(false)}>Report Lost Item</Link>
                <Link to="/report-found" onClick={() => setIsOpen(false)}>Report Found Item</Link>
                <Link to="/matches" onClick={() => setIsOpen(false)}>AI Matches</Link>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
                <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ marginTop: '16px', width: '100%' }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles specifically for Navbar */}
      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 72px;
          z-index: 1000;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 2px solid rgba(99, 102, 241, 0.15);
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
          transition: all var(--transition-normal);
        }
        
        .navbar-container.scrolled {
          height: 64px;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 2px solid var(--primary);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.12);
        }
        
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--text-primary);
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--gradient-primary);
          color: var(--text-light);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }

        .logo-highlight {
          color: var(--primary);
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .nav-link.active {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-profile-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: var(--transition-fast);
        }

        .icon-button:hover {
          background-color: var(--bg-muted);
          color: var(--text-primary);
        }

        .notification-bell-wrapper {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: var(--danger);
          color: var(--text-light);
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
        }

        .notifications-dropdown {
          position: absolute;
          top: 50px;
          right: -80px;
          width: 320px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          z-index: 1100;
          animation: slideUp 0.2s ease;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          background-color: rgba(255, 255, 255, 0.9);
        }

        .dropdown-header h4 {
          font-size: 0.95rem;
          margin: 0;
        }

        .dropdown-list {
          max-height: 280px;
          overflow-y: auto;
          background-color: rgba(255, 255, 255, 0.95);
        }

        .dropdown-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .dropdown-item:hover {
          background-color: var(--bg-muted);
        }

        .dropdown-item.unread {
          background-color: rgba(99, 102, 241, 0.04);
        }

        .dropdown-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .dropdown-item-title {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border-radius: 50%;
        }

        .dropdown-item-message {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .dropdown-item-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .dropdown-empty {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .dropdown-footer {
          padding: 10px;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
          background-color: var(--bg-muted);
          border-top: 1px solid var(--border-color);
        }

        .dropdown-footer a {
          color: var(--primary);
        }

        .navbar-avatar-link {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-light);
        }

        .navbar-avatar-fallback {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .username {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-drawer {
          position: absolute;
          top: 72px;
          left: 0;
          width: 100%;
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          padding: 20px;
          z-index: 999;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-links a {
          font-weight: 600;
          padding: 10px;
          border-radius: var(--radius-sm);
        }

        .mobile-links a:hover {
          background-color: var(--bg-muted);
          color: var(--primary);
        }

        .mobile-auth-btns {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
        }

        /* Responsive */
        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex; }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.2); }
        }
        .sparkle-icon {
          color: #f59e0b;
          animation: sparkle 2s infinite ease-in-out;
        }
        .icon-pulse {
          animation: float 4s infinite ease-in-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
