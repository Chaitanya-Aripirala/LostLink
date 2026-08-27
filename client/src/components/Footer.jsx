import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon-sm">
              <Compass size={20} />
            </div>
            <h3>LOSTLINK</h3>
          </div>
          <p className="footer-desc">
            An intelligent, AI-powered campus lost & found platform helping students recover their lost belongings.
          </p>
          <div className="footer-socials">
            {/* Mock social icons */}
            <div className="social-badge">Campus Link</div>
            <div className="social-badge">Hackathon 2026</div>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/browse">Browse Items</Link>
            <Link to="/report-lost">Report Lost</Link>
            <Link to="/report-found">Report Found</Link>
          </div>

          <div className="footer-links-col">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/safety">Safety Tips</Link>
          </div>

          <div className="footer-links-col">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>support@lostlink.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+1 (555) 019-2834</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Block A, Campus Center</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} LostLink. Built for Campus Hackathon.</p>
          <p className="made-with">
            Made with <Heart size={14} className="heart-icon" /> for Chaitanya
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--bg-card);
          border-top: 1px solid var(--border-color);
          padding: 64px 0 24px;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .footer-brand {
          flex: 1;
          min-width: 260px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .logo-icon-sm {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--gradient-primary);
          color: var(--text-light);
        }

        .footer-logo h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          letter-spacing: 0.05em;
        }

        .footer-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 320px;
        }

        .footer-socials {
          display: flex;
          gap: 10px;
        }

        .social-badge {
          font-size: 0.75rem;
          padding: 6px 12px;
          background-color: var(--bg-muted);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-weight: 600;
        }

        .footer-links-grid {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 140px;
        }

        .footer-links-col h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-links-col a {
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .footer-links-col a:hover {
          color: var(--primary);
          padding-left: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }

        .made-with {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .heart-icon {
          color: var(--accent);
          fill: var(--accent);
          animation: beat 1.5s infinite;
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 32px;
          }
          .footer-links-grid {
            gap: 32px;
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
