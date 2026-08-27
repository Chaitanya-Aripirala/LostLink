import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { User, Mail, Phone, School, CreditCard, Edit3, Save, Upload, Award } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setName(user.name || '');
    setPhone(user.phone || '');
    setCollege(user.college || '');
    setImagePreview(user.profileImage || '');

    const fetchStats = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('college', college);
      if (imageFile) formData.append('profileImage', imageFile);

      await updateProfile(formData);
      setEditing(false);
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update profile' });
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page container fade-in">
      <div className="profile-layout">
        {/* Left: Profile Card */}
        <div className="profile-card card">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {imagePreview ? (
                <img src={imagePreview} alt={user.name} className="profile-avatar-img" />
              ) : (
                <div className="avatar-fallback-lg"><User size={40} /></div>
              )}
              {editing && (
                <label htmlFor="profileImg" className="avatar-edit-btn">
                  <Upload size={14} />
                  <input type="file" id="profileImg" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
            {!editing ? (
              <>
                <h2>{user.name}</h2>
                <p className="profile-college">{user.college}</p>
                <span className={`role-badge ${user.role === 'admin' ? 'badge-primary' : 'badge-found'}`}>
                  {user.role === 'admin' ? '⚙️ Admin' : '🎓 Student'}
                </span>
              </>
            ) : null}
          </div>

          {!editing && (
            <div className="profile-info-list">
              <div className="info-row">
                <Mail size={16} className="info-icon" />
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <Phone size={16} className="info-icon" />
                <span>{user.phone || 'Not set'}</span>
              </div>
              <div className="info-row">
                <School size={16} className="info-icon" />
                <span>{user.college}</span>
              </div>
              <div className="info-row">
                <CreditCard size={16} className="info-icon" />
                <span>{user.studentId}</span>
              </div>
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="edit-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">College</label>
                <input type="text" className="form-control" value={college} onChange={e => setCollege(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-outline btn-sm edit-profile-btn" onClick={() => setEditing(true)}>
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* Right: Stats & Activity */}
        <div className="profile-right">
          <div className="stats-row">
            <div className="card stat-mini card-hover">
              <span className="stat-mini-num">{loading ? '...' : stats?.lostCount || 0}</span>
              <span className="stat-mini-label">Lost Reports</span>
            </div>
            <div className="card stat-mini card-hover">
              <span className="stat-mini-num">{loading ? '...' : stats?.foundCount || 0}</span>
              <span className="stat-mini-label">Found Reports</span>
            </div>
            <div className="card stat-mini card-hover">
              <span className="stat-mini-num">{loading ? '...' : stats?.claimCount || 0}</span>
              <span className="stat-mini-label">Claims Filed</span>
            </div>
            <div className="card stat-mini card-hover">
              <span className="stat-mini-num">{loading ? '...' : stats?.resolvedCount || 0}</span>
              <span className="stat-mini-label">Recoveries</span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="card achievements-card">
            <div className="achievements-header">
              <Award size={20} className="text-warning" />
              <h3>Achievements</h3>
            </div>
            <div className="achievements-grid">
              <div className={`achievement-badge ${(stats?.foundCount || 0) >= 1 ? 'unlocked' : 'locked'}`}>
                <span>🔍</span>
                <p>First Finder</p>
              </div>
              <div className={`achievement-badge ${(stats?.resolvedCount || 0) >= 1 ? 'unlocked' : 'locked'}`}>
                <span>🤝</span>
                <p>Good Samaritan</p>
              </div>
              <div className={`achievement-badge ${(stats?.lostCount || 0) >= 3 ? 'unlocked' : 'locked'}`}>
                <span>📢</span>
                <p>Active Reporter</p>
              </div>
              <div className={`achievement-badge ${(stats?.resolvedCount || 0) >= 3 ? 'unlocked' : 'locked'}`}>
                <span>⭐</span>
                <p>Community Hero</p>
              </div>
            </div>
          </div>

          {/* Recent Items */}
          {stats?.recentItems && stats.recentItems.length > 0 && (
            <div className="card recent-items-card">
              <h3>Recent Activity</h3>
              <div className="recent-items-list">
                {stats.recentItems.slice(0, 4).map(item => (
                  <div key={item._id} className="recent-row">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=80'}
                      alt={item.title}
                      className="recent-thumbnail"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=80'; }}
                    />
                    <div className="recent-info">
                      <strong>{item.title}</strong>
                      <span>{item.category} • {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-outline danger-btn" onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        .profile-page { padding-top: 104px; padding-bottom: 80px; }
        .profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }

        .profile-card { padding: 32px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
        .avatar-wrapper { position: relative; }
        .profile-avatar-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-light); }
        .avatar-fallback-lg { width: 100px; height: 100px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; }
        .avatar-edit-btn { position: absolute; bottom: 2px; right: 2px; width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .profile-card h2 { font-size: 1.4rem; font-weight: 800; }
        .profile-college { font-size: 0.85rem; color: var(--text-secondary); }
        .role-badge { padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; }
        .profile-info-list { width: 100%; display: flex; flex-direction: column; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 20px; }
        .info-row { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--text-secondary); }
        .info-icon { color: var(--primary); flex-shrink: 0; }
        .edit-profile-btn { width: 100%; }
        .edit-form { width: 100%; text-align: left; }

        .profile-right { display: flex; flex-direction: column; gap: 24px; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-mini { padding: 20px; text-align: center; }
        .stat-mini-num { display: block; font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--primary); }
        .stat-mini-label { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }

        .achievements-card { padding: 24px; }
        .achievements-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .achievements-header h3 { font-size: 1.1rem; }
        .achievements-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .achievement-badge { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center; }
        .achievement-badge span { font-size: 1.8rem; }
        .achievement-badge p { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); }
        .achievement-badge.unlocked { border-color: var(--warning); background: var(--warning-light); }
        .achievement-badge.locked { opacity: 0.4; filter: grayscale(1); }

        .recent-items-card { padding: 24px; }
        .recent-items-card h3 { font-size: 1.1rem; margin-bottom: 16px; }
        .recent-items-list { display: flex; flex-direction: column; gap: 12px; }
        .recent-row { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: var(--radius-sm); }
        .recent-row:hover { background: var(--bg-muted); }
        .recent-thumbnail { width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover; }
        .recent-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .recent-info strong { font-size: 0.85rem; }
        .recent-info span { font-size: 0.75rem; color: var(--text-muted); }

        .danger-btn { color: var(--danger) !important; border-color: var(--danger) !important; }
        .danger-btn:hover { background: var(--danger-light) !important; }

        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .achievements-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
