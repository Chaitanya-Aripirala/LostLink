import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import { 
  FileText, CheckCircle, HelpCircle, Activity, Sparkles, PlusCircle, ArrowRight, Clock, User
} from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('items'); // items, claims, matches

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await API.get('/users/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to retrieve dashboard records' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate, fetchDashboardData]);

  if (loading) {
    return (
      <div className="dashboard-page container">
        <DashboardSkeleton />
      </div>
    );
  }

  const { lostItems = [], foundItems = [], claims = [], matches = [], stats = {} } = data || {};

  // Separate claims made by me vs claims on my items
  const myClaims = claims.filter(c => c.claimantId?._id === user._id || c.claimantId === user._id);
  const claimsOnMyItems = claims.filter(c => c.ownerId?._id === user._id || c.ownerId === user._id);

  return (
    <div className="dashboard-page container fade-in">
      {/* Greetings Header */}
      <div className="dashboard-header">
        <div>
          <h2>Welcome back, {user.name}!</h2>
          <p>Manage your reported items, claims, and explore intelligent matches.</p>
        </div>
        <div className="header-actions">
          <Link to="/report-lost" className="btn btn-primary">
            <PlusCircle size={16} /> Report Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-secondary">
            <PlusCircle size={16} /> Report Found Item
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 dashboard-stats">
        <StatCard 
          title="Lost Reports" 
          value={stats.lostCount || 0} 
          icon={FileText} 
          subtitle="Active search reports" 
          gradient="primary"
        />
        <StatCard 
          title="Found Reports" 
          value={stats.foundCount || 0} 
          icon={CheckCircle} 
          subtitle="Items you secured" 
          gradient="secondary"
        />
        <StatCard 
          title="AI Smart Matches" 
          value={stats.matchCount || 0} 
          icon={Sparkles} 
          subtitle="Automatic matches" 
          gradient="match"
        />
        <StatCard 
          title="Active Claims" 
          value={stats.claimCount || 0} 
          icon={HelpCircle} 
          subtitle="Verification requests" 
          gradient="success"
        />
      </div>

      {/* Main Grid: Details tabs + Right Sidebar */}
      <div className="dashboard-grid">
        <div className="main-content-panel card">
          {/* Tabs Navigation */}
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              My Reports ({lostItems.length + foundItems.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
              onClick={() => setActiveTab('claims')}
            >
              Claims History ({claims.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              AI Suggestions ({matches.length})
            </button>
          </div>

          <div className="tab-body">
            {/* TABS 1: Active Reports */}
            {activeTab === 'items' && (
              <div className="tab-pane">
                <h3>My Lost Reports</h3>
                {lostItems.length === 0 ? (
                  <p className="no-records">No lost items reported yet.</p>
                ) : (
                  <div className="items-list">
                    {lostItems.map(item => (
                      <div key={item._id} className="list-item">
                        <img src={item.image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100'} alt={item.title} className="item-thumbnail" />
                        <div className="item-info">
                          <h4>{item.title}</h4>
                          <span className="item-subinfo">📍 {item.location} • 📅 {new Date(item.dateLost).toLocaleDateString()}</span>
                        </div>
                        <span className={`status-pill pill-${item.status}`}>{item.status}</span>
                        <Link to={`/items/lost/${item._id}`} className="btn btn-light btn-sm">Manage</Link>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ marginTop: '32px' }}>My Found Reports</h3>
                {foundItems.length === 0 ? (
                  <p className="no-records">No found items reported yet.</p>
                ) : (
                  <div className="items-list">
                    {foundItems.map(item => (
                      <div key={item._id} className="list-item">
                        <img src={item.image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=100'} alt={item.title} className="item-thumbnail" />
                        <div className="item-info">
                          <h4>{item.title}</h4>
                          <span className="item-subinfo">📍 {item.location} • 📅 {new Date(item.dateFound).toLocaleDateString()}</span>
                        </div>
                        <span className={`status-pill pill-${item.status}`}>{item.status}</span>
                        <Link to={`/items/found/${item._id}`} className="btn btn-light btn-sm">Manage</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 2: Claim History */}
            {activeTab === 'claims' && (
              <div className="tab-pane">
                <h3>Claims Made By Me</h3>
                {myClaims.length === 0 ? (
                  <p className="no-records">You have not submitted claims for any items.</p>
                ) : (
                  <div className="items-list">
                    {myClaims.map(claim => (
                      <div key={claim._id} className="list-item">
                        <div className="item-info">
                          <h4>Claim for: {claim.foundItemId?.title || 'Found Item'}</h4>
                          <span className="item-subinfo">
                            Made on: {new Date(claim.createdAt).toLocaleDateString()} • Owner: {claim.ownerId?.name || 'N/A'}
                          </span>
                        </div>
                        <span className={`status-pill pill-${claim.status}`}>{claim.status}</span>
                        <Link to={`/claims/${claim._id}`} className="btn btn-light btn-sm">
                          {claim.status === 'initiated' ? 'Verify' : 'Review'}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ marginTop: '32px' }}>Claims on My Items</h3>
                {claimsOnMyItems.length === 0 ? (
                  <p className="no-records">No claims have been submitted for your reported items.</p>
                ) : (
                  <div className="items-list">
                    {claimsOnMyItems.map(claim => (
                      <div key={claim._id} className="list-item">
                        <div className="item-info">
                          <h4>Claim on: {claim.lostItemId?.title || 'Lost Item'}</h4>
                          <span className="item-subinfo">
                            By claimant: {claim.claimantId?.name || 'N/A'} • ID: {claim.claimantId?.studentId || 'N/A'}
                          </span>
                        </div>
                        <span className={`status-pill pill-${claim.status}`}>{claim.status}</span>
                        <Link to={`/claims/${claim._id}`} className="btn btn-primary btn-sm">Review Claim</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 3: AI Matches suggestions */}
            {activeTab === 'matches' && (
              <div className="tab-pane">
                <div className="engine-headline">
                  <Sparkles size={20} className="sparkle-icon" />
                  <h3>AI Match Engine Recommendations</h3>
                </div>
                {matches.length === 0 ? (
                  <p className="no-records">No matches suggested. The AI scans periodically as new items are added.</p>
                ) : (
                  <div className="items-list">
                    {matches.map(match => (
                      <div key={match._id} className="list-item match-row-item">
                        <div className="match-flex-col">
                          <span className="badge badge-match">{match.score}% Score</span>
                        </div>
                        <div className="match-items-comparison">
                          <div className="comp-item">
                            <span className="comp-lbl">Lost:</span>
                            <span className="comp-title">{match.lostItemId?.title}</span>
                          </div>
                          <div className="comp-item">
                            <span className="comp-lbl">Found:</span>
                            <span className="comp-title">{match.foundItemId?.title}</span>
                          </div>
                        </div>
                        <div className="match-actions-cell">
                          <Link to="/matches" className="btn btn-secondary btn-sm">
                            Inspect Match <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side activity timeline panel */}
        <aside className="activity-panel card">
          <div className="activity-header">
            <Activity size={18} />
            <h3>Recent Updates</h3>
          </div>
          <div className="activity-list">
            {claims.length === 0 && lostItems.length === 0 ? (
              <div className="empty-activity">
                <Clock size={32} className="text-muted" />
                <p>No recent activity. Try reporting an item to get started!</p>
              </div>
            ) : (
              claims.slice(0, 4).map(claim => (
                <div key={claim._id} className="activity-card">
                  <span className="activity-time">{new Date(claim.updatedAt).toLocaleDateString()}</span>
                  <p className="activity-text">
                    Claim on <strong>{claim.lostItemId?.title || claim.foundItemId?.title}</strong> status updated to 
                    <span className={`status-text-${claim.status}`}> {claim.status}</span>.
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <style>{`
        .dashboard-page {
          padding-top: 104px;
          padding-bottom: 80px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .dashboard-header h2 {
          font-size: 2rem;
          font-weight: 800;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .dashboard-stats {
          margin-bottom: 32px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .main-content-panel {
          padding: 0;
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-muted);
        }

        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 16px;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
          border-bottom: 3px solid transparent;
        }

        .tab-btn:hover {
          color: var(--primary);
          background-color: rgba(99, 102, 241, 0.04);
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          background-color: var(--bg-card);
        }

        .tab-body {
          padding: 24px;
        }

        .tab-pane h3 {
          font-size: 1.15rem;
          margin-bottom: 16px;
          border-left: 4px solid var(--primary);
          padding-left: 10px;
        }

        .no-records {
          font-size: 0.9rem;
          color: var(--text-muted);
          padding: 12px 0 24px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .list-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          gap: 16px;
          background-color: var(--bg-app);
          transition: var(--transition-fast);
        }

        .list-item:hover {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: var(--shadow-sm);
        }

        .item-thumbnail {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .item-subinfo {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .pill-active, .pill-initiated {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .pill-resolved, .pill-approved {
          background-color: var(--success-light);
          color: var(--success);
        }

        .pill-rejected {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        .activity-panel {
          padding: 24px;
          height: fit-content;
          align-self: start;
        }

        .activity-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .activity-header h3 {
          font-size: 1.1rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .activity-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .activity-text {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .status-text-approved { color: var(--success); font-weight: 700; }
        .status-text-rejected { color: var(--danger); font-weight: 700; }
        .status-text-initiated { color: var(--primary); font-weight: 700; }

        .empty-activity {
          text-align: center;
          padding: 32px 12px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-activity p {
          font-size: 0.8rem;
          line-height: 1.4;
        }

        /* Match Row Specific Styles */
        .match-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }

        .match-flex-col {
          display: flex;
          align-items: center;
        }

        .match-items-comparison {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-left: 20px;
        }

        .comp-item {
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
        }

        .comp-lbl {
          font-weight: 800;
          width: 50px;
        }

        .comp-lbl:first-child {
          color: var(--danger);
        }

        .comp-item:last-child .comp-lbl {
          color: var(--success);
        }

        .comp-title {
          font-weight: 600;
        }

        .engine-headline {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .activity-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
