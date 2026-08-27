import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Mail, Lock, Database, ArrowRight } from 'lucide-react';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, seedDemoData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      setToast({ type: 'success', message: 'Welcome back to LostLink!' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const data = await seedDemoData();
      setToast({ type: 'success', message: 'Demo database seeded successfully!' });
      
      // Auto fill Chaitanya's credentials
      setEmail('chaitanya@lostlink.com');
      setPassword('password123');
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to seed demo data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="logo-icon">
              <Compass size={22} />
            </div>
            <span>LOSTLINK</span>
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to report items and review matches</p>
        </div>

        {/* Demo Mode Seeder Box */}
        <div className="demo-seeder-box">
          <div className="demo-header">
            <Sparkles size={16} className="sparkle-icon" />
            <h4>HACKATHON DEMO MODE</h4>
          </div>
          <p>Click below to seed matching lost/found items and auto-fill credentials.</p>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm seed-btn" 
            onClick={handleSeedData}
            disabled={loading}
          >
            <Database size={14} /> Seed Demo Data
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder="student@college.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
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
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create an account</Link></p>
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
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-app);
          background-image: radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.04) 0, transparent 50%),
                            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.04) 0, transparent 50%);
          padding: 80px 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          box-shadow: var(--shadow-xl);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .auth-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .auth-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .demo-seeder-box {
          background-color: var(--bg-muted);
          border: 1px dashed var(--secondary);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--secondary);
        }

        .demo-header h4 {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .demo-seeder-box p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .seed-btn {
          width: 100%;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-control {
          padding-left: 48px;
        }

        .auth-submit {
          width: 100%;
          margin-top: 10px;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 700;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
