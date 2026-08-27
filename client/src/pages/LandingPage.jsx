import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Shield, Search, ArrowRight, CheckCircle2, Share2, Award, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text-block">
            <div className="badge badge-primary hero-badge slide-up">
              <Sparkles size={14} className="sparkle-icon" /> AI-Powered Campus Recovery
            </div>
            <h1 className="hero-title slide-up">
              Lost Something?<br />
              Let <span className="gradient-text">LostLink</span> Find It.
            </h1>
            <p className="hero-subtext slide-up">
              An intelligent campus lost & found platform that automatically matches lost belongings with the people who found them using smart text similarity algorithms.
            </p>
            <div className="hero-ctas slide-up">
              <Link to={user ? "/report-lost" : "/register"} className="btn btn-primary btn-lg">
                Report Lost Item <ArrowRight size={18} />
              </Link>
              <Link to="/browse" className="btn btn-outline btn-lg">
                Browse Items
              </Link>
            </div>
          </div>

          <div className="hero-visual-block">
            <div className="visual-wrapper">
              <div className="flow-step lost-node float-anim">
                <span className="node-title">Lost Item</span>
                <span className="node-val">HP Laptop Charger</span>
              </div>
              <div className="connector-line"></div>
              
              <div className="ai-match-node glow-anim">
                <Sparkles size={24} className="glow-icon" />
                <span className="ai-percent">94%</span>
                <span className="ai-label">AI Match</span>
              </div>
              
              <div className="connector-line"></div>
              
              <div className="flow-step found-node float-anim-delayed">
                <span className="node-title">Found Item</span>
                <span className="node-val">HP 65W Adapter</span>
              </div>

              {/* Float decor cards */}
              <div className="floating-decor-card badge-card glass">
                <CheckCircle2 size={16} className="text-success" />
                <span>Verified Owner</span>
              </div>

              <div className="floating-decor-card live-match-card glass">
                <div className="live-match-header">
                  <span className="live-dot"></span>
                  <span className="live-label">LIVE MATCH EXAMPLE</span>
                </div>
                <h4 className="match-title">Black HP Charger</h4>
                <div className="match-bar">
                  <span className="match-score">94% AI Match</span>
                  <div className="match-progress-bar"><div className="fill" style={{ width: '94%' }}></div></div>
                </div>
                <p className="match-desc">Potential match found near Central Library</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved Divider */}
        <div className="hero-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.43,26.85,183.78,52.77,262.24,63.92,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works container">
        <div className="section-header">
          <span className="section-tag">EASY RECOVERY</span>
          <h2>How LostLink Works</h2>
          <p>Get your items back in five simple steps</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3>Report</h3>
            <p>Publish details of lost or found items with a verification question.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h3>Discover</h3>
            <p>Browse through items reported across all campus colleges and facilities.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <h3>Match</h3>
            <p>Our Smart Match Engine calculates overlapping details and suggests matches.</p>
          </div>
          <div className="step-card">
            <div className="step-num">04</div>
            <h3>Verify</h3>
            <p>Answer the owner's verification question to confirm ownership securely.</p>
          </div>
          <div className="step-card">
            <div className="step-num">05</div>
            <h3>Recover</h3>
            <p>Arrange a safe handover on campus and mark the item as returned.</p>
          </div>
        </div>
      </section>

      {/* Smart Match Showcase */}
      <section className="smart-matching-section">
        <div className="container match-showcase-grid">
          <div className="match-showcase-visual">
            <div className="showcase-card lost-showcase glass">
              <span className="badge badge-lost">LOST ITEM</span>
              <h3>Black HP Laptop Charger</h3>
              <p className="item-meta">📍 Central Library | 📅 Aug 25</p>
              <div className="criteria-row">
                <span className="crit-label">Color:</span> <span className="crit-val">Black</span>
              </div>
              <div className="criteria-row">
                <span className="crit-label">Brand:</span> <span className="crit-val">HP</span>
              </div>
            </div>

            <div className="showcase-engine glow-purple">
              <div className="engine-circle">
                <Sparkles size={20} className="text-light" />
                <span className="engine-text">94% Match</span>
              </div>
              <div className="engine-breakdown">
                <div className="breakdown-item"><span>Category</span><div className="mini-progress"><div className="fill" style={{ width: '100%' }}></div></div><span>100%</span></div>
                <div className="breakdown-item"><span>Location</span><div className="mini-progress"><div className="fill" style={{ width: '100%' }}></div></div><span>100%</span></div>
                <div className="breakdown-item"><span>Brand</span><div className="mini-progress"><div className="fill" style={{ width: '80%' }}></div></div><span>80%</span></div>
                <div className="breakdown-item"><span>Description</span><div className="mini-progress"><div className="fill" style={{ width: '92%' }}></div></div><span>92%</span></div>
              </div>
            </div>

            <div className="showcase-card found-showcase glass">
              <span className="badge badge-found">FOUND ITEM</span>
              <h3>Black HP 65W Charger</h3>
              <p className="item-meta">📍 Central Library | 📅 Aug 25</p>
              <div className="criteria-row">
                <span className="crit-label">Color:</span> <span className="crit-val">Black</span>
              </div>
              <div className="criteria-row">
                <span className="crit-label">Brand:</span> <span className="crit-val">HP</span>
              </div>
            </div>
          </div>

          <div className="match-showcase-text">
            <span className="section-tag">SMART MATCH ENGINE</span>
            <h2>Intelligent Double-Sided Matching</h2>
            <p className="match-explain-para">
              LostLink analyzes key item parameters (Category, Brand, Color, Location, Description similarity, and Date proximity) to compute a weighted match score. 
            </p>
            <div className="feature-check-list">
              <div className="feature-check-item">
                <CheckCircle2 className="text-success" size={18} />
                <span>Weighted scores reduce noise and manual filtering</span>
              </div>
              <div className="feature-check-item">
                <CheckCircle2 className="text-success" size={18} />
                <span>Text token matching handles minor spelling differences</span>
              </div>
              <div className="feature-check-item">
                <CheckCircle2 className="text-success" size={18} />
                <span>Secure verification questions prevent wrongful claims</span>
              </div>
            </div>
            <Link to="/browse" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Search Lost & Found
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section container">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Items Reported</p>
          </div>
          <div className="stat-item">
            <h3>7,800+</h3>
            <p>Items Recovered</p>
          </div>
          <div className="stat-item">
            <h3>94%</h3>
            <p>Successful Matches</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Campus Locations</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section container">
        <div className="section-header">
          <span className="section-tag">SUCCESS STORIES</span>
          <h2>Campus Feedback</h2>
          <p>What students are saying about LostLink</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card glass">
            <p className="test-quote">
              "I lost my HP laptop charger during midterms. Reported it on LostLink and was matched with a found charger reported just 2 hours later. The verification question was: what tape was on it. Got it back the same day!"
            </p>
            <div className="test-user">
              <div className="test-avatar">C</div>
              <div>
                <h4>Chaitanya Aripirala</h4>
                <span>CS Student</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card glass">
            <p className="test-quote">
              "Found a student ID card and wallet in the auditorium. Posted it on LostLink. The owner answered my security question in 10 minutes and verified his roll number. Super clean handover process!"
            </p>
            <div className="test-user">
              <div className="test-avatar">J</div>
              <div>
                <h4>John Doe</h4>
                <span>ECE Student</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card glass">
            <p className="test-quote">
              "A must-have app for every campus. No more spamming WhatsApp groups or checking multiple notice boards. The AI matches are incredibly accurate and save so much time."
            </p>
            <div className="test-user">
              <div className="test-avatar">S</div>
              <div>
                <h4>Sarah Jenkins</h4>
                <span>Business Administration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          overflow-x: hidden;
        }

        .hero-section {
          background-color: #f1f5f9;
          background-image: radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0, transparent 50%), 
                            radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0, transparent 50%);
          padding: 140px 0 100px;
          position: relative;
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .hero-text-block {
          flex: 1.2;
        }

        .hero-badge {
          margin-bottom: 24px;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 520px;
        }

        .hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-visual-block {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .visual-wrapper {
          position: relative;
          width: 320px;
          height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .flow-step {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px;
          box-shadow: var(--shadow-md);
        }

        .node-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .node-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .connector-line {
          width: 2px;
          height: 40px;
          background: dashed var(--text-muted);
          background-size: 2px 8px;
        }

        .ai-match-node {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--gradient-match);
          color: var(--text-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
          z-index: 5;
        }

        .ai-percent {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1;
          font-family: var(--font-display);
        }

        .ai-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .floating-decor-card {
          position: absolute;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          padding: 12px 16px;
        }

        .badge-card {
          top: 40px;
          left: -40px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .live-match-card {
          bottom: 30px;
          right: -80px;
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .live-match-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background-color: var(--danger);
          border-radius: 50%;
          animation: pulse-glow 2s infinite;
        }

        .live-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .match-title {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .match-bar {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .match-score {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
        }

        .match-progress-bar {
          width: 100%;
          height: 6px;
          background-color: var(--bg-muted);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .match-progress-bar .fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
        }

        .match-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }

        .hero-wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 50px;
        }

        .hero-wave .shape-fill {
          fill: var(--bg-app);
        }

        /* How it works */
        .how-it-works {
          padding: 80px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-tag {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .step-card {
          text-align: center;
          padding: 16px;
        }

        .step-num {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary-light);
          line-height: 1;
          margin-bottom: 12px;
        }

        .step-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Match Showcase */
        .smart-matching-section {
          background-color: var(--bg-card);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 80px 0;
        }

        .match-showcase-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .match-showcase-visual {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .showcase-card {
          width: 220px;
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .showcase-card h3 {
          font-size: 1.05rem;
          margin-top: 12px;
          margin-bottom: 6px;
        }

        .item-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .criteria-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }

        .crit-label { color: var(--text-muted); }
        .crit-val { font-weight: 700; }

        .showcase-engine {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 140px;
        }

        .engine-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--gradient-match);
          box-shadow: var(--shadow-glow);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
        }

        .engine-text {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .engine-breakdown {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .mini-progress {
          flex: 1;
          height: 4px;
          background-color: var(--bg-muted);
          margin: 0 6px;
          border-radius: 2px;
          overflow: hidden;
        }

        .mini-progress .fill {
          height: 100%;
          background-color: var(--primary);
        }

        .match-explain-para {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .feature-check-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature-check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 600;
        }

        /* Stats Section */
        .stats-section {
          padding: 60px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          text-align: center;
        }

        .stat-item h3 {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-item p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Testimonials */
        .testimonials-section {
          padding: 80px 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 32px;
        }

        .testimonial-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: var(--bg-card);
        }

        .test-quote {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-style: italic;
          margin-bottom: 24px;
        }

        .test-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .test-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .test-user h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .test-user span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Animations */
        .float-anim {
          animation: float 5s infinite ease-in-out;
        }

        .float-anim-delayed {
          animation: float 5s infinite ease-in-out;
          animation-delay: 2.5s;
        }

        .glow-anim {
          animation: pulse-glow 3s infinite ease-in-out;
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .hero-title { font-size: 2.8rem; }
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }
          .hero-subtext {
            margin: 0 auto 32px;
          }
          .hero-ctas {
            justify-content: center;
          }
          .match-showcase-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 2.2rem; }
          .steps-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr; }
          .hero-visual-block { display: none; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
