import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/InterviewSession';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import About from './pages/About';
import AIChat from './pages/AIChat'; // AIChat component imported

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Neon Glowing Orbs */}
      <div style={{ position: 'absolute', top: '-100px', left: '15%', width: '450px', height: '450px', background: 'rgba(56, 189, 248, 0.12)', filter: 'blur(110px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '35%', right: '10%', width: '450px', height: '450px', background: 'rgba(168, 85, 247, 0.1)', filter: 'blur(130px)', borderRadius: '50%', zIndex: 0 }}></div>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '26px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.5px' }}>
          ⚡ AI Interview Hub
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#94a3b8', padding: '10px 20px', textDecoration: 'none', fontWeight: '600', transition: '0.3s' }}>Sign In</Link>
          <Link to="/signup" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff', padding: '11px 26px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 4px 25px rgba(37,99,235,0.4)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '950px', margin: '80px auto 60px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)', marginBottom: '24px' }}>
          <span style={{ fontSize: '14px' }}>🚀</span>
          <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Next-Gen AI Interview Intelligence V2.0</span>
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: '900', marginTop: '10px', lineHeight: '1.15', letterSpacing: '-1.5px' }}>
          Conquer Every Interview With <br />
          <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Neural AI Precision
          </span>
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '19px', marginTop: '24px', lineHeight: '1.7', maxWidth: '750px', margin: '24px auto 0 auto' }}>
          Experience hyper-realistic role-specific simulations, instantaneous deep-dive evaluations, and real-time insights designed to land your dream offer.
        </p>

        <div style={{ marginTop: '45px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#fff', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', boxShadow: '0 10px 30px rgba(37,99,235,0.5)' }}>
            Launch Free Mock Test →
          </Link>
          <Link to="/dashboard" style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#f1f5f9', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            Explore Dashboard
          </Link>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{ maxWidth: '1150px', margin: '80px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)', padding: '36px', borderRadius: '24px', border: '1px solid rgba(56, 189, 248, 0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '22px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>🎯</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#f8fafc' }}>Neural Speech Analytics</h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Analyze your tone, pacing, hesitation, and clarity metrics in real-time to polish your executive communication delivery.</p>
        </div>
        
        <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)', padding: '36px', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '22px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>⚡</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#f8fafc' }}>Adaptive Question Bank</h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Dynamic difficulty scaling based on your live responses across System Design, DSA, Full-Stack, and AI engineering tracks.</p>
        </div>

        <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)', padding: '36px', borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '22px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>📈</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#f8fafc' }}>Deep Diagnostic Report</h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>Receive granular score breakdowns with exact code snippets, alternative solutions, and tailored roadmap improvements.</p>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: '14px', marginTop: '80px', position: 'relative', zIndex: 10 }}>
        <p>© 2026 AI Interview Hub. Engineered for Future Leaders.</p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview" element={<InterviewSession />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-chat" element={<AIChat />} />
      </Routes>
    </Router>
  );
}

export default App;