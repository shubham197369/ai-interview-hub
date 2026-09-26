import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  const theme = localStorage.getItem('theme') || 'dark';
  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#f8fafc', color: isDark ? '#fff' : '#0f172a', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'}` }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          🚀 About AI Interview Hub
        </h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          ← Back to Dashboard
        </button>
      </nav>

      {/* Main Container */}
      <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Hero Section */}
        <div style={{ background: isDark ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' : '#fff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.1)'}`, padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Next-Gen Platform</span>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '20px 0 10px 0', background: 'linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Interview Hub
          </h1>
          <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
            An advanced AI-powered platform designed to make your interview preparation smart, fast, and effective. Ensure your success with mock interviews, real-time feedback, and career booster features.
          </p>
        </div>

        {/* App Features Grid */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(192, 132, 252, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#c084fc' }}>💡 Core Features & Capabilities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: isDark ? '#020617' : '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0', fontSize: '16px' }}>🤖 AI Mock Interviews</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Polish your interview skills with real-time questions and tailored feedback.</p>
            </div>
            <div style={{ background: isDark ? '#020617' : '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#34d399', margin: '0 0 8px 0', fontSize: '16px' }}>🚀 Pack Booster & Suggestions</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Easily extend your access days by suggesting valuable app improvements.</p>
            </div>
            <div style={{ background: isDark ? '#020617' : '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0', fontSize: '16px' }}>🛡️ Secure & Custom Admin</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>Seamless authentication, dynamic theme toggling, and robust admin management.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '15px', color: '#38bdf8' }}>🛠️ Technologies Used</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
            This application is built using modern full-stack web technologies to deliver a lightning-fast user experience:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'CSS3 / Inline Styling'].map((tech, idx) => (
              <span key={idx} style={{ background: isDark ? '#1e293b' : '#e2e8f0', color: isDark ? '#38bdf8' : '#0f172a', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(56,189,248,0.2)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Creator Info */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '45px', background: 'rgba(52, 211, 153, 0.1)', padding: '15px', borderRadius: '20px' }}>👨‍💻</div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 5px 0', color: '#34d399' }}>Created By Shubham G Ravale</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
              Full-stack web developer and MCA student passionate about building modern web applications and AI-driven tools.
            </p>
          </div>
        </div>

        {/* Contact & Support */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#f59e0b' }}>📞 Contact, Help & Support</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>
            If you have any queries, issues, or feedback, you can reach out to us directly via email:
          </p>
          <a href="mailto:shubhamravale9@gmail.com" style={{ display: 'inline-block', background: '#f59e0b', color: '#030712', padding: '12px 24px', borderRadius: '10px', fontWeight: '800', textDecoration: 'none', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
            ✉️ shubhamravale9@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}