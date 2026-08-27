import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="toast-icon text-success" />;
      case 'error':
        return <AlertCircle size={20} className="toast-icon text-danger" />;
      case 'info':
      default:
        return <Info size={20} className="toast-icon text-primary" />;
    }
  };

  return (
    <div className={`toast-box glass toast-${type} slide-up`}>
      {getIcon()}
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close-btn" onClick={onClose}>
        <X size={16} />
      </button>

      <style>{`
        .toast-box {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          z-index: 2000;
          max-width: 380px;
          min-width: 280px;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-success {
          border-left: 4px solid var(--success);
        }

        .toast-error {
          border-left: 4px solid var(--danger);
        }

        .toast-info {
          border-left: 4px solid var(--primary);
        }

        .toast-content {
          flex: 1;
        }

        .toast-message {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .toast-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
        }

        .toast-close-btn:hover {
          background-color: var(--bg-muted);
          color: var(--text-primary);
        }

        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
        .text-primary { color: var(--primary); }

        @media (max-width: 480px) {
          .toast-box {
            left: 16px;
            right: 16px;
            bottom: 16px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
