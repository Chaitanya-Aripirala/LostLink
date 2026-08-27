import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DetailsSkeleton } from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import { MapPin, Calendar, Tag, User, Shield, Info, Edit, Trash, Sparkles } from 'lucide-react';

const ItemDetailsPage = () => {
  const { type, id } = useParams(); // type = 'lost' or 'found'
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const isLost = type === 'lost';

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/${type}/${id}`);
        setItem(data);
        
        // Fetch matches related to this item if user is logged in
        if (user) {
          const matchRes = await API.get('/matches');
          const itemMatches = matchRes.data.filter(m => 
            isLost ? m.lostItemId?._id === id : m.foundItemId?._id === id
          );
          setMatches(itemMatches);
        }
      } catch (err) {
        console.error(err);
        setToast({ type: 'error', message: 'Item details could not be retrieved' });
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id, user, isLost]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this report?')) return;
    try {
      await API.delete(`/${type}/${id}`);
      setToast({ type: 'success', message: 'Report deleted successfully' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete report' });
    }
  };

  const handleClaim = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setClaimLoading(true);
    try {
      const claimBody = isLost 
        ? { lostItemId: id, foundItemId: matches[0]?.foundItemId?._id || id } // fallback
        : { lostItemId: matches[0]?.lostItemId?._id || id, foundItemId: id };

      // Wait, if no matches exist, how do we claim? The claimant wants to claim this found item.
      // So they specify lostItemId and foundItemId. If claimant has a lost item reported, they can link it.
      // Let's check if the claimant has an active item of the opposite type.
      // For example, if claiming a found item, let's find if claimant has a matching lost item.
      // If not, we can create a temporary mock lost item or prompt the user.
      // In our demo journey, user Chaitanya has a lost item, John Doe has a found item. They match.
      // So we can check if they have a match and use that, or check user's items of opposite type.
      let lostId = isLost ? id : '';
      let foundId = isLost ? '' : id;

      if (!isLost) {
        // Claiming a found item. Let's find claimant's active lost items.
        const { data: userLostItems } = await API.get('/lost');
        const myLost = userLostItems.filter(item => item.userId._id === user._id || item.userId === user._id);
        if (myLost.length > 0) {
          lostId = myLost[0]._id;
        } else {
          // If no active report, let's create a placeholder active lost item first
          const placeholderRes = await API.post('/lost', {
            title: item.title,
            category: item.category,
            description: `Claim for found item: ${item.title}`,
            color: item.color,
            brand: item.brand,
            location: item.location,
            dateLost: new Date(),
            verificationQuestion: 'Verification Question',
            verificationAnswer: 'Verification Answer'
          });
          lostId = placeholderRes.data._id;
        }
      } else {
        // Claiming a lost item. Find claimant's active found items.
        const { data: userFoundItems } = await API.get('/found');
        const myFound = userFoundItems.filter(item => item.userId._id === user._id || item.userId === user._id);
        if (myFound.length > 0) {
          foundId = myFound[0]._id;
        } else {
          const placeholderRes = await API.post('/found', {
            title: item.title,
            category: item.category,
            description: `Claim for lost item: ${item.title}`,
            color: item.color,
            brand: item.brand,
            location: item.location,
            dateFound: new Date(),
            verificationQuestion: 'Verification Question',
            verificationAnswer: 'Verification Answer'
          });
          foundId = placeholderRes.data._id;
        }
      }

      const { data } = await API.post('/claims', {
        lostItemId: lostId,
        foundItemId: foundId
      });

      setToast({ type: 'success', message: 'Claim requested! Redirecting to verification...' });
      setTimeout(() => {
        navigate(`/claims/${data._id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to initiate claim' });
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="item-details-page container" style={{ paddingTop: '104px' }}>
        <DetailsSkeleton />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-details-page container text-center" style={{ paddingTop: '140px' }}>
        <h3>Item not found</h3>
        <Link to="/browse" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>Back to Browse</Link>
      </div>
    );
  }

  const isOwner = user && (item.userId._id === user._id || item.userId === user._id);
  const fallbackImage = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500';

  return (
    <div className="item-details-page container fade-in">
      <div className="back-link">
        <Link to="/browse">← Back to Browse</Link>
      </div>

      <div className="details-layout">
        {/* Left column: Image Card */}
        <div className="details-image-card card">
          <span className={`badge details-badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          <img 
            src={item.image || fallbackImage} 
            alt={item.title} 
            className="details-img"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>

        {/* Right column: Info details */}
        <div className="details-info-card">
          <div className="details-header">
            <div className="category-tag">
              <Tag size={14} />
              <span>{item.category}</span>
            </div>
            
            <h2>{item.title}</h2>
            
            <div className="meta-grid">
              <div className="meta-tile">
                <MapPin size={16} />
                <div>
                  <span className="tile-label">Location {isLost ? 'Lost' : 'Found'}</span>
                  <span className="tile-val">{item.location}</span>
                </div>
              </div>

              <div className="meta-tile">
                <Calendar size={16} />
                <div>
                  <span className="tile-label">Date {isLost ? 'Lost' : 'Found'}</span>
                  <span className="tile-val">{new Date(isLost ? item.dateLost : item.dateFound).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-body card">
            <h3>Description</h3>
            <p className="description-para">{item.description}</p>

            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Brand:</span>
                <span className="spec-val">{item.brand || 'Generic'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color:</span>
                <span className="spec-val">{item.color}</span>
              </div>
              {item.timeLost || item.timeFound ? (
                <div className="spec-item">
                  <span className="spec-label">Time:</span>
                  <span className="spec-val">{isLost ? item.timeLost : item.timeFound}</span>
                </div>
              ) : null}
              {item.uniqueDetails && (
                <div className="spec-item full-width">
                  <span className="spec-label">Unique Identifiers:</span>
                  <span className="spec-val">{item.uniqueDetails}</span>
                </div>
              )}
            </div>

            {/* Verification Alert Info */}
            <div className="verification-info-alert">
              <Shield size={20} className="alert-icon" />
              <div>
                <h4>Verification Required</h4>
                <p>Owner set question: <strong>"{item.verificationQuestion}"</strong></p>
                <p className="alert-note">To claim this item, you will need to submit a correct answer based on identifying marks or proof.</p>
              </div>
            </div>

            {/* Owner Details Card */}
            <div className="owner-details-row">
              {item.userId.profileImage ? (
                <img src={item.userId.profileImage} alt={item.userId.name} className="owner-avatar" />
              ) : (
                <div className="owner-avatar-fallback"><User size={20} /></div>
              )}
              <div className="owner-info">
                <h4>{item.userId.name}</h4>
                <p>{item.userId.college} • Member since 2026</p>
                {user ? (
                  <p className="contact-text">📞 {item.userId.phone} • ✉️ {item.userId.email}</p>
                ) : (
                  <p className="contact-text-placeholder">Log in to view contact details</p>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="details-actions">
              {isOwner ? (
                <div className="owner-actions">
                  <Link to={`/items/${type}/${id}/edit`} className="btn btn-outline">
                    <Edit size={16} /> Edit Report
                  </Link>
                  <button className="btn btn-light" onClick={handleDelete} style={{ color: 'var(--danger)' }}>
                    <Trash size={16} /> Remove Report
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-primary btn-lg claim-cta-btn" 
                  onClick={handleClaim}
                  disabled={claimLoading}
                >
                  <Sparkles size={18} /> {claimLoading ? 'Initiating Claim...' : 'Claim This Item'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Potential Matches Section */}
      {user && matches.length > 0 && (
        <section className="item-matches-section" style={{ marginTop: '48px' }}>
          <div className="section-header-left">
            <Sparkles size={20} className="sparkle-icon" />
            <h3>AI Match Engine Recommendations ({matches.length})</h3>
          </div>
          <div className="matches-grid grid grid-cols-2" style={{ marginTop: '16px' }}>
            {matches.map(match => {
              const matchedItem = isLost ? match.foundItemId : match.lostItemId;
              if (!matchedItem) return null;
              return (
                <div key={match._id} className="card match-subcard card-hover" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-match">{match.score}% MATCH</span>
                    <span className="match-time">{new Date(match.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4>{matchedItem.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    📍 {matchedItem.location} • Category: {matchedItem.category}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/items/${isLost ? 'found' : 'lost'}/${matchedItem._id}`} className="btn btn-light btn-sm">
                      Inspect Item
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={handleClaim}>
                      Claim Match
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <style>{`
        .item-details-page {
          padding-top: 104px;
          padding-bottom: 80px;
        }

        .back-link {
          margin-bottom: 24px;
        }

        .back-link a {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .back-link a:hover {
          color: var(--primary);
        }

        .details-layout {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr;
          gap: 40px;
          align-items: start;
        }

        .details-image-card {
          position: relative;
          height: 420px;
          border-radius: var(--radius-xl);
          background-color: var(--bg-muted);
        }

        .details-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          padding: 6px 14px;
          font-size: 0.8rem;
        }

        .details-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .details-header h2 {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .meta-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--bg-muted);
          padding: 12px 18px;
          border-radius: var(--radius-md);
        }

        .meta-tile svg {
          color: var(--primary);
        }

        .tile-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .tile-val {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .details-body {
          padding: 32px;
        }

        .details-body h3 {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .description-para {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 0.95rem;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          margin-bottom: 24px;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-item.full-width {
          grid-column: span 2;
        }

        .spec-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .spec-val {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .verification-info-alert {
          display: flex;
          gap: 12px;
          background-color: var(--warning-light);
          border: 1px solid var(--warning);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 24px;
        }

        .alert-icon {
          color: var(--warning);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .verification-info-alert h4 {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--warning);
          margin-bottom: 4px;
        }

        .verification-info-alert p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .alert-note {
          font-size: 0.75rem !important;
          color: var(--text-muted) !important;
          margin-top: 4px;
        }

        .owner-details-row {
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
          margin-bottom: 24px;
        }

        .owner-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
        }

        .owner-avatar-fallback {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .owner-info h4 {
          font-size: 1rem;
          margin: 0;
        }

        .owner-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .contact-text {
          font-weight: 600;
          color: var(--primary) !important;
          margin-top: 4px;
        }

        .contact-text-placeholder {
          font-size: 0.75rem !important;
          font-weight: 700;
          color: var(--accent) !important;
          margin-top: 4px;
        }

        .details-actions {
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
        }

        .owner-actions {
          display: flex;
          gap: 12px;
        }

        .claim-cta-btn {
          width: 100%;
        }

        .section-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .section-header-left h3 {
          font-size: 1.3rem;
        }

        .match-subcard h4 {
          font-size: 1.05rem;
          margin-bottom: 4px;
        }

        .match-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr;
          }
          .details-image-card {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemDetailsPage;
