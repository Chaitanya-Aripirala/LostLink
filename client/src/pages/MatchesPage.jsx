import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState({});
  const [toast, setToast] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMatches = async () => {
      try {
        const { data } = await API.get('/matches');
        setMatches(data);
      } catch (err) {
        console.error(err);
        setToast({ type: 'error', message: 'Failed to retrieve match calculations' });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, navigate]);

  const handleInitiateClaim = async (match) => {
    const matchId = match._id;
    setClaimLoading(prev => ({ ...prev, [matchId]: true }));

    try {
      // Check if a claim already exists between these items
      const { data: claimsList } = await API.get('/claims');
      const existingClaim = claimsList.find(c => 
        (c.lostItemId?._id === match.lostItemId?._id && c.foundItemId?._id === match.foundItemId?._id)
      );

      if (existingClaim) {
        setToast({ type: 'info', message: 'Claim already exists. Opening verification page...' });
        setTimeout(() => {
          navigate(`/claims/${existingClaim._id}`);
        }, 1200);
        return;
      }

      // Create new claim
      const { data } = await API.post('/claims', {
        lostItemId: match.lostItemId?._id,
        foundItemId: match.foundItemId?._id
      });

      setToast({ type: 'success', message: 'Claim initiated! Proceed to verification question.' });
      setTimeout(() => {
        navigate(`/claims/${data._id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to initiate claim' });
    } finally {
      setClaimLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="matches-page container text-center" style={{ paddingTop: '140px' }}>
        <h3>Analyzing match combinations...</h3>
      </div>
    );
  }

  return (
    <div className="matches-page container fade-in">
      <div className="matches-header">
        <div className="title-row-engine">
          <Sparkles size={24} className="sparkle-icon" />
          <h2>AI Match Recommendations</h2>
        </div>
        <p>Review high-probability matches calculated based on your reported items.</p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-matches-card card text-center">
          <Sparkles size={40} className="text-muted" style={{ marginBottom: '16px' }} />
          <h3>No matches detected yet</h3>
          <p>As soon as another student reports a matching item with overlapping specifications, it will appear here.</p>
          <div style={{ marginTop: '16px' }}>
            <Link to="/dashboard" className="btn btn-outline btn-sm">Go to Dashboard</Link>
          </div>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => {
            const isMyLost = match.lostItemId?.userId?._id === user._id || match.lostItemId?.userId === user._id;
            const oppositeUser = isMyLost ? match.foundItemId?.userId : match.lostItemId?.userId;

            return (
              <div key={match._id} className="card connection-card">
                {/* Central Score Badge */}
                <div className="connection-badge-wrapper">
                  <div className="central-match-score">
                    <Sparkles size={14} />
                    <span>{match.score}%</span>
                  </div>
                  <span className="connection-lbl">AI Similarity</span>
                </div>

                {/* Left Side: Lost Item */}
                <div className="connection-side lost-side">
                  <span className="side-badge badge-lost">Lost Item</span>
                  <h3>{match.lostItemId?.title}</h3>
                  <div className="side-meta">
                    <p>📍 {match.lostItemId?.location}</p>
                    <p>📅 {new Date(match.lostItemId?.dateLost).toLocaleDateString()}</p>
                    <p>🎨 Color: {match.lostItemId?.color} • Category: {match.lostItemId?.category}</p>
                  </div>
                  {match.lostItemId?.userId && (
                    <div className="side-owner">
                      <span className="owner-lbl">Posted by:</span>
                      <span className="owner-name">{match.lostItemId.userId.name}</span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                <div className="side-separator">
                  <ArrowRight size={24} className="connector-arrow" />
                </div>

                {/* Right Side: Found Item */}
                <div className="connection-side found-side">
                  <span className="side-badge badge-found">Found Item</span>
                  <h3>{match.foundItemId?.title}</h3>
                  <div className="side-meta">
                    <p>📍 {match.foundItemId?.location}</p>
                    <p>📅 {new Date(match.foundItemId?.dateFound).toLocaleDateString()}</p>
                    <p>🎨 Color: {match.foundItemId?.color} • Category: {match.foundItemId?.category}</p>
                  </div>
                  {match.foundItemId?.userId && (
                    <div className="side-owner">
                      <span className="owner-lbl">Secured by:</span>
                      <span className="owner-name">{match.foundItemId.userId.name}</span>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="connection-actions">
                  <div className="match-rationale">
                    <HelpCircle size={16} />
                    <span>
                      Match based on <strong>{match.lostItemId?.category}</strong> category alignment, description overlap, and date proximity.
                    </span>
                  </div>

                  <div className="actions-buttons">
                    <Link to={`/items/lost/${match.lostItemId?._id}`} className="btn btn-light btn-sm">
                      Inspect Lost
                    </Link>
                    <Link to={`/items/found/${match.foundItemId?._id}`} className="btn btn-light btn-sm">
                      Inspect Found
                    </Link>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleInitiateClaim(match)}
                      disabled={claimLoading[match._id]}
                    >
                      <ShieldCheck size={16} /> {claimLoading[match._id] ? 'Initiating...' : 'Verify Ownership'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <style>{`
        .matches-page {
          padding-top: 104px;
          padding-bottom: 80px;
        }

        .matches-header {
          margin-bottom: 32px;
        }

        .title-row-engine {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .title-row-engine h2 {
          font-size: 2rem;
          font-weight: 800;
        }

        .matches-header p {
          color: var(--text-secondary);
        }

        .empty-matches-card {
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-matches-card p {
          color: var(--text-secondary);
          max-width: 420px;
        }

        .matches-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .connection-card {
          display: grid;
          grid-template-columns: 1.2fr auto 1.2fr;
          padding: 32px;
          position: relative;
          align-items: center;
          gap: 20px;
        }

        .connection-badge-wrapper {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .central-match-score {
          background: var(--gradient-match);
          color: var(--text-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: var(--shadow-glow);
        }

        .connection-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 4px;
        }

        .connection-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .side-badge {
          align-self: start;
          font-size: 0.7rem;
        }

        .connection-side h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .side-meta {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .side-owner {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          border-top: 1px solid var(--border-color);
          padding-top: 8px;
        }

        .owner-lbl {
          color: var(--text-muted);
        }

        .owner-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .side-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .connector-arrow {
          animation: pulse-arrow 2s infinite ease-in-out;
        }

        .connection-actions {
          grid-column: span 3;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .match-rationale {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .actions-buttons {
          display: flex;
          gap: 10px;
        }

        @keyframes pulse-arrow {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(5px); opacity: 1; }
        }

        @media (max-width: 768px) {
          .connection-card {
            grid-template-columns: 1fr;
            padding-top: 40px;
          }
          .side-separator {
            transform: rotate(90deg);
            margin: 10px 0;
          }
          .connection-actions {
            grid-column: span 1;
            flex-direction: column;
            align-items: flex-start;
          }
          .actions-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default MatchesPage;
