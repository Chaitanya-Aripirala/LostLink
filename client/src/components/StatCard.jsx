import React from 'react';

const StatCard = ({ title, value, icon: Icon, subtitle, gradient = 'primary' }) => {
  return (
    <div className="card stat-card card-hover">
      <div className="stat-card-content">
        <div className={`stat-icon-wrapper gradient-${gradient}`}>
          <Icon size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <h2 className="stat-value">{value}</h2>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      </div>

      <style>{`
        .stat-card {
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }

        .stat-card-content {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          color: var(--text-light);
          box-shadow: var(--shadow-sm);
        }

        .gradient-primary { background: var(--gradient-primary); }
        .gradient-secondary { background: var(--gradient-secondary); }
        .gradient-accent { background: var(--gradient-accent); }
        .gradient-success { background: var(--gradient-success); }
        .gradient-match { background: var(--gradient-match); }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
          font-family: var(--font-display);
        }

        .stat-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
