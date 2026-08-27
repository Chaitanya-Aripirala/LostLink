import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import ItemCard from '../components/ItemCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Search, SlidersHorizontal, RefreshCw, Archive } from 'lucide-react';

const categories = ['Electronics', 'Documents', 'Wallet', 'Keys', 'Bags', 'Clothing', 'Books', 'Accessories', 'Other'];

const BrowsePage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all'); // all, lost, found
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('');
  const [sort, setSort] = useState('newest'); // newest, oldest

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
        location,
        color,
        sort
      };

      let lostRes = [];
      let foundRes = [];

      if (type === 'all' || type === 'lost') {
        const { data } = await API.get('/lost', { params });
        lostRes = data;
      }
      if (type === 'all' || type === 'found') {
        const { data } = await API.get('/found', { params });
        foundRes = data;
      }

      setLostItems(lostRes);
      setFoundItems(foundRes);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [search, type, category, location, color, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResetFilters = () => {
    setSearch('');
    setType('all');
    setCategory('');
    setLocation('');
    setColor('');
    setSort('newest');
  };

  // Combine items for 'all' list
  const getCombinedItems = () => {
    const lostWithFlag = lostItems.map(item => ({ ...item, isLost: true }));
    const foundWithFlag = foundItems.map(item => ({ ...item, isLost: false }));
    const combined = [...lostWithFlag, ...foundWithFlag];
    
    // Sort combined list
    return combined.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const displayedItems = getCombinedItems();

  return (
    <div className="browse-page container">
      {/* Top Search bar */}
      <div className="browse-header fade-in">
        <h2>Browse Campus Directory</h2>
        <p>Search and filter items reported across all colleges and facilities.</p>
        
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            className="form-control search-input" 
            placeholder="Search by title or description (e.g., iPhone, HP charger, backpack)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="browse-content grid-layout">
        {/* Filters Panel */}
        <aside className="filters-sidebar card">
          <div className="sidebar-header">
            <div className="title-row">
              <SlidersHorizontal size={18} />
              <h3>Filters</h3>
            </div>
            <button className="reset-btn" onClick={handleResetFilters}>Reset</button>
          </div>

          <div className="sidebar-body">
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <div className="type-buttons">
                <button 
                  className={`type-btn ${type === 'all' ? 'active' : ''}`}
                  onClick={() => setType('all')}
                >
                  All
                </button>
                <button 
                  className={`type-btn ${type === 'lost' ? 'active' : ''}`}
                  onClick={() => setType('lost')}
                >
                  Lost
                </button>
                <button 
                  className={`type-btn ${type === 'found' ? 'active' : ''}`}
                  onClick={() => setType('found')}
                >
                  Found
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-control" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Library, Cafe" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Black, Blue" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select 
                className="form-control" 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <button className="btn btn-outline btn-sm apply-btn" onClick={fetchData}>
              <RefreshCw size={14} /> Refresh Search
            </button>
          </div>
        </aside>

        {/* Results list */}
        <main className="results-container">
          <div className="results-header">
            <span>Showing {loading ? '...' : displayedItems.length} items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="empty-state card fade-in">
              <div className="empty-icon-wrapper">
                <Archive size={40} className="text-muted" />
              </div>
              <h3>No items found</h3>
              <p>Try resetting filters or adjusting search keywords. Someone might report it soon!</p>
              <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 fade-in">
              {displayedItems.map((item) => (
                <ItemCard 
                  key={item._id} 
                  item={item} 
                  type={item.isLost ? 'lost' : 'found'} 
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .browse-page {
          padding-top: 104px;
          padding-bottom: 60px;
        }

        .browse-header {
          margin-bottom: 32px;
        }

        .browse-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .browse-header p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          color: var(--text-muted);
        }

        .search-input {
          padding: 16px 16px 16px 54px;
          font-size: 1.05rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .search-input:focus {
          box-shadow: var(--shadow-glow);
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
        }

        .filters-sidebar {
          padding: 24px;
          height: fit-content;
          align-self: start;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
        }

        .sidebar-header h3 {
          font-size: 1.1rem;
        }

        .reset-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
        }

        .reset-btn:hover {
          text-decoration: underline;
        }

        .type-buttons {
          display: flex;
          background-color: var(--bg-muted);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .type-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--text-secondary);
        }

        .type-btn.active {
          background-color: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .apply-btn {
          width: 100%;
          margin-top: 10px;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .empty-state {
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
        }

        .empty-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background-color: var(--bg-muted);
          border-radius: 50%;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .empty-state p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 380px;
          margin-bottom: 8px;
        }

        @media (max-width: 900px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowsePage;
