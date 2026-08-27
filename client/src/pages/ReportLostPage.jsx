import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Compass, Sparkles, Upload, HelpCircle, Info, Calendar, MapPin, Tag } from 'lucide-react';

const categories = ['Electronics', 'Documents', 'Wallet', 'Keys', 'Bags', 'Clothing', 'Books', 'Accessories', 'Other'];

const ReportLostPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [timeLost, setTimeLost] = useState('');
  const [uniqueDetails, setUniqueDetails] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  
  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !description || !color || !location || !dateLost || !verificationQuestion || !verificationAnswer) {
      setToast({ type: 'error', message: 'Please fill in all required fields marked with *' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('color', color);
      formData.append('brand', brand);
      formData.append('location', location);
      formData.append('dateLost', dateLost);
      formData.append('timeLost', timeLost);
      formData.append('uniqueDetails', uniqueDetails);
      formData.append('verificationQuestion', verificationQuestion);
      formData.append('verificationAnswer', verificationAnswer);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await API.post('/lost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ type: 'success', message: 'Lost item report published successfully!' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to submit report' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page container fade-in">
      <div className="report-header">
        <h2>Report Lost Item</h2>
        <p>Specify the details of the item you lost so that the AI Match Engine can locate matching reports.</p>
      </div>

      <div className="report-layout">
        <form onSubmit={handleSubmit} className="report-form card">
          {/* Section 1: Core Details */}
          <div className="form-section">
            <h3>1. Item Information</h3>
            
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Black HP Laptop Charger, Blue Samsung Phone"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category *</label>
                <select 
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Brand</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Apple, HP, Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Color *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Black, Silver, Blue"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Unique Identifiers</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. sticky tape, custom sticker"
                  value={uniqueDetails}
                  onChange={(e) => setUniqueDetails(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea 
                className="form-control" 
                rows="4"
                placeholder="Describe your item in detail. Mention shape, texture, size, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          {/* Section 2: Time & Location */}
          <div className="form-section">
            <h3>2. Event Metadata</h3>
            
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Last Seen Location *</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Central Library, Block A lab"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ flex: 1 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Date Lost *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateLost}
                    onChange={(e) => setDateLost(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Approx Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    value={timeLost}
                    onChange={(e) => setTimeLost(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Image Selector */}
            <div className="form-group">
              <label className="form-label">Upload Reference Photo</label>
              <div className="image-dropzone">
                <input 
                  type="file" 
                  id="imageFile" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="imageFile" className="dropzone-label">
                  {imagePreview ? (
                    <div className="preview-container">
                      <img src={imagePreview} alt="Preview" className="dropzone-preview" />
                      <span className="change-img-lbl">Change Image</span>
                    </div>
                  ) : (
                    <div className="dropzone-placeholder">
                      <Upload size={28} className="text-muted" />
                      <span>Click to select an image from your files</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Verification Question */}
          <div className="form-section">
            <div className="section-title-with-desc">
              <h3>3. Claim Security Check</h3>
              <p>Set a verification question to confirm that anyone claiming this item is the true finder/owner. Ensure the answer is specific and not obvious from the photos.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Question *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. What color tape is wrapped around the charger wire?"
                value={verificationQuestion}
                onChange={(e) => setVerificationQuestion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Answer Key *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. black tape"
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading}
              style={{ width: '200px' }}
            >
              {loading ? 'Submitting...' : 'Publish Report'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>

        {/* Sidebar helper information */}
        <aside className="report-sidebar">
          <div className="card sidebar-info-card bg-purple-light">
            <Sparkles size={20} className="sparkle-icon" />
            <h4>AI Smart Matching</h4>
            <p>
              Once you submit this report, LostLink's Smart Match Engine runs immediately. We compare description semantic terms, dates, locations, categories, and colors to find matching found item reports.
            </p>
          </div>

          <div className="card sidebar-info-card">
            <HelpCircle size={20} className="text-primary" />
            <h4>Handy Tips</h4>
            <ul>
              <li>Upload a clear photo to help searchers identify the item.</li>
              <li>Provide specific landmarks in the location details.</li>
              <li>Setting a good security question prevents wrongful claims from bad actors.</li>
            </ul>
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
        .report-page {
          padding-top: 104px;
          padding-bottom: 80px;
        }

        .report-header {
          margin-bottom: 32px;
        }

        .report-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .report-header p {
          color: var(--text-secondary);
        }

        .report-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .report-form {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-section h3 {
          font-size: 1.2rem;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .section-title-with-desc p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .image-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-app);
          transition: var(--transition-fast);
        }

        .image-dropzone:hover {
          border-color: var(--primary);
        }

        .dropzone-label {
          display: block;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .dropzone-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .preview-container {
          position: relative;
          height: 220px;
          width: 100%;
        }

        .dropzone-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .change-img-lbl {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.7);
          color: var(--text-light);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .report-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-info-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bg-purple-light {
          background-color: rgba(139, 92, 246, 0.03);
          border-color: rgba(139, 92, 246, 0.15);
        }

        .sidebar-info-card h4 {
          font-size: 1rem;
        }

        .sidebar-info-card p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .sidebar-info-card ul {
          padding-left: 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .report-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportLostPage;
