import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Phone, School, CreditCard, ArrowRight } from 'lucide-react';
import Toast from '../components/Toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !studentId || !college || !phone) {
      setToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('studentId', studentId);
      formData.append('college', college);
      formData.append('phone', phone);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await register(formData);
      setToast({ type: 'success', message: 'Registration successful! Welcome to LostLink.' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass fade-in" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="logo-icon">
              <Compass size={22} />
            </div>
            <span>LOSTLINK</span>
          </Link>
          <h2>Create Account</h2>
          <p>Join campus LostLink to recover lost items</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {/* Avatar Upload */}
          <div className="avatar-upload-section">
            <label className="avatar-upload-label" htmlFor="profileImage">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder"><User size={24} /></div>
              )}
              <span className="upload-btn-text">Upload Photo</span>
            </label>
            <input 
              type="file" 
              id="profileImage" 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  className="form-control" 
                  placeholder="Chaitanya A" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder="email@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="studentId">Student ID / Roll No</label>
              <div className="input-with-icon">
                <CreditCard size={16} className="input-icon" />
                <input 
                  type="text" 
                  id="studentId" 
                  className="form-control" 
                  placeholder="2026CS101" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input 
                  type="text" 
                  id="phone" 
                  className="form-control" 
                  placeholder="9876543210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="college">College / University</label>
            <div className="input-with-icon">
              <School size={16} className="input-icon" />
              <input 
                type="text" 
                id="college" 
                className="form-control" 
                placeholder="Campus School of Engineering" 
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <style>{`
        .avatar-upload-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .avatar-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }

        .avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--bg-muted);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--border-color);
        }

        .upload-btn-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
        }

        .upload-btn-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
