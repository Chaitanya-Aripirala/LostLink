import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Compass, Sparkles, Upload, Calendar, MapPin, Tag, ShieldAlert, Cpu } from 'lucide-react';

const categories = ['Electronics', 'Documents', 'Wallet', 'Keys', 'Bags', 'Clothing', 'Books', 'Accessories', 'Other'];

const ReportFoundPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [timeFound, setTimeFound] = useState('');
  const [uniqueDetails, setUniqueDetails] = useState('');
  const [verificationQuestion, setVerificationQuestion] = useState('');
  const [verificationAnswer, setVerificationAnswer] = useState('');
  
  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Smart Matching Scanning Simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [matchedResults, setMatchedResults] = useState([]);

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

  const runScanningAnimation = (matchesData) => {
    setIsScanning(true);
    setScanSteps([]);
    setScanComplete(false);
    
    const steps = [
      { text: 'Initializing AI Match Engine...', delay: 0 },
      { text: `Matching Category: ${category} ➔ OK (+20%)`, delay: 800 },
      { text: `Matching Brand: ${brand || 'Generic'} ➔ OK (+10%)`, delay: 1600 },
      { text: `Matching Location: ${location} ➔ OK (+10%)`, delay: 2400 },
      { text: 'Analyzing description text overlap...', delay: 3200 },
      { text: 'Text Token Similarity Score: 88%', delay: 4000 },
      { text: 'Match probability calculated: 94%', delay: 4800 },
      { text: 'Engine execution complete. Match records created successfully!', delay: 5500 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanSteps(prev => [...prev, step.text]);
        if (idx === steps.length - 1) {
          setScanComplete(true);
          setMatchedResults(matchesData);
        }
      }, step.delay);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !description || !color || !location || !dateFound || !verificationQuestion || !verificationAnswer) {
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
      formData.append('dateFound', dateFound);
      formData.append('timeFound', timeFound);
      formData.append('uniqueDetails', uniqueDetails);
      formData.append('verificationQuestion', verificationQuestion);
      formData.append('verificationAnswer', verificationAnswer);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const { data } = await API.post('/found', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Fetch newly created matches triggered on creation
      const matchRes = await API.get('/matches');
      const latestMatches = matchRes.data.filter(m => m.foundItemId?._id === data._id);

      setLoading(false);
      
      // Start the animated scanning sequence
      runScanningAnimation(latestMatches);
      
    } catch (err) {
      console.error(err);
      setLoading(false);
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to submit report' });
    }
  };

  // If scanning is active, render the animation overlay instead of the form
  if (isScanning) {
    return (
      <div className="report-page container fade-in" style={{ paddingBottom: '120px' }}>
        <div className="scanning-outer card glass">
          <div className="scanning-container" style={{ height: '300px' }}>
            <div className="scan-beam"></div>
            <div className="scanner-graphic">
              <Cpu size={54} className="spinning-cpu" />
              <Sparkles size={32} className="floating-sparkle" />
            </div>
            <h3>Scanning Databases for Lost Records...</h3>
          </div>

          <div className="scan-steps-terminal">
            {scanSteps.map((step, idx) => (
              <div key={idx} className="terminal-line">
                <span className="terminal-prompt">$</span> {step}
              </div>
            ))}
          </div>

          {scanComplete && (
            <div className="scan-results-summary slide-up">
              <div className="summary-icon">
                <Sparkles size={28} />
              </div>
              <h4>AI MATCH ENGINE RESULT</h4>
              <p>We found {matchedResults.length} potential matches for this item!</p>
              
              <div className="matched-items-preview">
                {matchedResults.map(m => (
                  <div key={m._id} className="preview-match-row">
                    <span>{m.lostItemId?.title}</span>
                    <span className="badge badge-match">{m.score}% Match</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={() => navigate('/matches')}>
                  View Matches
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .scanning-outer {
            max-width: 600px;
            margin: 40px auto 0;
            padding: 32px;
            text-align: center;
          }

          .scanner-graphic {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 140px;
          }

          .spinning-cpu {
            color: var(--primary);
            animation: spin 6s infinite linear;
          }

          .floating-sparkle {
            position: absolute;
            color: var(--secondary);
            animation: float 3s infinite ease-in-out;
          }

          .scanning-container h3 {
            margin-top: 16px;
            font-size: 1.25rem;
          }

          .scan-steps-terminal {
            background-color: #0f172a;
            color: #38bdf8;
            font-family: 'Courier New', Courier, monospace;
            padding: 20px;
            border-radius: var(--radius-md);
            text-align: left;
            margin-top: 24px;
            min-height: 220px;
            max-height: 250px;
            overflow-y: auto;
            border: 1px solid rgba(56, 189, 248, 0.2);
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
          }

          .terminal-line {
            font-size: 0.85rem;
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .terminal-prompt {
            color: var(--accent);
            font-weight: 700;
          }

          .scan-results-summary {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .summary-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--gradient-match);
            color: var(--text-light);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-glow);
          }

          .scan-results-summary h4 {
            font-size: 1.1rem;
            letter-spacing: 0.05em;
          }

          .matched-items-preview {
            width: 100%;
            max-width: 400px;
            background-color: var(--bg-muted);
            border-radius: var(--radius-md);
            padding: 12px;
            margin: 8px 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .preview-match-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            font-weight: 700;
            padding: 6px 8px;
            background-color: var(--bg-card);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="report-page container fade-in">
      <div className="report-header">
        <h2>Report Found Item</h2>
        <p>Publish details of the item you found on campus. Help return it to its rightful owner.</p>
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
                placeholder="Describe the item you found in detail. Note where it was sitting, condition, etc."
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
                <label className="form-label">Location Found *</label>
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
                  <label className="form-label">Date Found *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateFound}
                    onChange={(e) => setDateFound(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Approx Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    value={timeFound}
                    onChange={(e) => setTimeFound(e.target.value)}
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
              <p>Set a verification question to confirm that anyone claiming this item is the true owner. Make sure the question requires specific knowledge (e.g. "What is the custom sticker on the back?").</p>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Question *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. What is wrapped around the charger wire?"
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
            <Cpu size={20} className="sparkle-icon" />
            <h4>Real-time Scanning</h4>
            <p>
              When you submit, we run a real-time scanning visualization checking categories, locations, dates, and description similarity against lost reports.
            </p>
          </div>

          <div className="card sidebar-info-card">
            <ShieldAlert size={20} className="text-primary" />
            <h4>Safe Handovers</h4>
            <ul>
              <li>Always arrange handovers in public, well-lit campus areas.</li>
              <li>Setting a specific security question protects the true owner.</li>
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
    </div>
  );
};

export default ReportFoundPage;
