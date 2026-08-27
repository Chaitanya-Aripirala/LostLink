import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, User } from 'lucide-react';

const ItemCard = ({ item, type = 'lost' }) => {
  const isLost = type === 'lost';
  const date = isLost ? item.dateLost : item.dateFound;
  const location = item.location;
  
  // Clean fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=500';

  return (
    <div className="card item-card card-hover">
      {/* Badge */}
      <div className="item-badge-wrapper">
        <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
          {isLost ? 'Lost' : 'Found'}
        </span>
      </div>

      {/* Image */}
      <div className="item-image-container">
        <img 
          src={item.image || fallbackImage} 
          alt={item.title} 
          className="item-image"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <div className="item-overlay">
          <Link to={`/items/${isLost ? 'lost' : 'found'}/${item._id}`} className="btn btn-primary btn-sm view-btn">
            View Details
          </Link>
        </div>
      </div>

      {/* Info Body */}
      <div className="item-body">
        <div className="item-category-wrapper">
          <Tag size={12} className="text-primary" />
          <span className="item-category">{item.category}</span>
        </div>
        
        <h3 className="item-title" title={item.title}>
          <Link to={`/items/${isLost ? 'lost' : 'found'}/${item._id}`}>{item.title}</Link>
        </h3>
        
        <div className="item-meta-info">
          <div className="meta-row">
            <MapPin size={14} className="meta-icon" />
            <span className="meta-text">{location}</span>
          </div>
          <div className="meta-row">
            <Calendar size={14} className="meta-icon" />
            <span className="meta-text">{date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Poster Info */}
        {item.userId && (
          <div className="item-poster">
            {item.userId.profileImage ? (
              <img src={item.userId.profileImage} alt={item.userId.name} className="poster-avatar" />
            ) : (
              <div className="poster-avatar-fallback"><User size={12} /></div>
            )}
            <span className="poster-name">{item.userId.name}</span>
          </div>
        )}
      </div>

      <style>{`
        .item-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .item-badge-wrapper {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .item-image-container {
          position: relative;
          height: 180px;
          overflow: hidden;
          background-color: var(--bg-muted);
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .item-card:hover .item-image {
          transform: scale(1.08);
        }

        .item-card:hover .item-overlay {
          opacity: 1;
        }

        .view-btn {
          transform: translateY(10px);
          transition: transform var(--transition-normal);
        }

        .item-card:hover .view-btn {
          transform: translateY(0);
        }

        .item-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .item-category-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .item-category {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .item-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.3;
          height: 44px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-title a:hover {
          color: var(--primary);
        }

        .item-meta-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .meta-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-poster {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
        }

        .poster-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .poster-avatar-fallback {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--bg-muted);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .poster-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default ItemCard;
