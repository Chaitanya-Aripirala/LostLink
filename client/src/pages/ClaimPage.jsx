import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Shield, CheckCircle2, XCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';

const ClaimPage = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchClaim = async () => {
      try {
        const { data } = await API.get(`/claims/${id}`);
        setClaim(data);
      } catch (err) {
        setToast({ type: 'error', message: 'Claim not found or access denied' });
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [id, user, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setToast({ type: 'error', message: 'Please enter your answer' });
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await API.post(`/claims/${id}/verify`, { answer });
      setClaim(data);
      if (data.status === 'approved') {
        setToast({ type: 'success', message: '✅ Verification successful! Ownership confirmed.' });
      } else {
        setToast({ type: 'error', message: '❌ Incorrect answer. Please try again.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Verification failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await API.put(`/claims/${id}/status`, { status: newStatus });
      setClaim(data);
      setToast({ type: 'success', message: `Claim ${newStatus} successfully` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update claim status' });
    }
  };

  if (loading) {
    return (
      <div className="claim-page container" style={{ paddingTop: '140px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '400px', borderRadius: '16px', maxWidth: '600px', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h3>Claim not found</h3>
        <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>Dashboard</Link>
      </div>
    );
  }

  const isClaimant = user._id === (claim.claimantId?._id || claim.claimantId);
  const isOwner = user._id === (claim.ownerId?._id || claim.ownerId);
  const verificationQ = isClaimant
    ? claim.foundItemId?.verificationQuestion
    : claim.lostItemId?.verificationQuestion;

  const statusConfig = {
    initiated: { label: 'Pending Verification', color: 'var(--primary)', icon: Clock },
    verified: { label: 'Answer Submitted', color: 'var(--warning)', icon: Shield },
    approved: { label: 'Ownership Confirmed', color: 'var(--success)', icon: CheckCircle2 },
    rejected: { label: 'Claim Rejected', color: 'var(--danger)', icon: XCircle },
    resolved: { label: 'Item Returned', color: 'var(--success)', icon: CheckCircle2 },
  };

  const StatusIcon = statusConfig[claim.status]?.icon || Clock;

  return (
    <div className="claim-page container fade-in">
      <div className="back-link"><Link to="/dashboard">← Back to Dashboard</Link></div>

      <div className="claim-layout">
        {/* Left: Claim Status + Items */}
        <div className="claim-main">
          {/* Status Banner */}
          <div className="card status-banner" style={{ borderLeft: `4px solid ${statusConfig[claim.status]?.color}` }}>
            <StatusIcon size={28} style={{ color: statusConfig[claim.status]?.color }} />
            <div>
              <h3>Claim #{id.slice(-6).toUpperCase()}</h3>
              <span className="status-text" style={{ color: statusConfig[claim.status]?.color }}>
                {statusConfig[claim.status]?.label}
              </span>
            </div>
          </div>

          {/* Items Comparison */}
          <div className="card items-comparison-card">
            <div className="comparison-side">
              <span className="badge badge-lost">Lost Item</span>
              <h4>{claim.lostItemId?.title}</h4>
              <p>📍 {claim.lostItemId?.location}</p>
              <p>Posted by: <strong>{claim.ownerId?.name}</strong></p>
            </div>
            <div className="comp-connector">
              <div className="match-circle">
                <Sparkles size={16} />
              </div>
              <ArrowRight size={20} className="text-muted" />
            </div>
            <div className="comparison-side">
              <span className="badge badge-found">Found Item</span>
              <h4>{claim.foundItemId?.title}</h4>
              <p>📍 {claim.foundItemId?.location}</p>
              <p>Secured by: <strong>{claim.claimantId?.name}</strong></p>
            </div>
          </div>

          {/* Verification Section */}
          {claim.status === 'initiated' && isClaimant && (
            <div className="card verification-card">
              <div className="verification-header">
                <Shield size={22} className="text-primary" />
                <h3>Ownership Verification</h3>
              </div>
              <div className="verification-body">
                <div className="question-display">
                  <p className="question-label">Security Question from item owner:</p>
                  <p className="question-text">"{verificationQ}"</p>
                </div>
                <form onSubmit={handleVerify} className="verification-form">
                  <div className="form-group">
                    <label className="form-label">Your Answer *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Verifying...' : 'Submit Verification'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Result Card */}
          {claim.status === 'approved' && (
            <div className="card result-card success-result">
              <CheckCircle2 size={40} className="text-success" />
              <h3>Ownership Verified!</h3>
              <p>The verification answer was accepted. Please arrange a safe handover on campus.</p>
              {isOwner && (
                <button className="btn btn-primary" onClick={() => handleStatusUpdate('resolved')}>
                  Mark as Returned ✓
                </button>
              )}
            </div>
          )}

          {claim.status === 'rejected' && (
            <div className="card result-card danger-result">
              <XCircle size={40} className="text-danger" />
              <h3>Claim Rejected</h3>
              <p>The verification answer did not match. The claim has been rejected.</p>
              <Link to="/browse" className="btn btn-outline btn-sm">Browse Other Items</Link>
            </div>
          )}

          {claim.status === 'resolved' && (
            <div className="card result-card success-result">
              <CheckCircle2 size={40} className="text-success" />
              <h3>Item Successfully Returned!</h3>
              <p>This case is closed. The item has been handed over to its rightful owner.</p>
            </div>
          )}

          {/* Owner Controls */}
          {isOwner && (claim.status === 'verified' || claim.status === 'initiated') && (
            <div className="card owner-controls-card">
              <h4>Owner Controls</h4>
              <p>Review the claimant's submission and decide:</p>
              <div className="owner-btns">
                <button className="btn btn-primary" onClick={() => handleStatusUpdate('approved')}>
                  <CheckCircle2 size={16} /> Approve Claim
                </button>
                <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleStatusUpdate('rejected')}>
                  <XCircle size={16} /> Reject Claim
                </button>
              </div>
              {claim.verificationAnswer && (
                <div className="submitted-answer">
                  <p className="ans-label">Claimant's submitted answer:</p>
                  <p className="ans-val">"{claim.verificationAnswer}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Claim Details Sidebar */}
        <aside className="claim-sidebar">
          <div className="card sidebar-detail-card">
            <h4>Claim Details</h4>
            <div className="detail-row">
              <span>Claimant</span>
              <strong>{claim.claimantId?.name}</strong>
            </div>
            <div className="detail-row">
              <span>Student ID</span>
              <strong>{claim.claimantId?.studentId || 'N/A'}</strong>
            </div>
            <div className="detail-row">
              <span>Contact</span>
              <strong>{claim.claimantId?.phone || 'N/A'}</strong>
            </div>
            <div className="detail-row">
              <span>Submitted On</span>
              <strong>{new Date(claim.createdAt).toLocaleDateString()}</strong>
            </div>
            <div className="detail-row">
              <span>Last Updated</span>
              <strong>{new Date(claim.updatedAt).toLocaleDateString()}</strong>
            </div>
          </div>

          <div className="card sidebar-detail-card">
            <h4>Verification Timeline</h4>
            <div className="timeline">
              <div className="timeline-step done">
                <div className="t-dot"></div>
                <div><strong>Claim Submitted</strong><p>Claim initiated and recorded</p></div>
              </div>
              <div className={`timeline-step ${['verified','approved','resolved'].includes(claim.status) ? 'done' : ''}`}>
                <div className="t-dot"></div>
                <div><strong>Answer Submitted</strong><p>Claimant answered verification question</p></div>
              </div>
              <div className={`timeline-step ${['approved','resolved'].includes(claim.status) ? 'done' : ''}`}>
                <div className="t-dot"></div>
                <div><strong>Owner Decision</strong><p>Claim approved or rejected</p></div>
              </div>
              <div className={`timeline-step ${claim.status === 'resolved' ? 'done' : ''}`}>
                <div className="t-dot"></div>
                <div><strong>Item Returned</strong><p>Successful handover completed</p></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        .claim-page { padding-top: 104px; padding-bottom: 80px; }
        .back-link { margin-bottom: 24px; }
        .back-link a { color: var(--text-secondary); font-weight: 600; }
        .back-link a:hover { color: var(--primary); }
        .claim-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: start; }
        .claim-main { display: flex; flex-direction: column; gap: 24px; }

        .status-banner { padding: 24px; display: flex; align-items: center; gap: 16px; }
        .status-banner h3 { font-size: 1.2rem; margin-bottom: 4px; }
        .status-text { font-weight: 800; font-size: 0.9rem; }

        .items-comparison-card { padding: 24px; display: flex; align-items: center; gap: 16px; }
        .comparison-side { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .comparison-side h4 { font-size: 1.1rem; font-weight: 700; margin: 8px 0 0; }
        .comparison-side p { font-size: 0.85rem; color: var(--text-secondary); }
        .comp-connector { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .match-circle { width: 36px; height: 36px; border-radius: 50%; background: var(--gradient-match); color: white; display: flex; align-items: center; justify-content: center; }

        .verification-card { padding: 28px; }
        .verification-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .verification-header h3 { font-size: 1.2rem; }
        .question-display { background: var(--bg-muted); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px; }
        .question-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; margin-bottom: 6px; }
        .question-text { font-size: 1rem; font-weight: 700; font-style: italic; color: var(--text-primary); }
        .verification-form { display: flex; flex-direction: column; gap: 16px; }

        .result-card { padding: 36px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; }
        .result-card h3 { font-size: 1.4rem; }
        .result-card p { color: var(--text-secondary); }
        .success-result { border-color: var(--success); background: rgba(16, 185, 129, 0.02); }
        .danger-result { border-color: var(--danger); background: rgba(239, 68, 68, 0.02); }

        .owner-controls-card { padding: 24px; }
        .owner-controls-card h4 { font-size: 1rem; margin-bottom: 8px; }
        .owner-controls-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px; }
        .owner-btns { display: flex; gap: 12px; }
        .submitted-answer { margin-top: 16px; padding: 12px; background: var(--bg-muted); border-radius: var(--radius-sm); }
        .ans-label { font-size: 0.75rem; color: var(--text-muted); }
        .ans-val { font-weight: 700; font-style: italic; }

        .claim-sidebar { display: flex; flex-direction: column; gap: 24px; }
        .sidebar-detail-card { padding: 24px; }
        .sidebar-detail-card h4 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem; }
        .detail-row span { color: var(--text-muted); }
        .detail-row:last-child { border-bottom: none; }

        .timeline { display: flex; flex-direction: column; gap: 0; }
        .timeline-step { display: flex; gap: 12px; align-items: flex-start; padding-bottom: 20px; position: relative; }
        .timeline-step:last-child { padding-bottom: 0; }
        .timeline-step::before { content: ''; position: absolute; left: 7px; top: 20px; width: 2px; height: calc(100% - 4px); background: var(--border-color); }
        .timeline-step:last-child::before { display: none; }
        .t-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-color); background: var(--bg-card); flex-shrink: 0; margin-top: 2px; z-index: 1; }
        .timeline-step.done .t-dot { background: var(--success); border-color: var(--success); }
        .timeline-step.done::before { background: var(--success); }
        .timeline-step div strong { font-size: 0.85rem; display: block; }
        .timeline-step div p { font-size: 0.75rem; color: var(--text-muted); }

        @media (max-width: 900px) {
          .claim-layout { grid-template-columns: 1fr; }
          .items-comparison-card { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default ClaimPage;
