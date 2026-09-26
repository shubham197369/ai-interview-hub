import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('ai_user');
    return storedUser ? JSON.parse(storedUser) : { name: 'Shubham', email: 'shubham@example.com' };
  });

  // Theme State & Listener for live syncing with Settings
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };
    window.addEventListener('themeChanged', updateTheme);
    return () => window.removeEventListener('themeChanged', updateTheme);
  }, []);

  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('domains'); // 'domains' or 'admin'
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const navigate = useNavigate();

  // Define authorized admins
  const adminEmails = ['admin@gmail.com', 'shubhamravale9@gmail.com'];
  const isAdmin = adminEmails.includes(user.email);

  const handleLogout = () => {
    localStorage.removeItem('ai_user');
    navigate('/login');
  };

  // Handle Resume Upload directly from Dashboard Card
  const handleDashboardResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('email', user.email);

    try {
      const response = await fetch('http://localhost:5000/api/user/upload-resume', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert('Resume uploaded successfully!');
      } else {
        alert(data.message || 'Error uploading resume');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Server error while uploading resume.');
    }
  };

  // Fetch pending payments directly inside useEffect
  useEffect(() => {
    if (activeTab === 'admin' && isAdmin) {
      const fetchAdminPayments = async () => {
        setLoadingPayments(true);
        try {
          const response = await fetch('http://localhost:5000/api/admin/payments');
          const data = await response.json();
          if (response.ok) {
            setPayments(data);
          }
        } catch (err) {
          console.error('Error fetching payments:', err);
        } finally {
          setLoadingPayments(false);
        }
      };
      fetchAdminPayments();
    }
  }, [activeTab, isAdmin]);

  // Handle Payment Approval API Call
  const handleApprovePayment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/payment/approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        alert('Payment approved successfully!');
        setPayments(payments.map(p => p._id === id ? { ...p, status: 'Approved' } : p));
      } else {
        alert(data.message || 'Error approving payment');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Server error while approving payment.');
    }
  };

  // Multiple domains list for all streams
  const domains = [
    { id: 1, title: 'Full-Stack Engineering', icon: '💻', desc: 'React, Node.js, Express, Databases & System Architecture.', category: 'development web software' },
    { id: 2, title: 'Data Structures & Algorithms', icon: '📊', desc: 'Arrays, Trees, Graphs, Dynamic Programming & Complexity.', category: 'dsa coding interview core' },
    { id: 3, title: 'AI & Generative AI Roles', icon: '🤖', desc: 'LLMs, RAG Architecture, LangChain, Embeddings & Vectors.', category: 'ai ml generative python groq' },
    { id: 4, title: 'DevOps & Cloud Engineering', icon: '☁️', desc: 'AWS, Docker, Kubernetes, CI/CD Pipelines & Terraform.', category: 'devops cloud aws infrastructure' },
    { id: 5, title: 'Cyber Security & Ethical Hacking', icon: '🔒', desc: 'Penetration Testing, Network Security, Vulnerability & OWASP.', category: 'security hacking cyber network' },
    { id: 6, title: 'Data Science & Analytics', icon: '📈', desc: 'Python, Pandas, Machine Learning Models, SQL & Statistics.', category: 'data science analytics python sql' },
    { id: 7, title: 'Mobile App Development', icon: '📱', desc: 'Flutter, React Native, Android (Kotlin), iOS (Swift) & APIs.', category: 'mobile app flutter react native' },
    { id: 8, title: 'UI/UX Product Design', icon: '🎨', desc: 'Figma, Wireframing, User Research, Prototyping & Design Systems.', category: 'ui ux design figma product' }
  ];

  const filteredDomains = domains.filter(domain => 
    domain.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const approvedCount = payments.filter(p => p.status === 'Approved').length;

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#f8fafc', color: isDark ? '#fff' : '#0f172a', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background Neon Glowing Orbs */}
      <div style={{ position: 'absolute', top: '-100px', left: '10%', width: '450px', height: '450px', background: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)', filter: 'blur(130px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '30%', right: '5%', width: '450px', height: '450px', background: isDark ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0.03)', filter: 'blur(140px)', borderRadius: '50%', zIndex: 0 }}></div>

      {/* Top Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'}`, position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.5px' }}>
          ⚡ AI Interview Hub
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('domains')}
              style={{ background: activeTab === 'domains' ? '#38bdf8' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), color: activeTab === 'domains' ? '#030712' : (isDark ? '#fff' : '#0f172a'), border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/about')} 
              style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ℹ️ About
            </button>
            <button 
              onClick={() => navigate('/settings')} 
              style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              ⚙️ Settings
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                style={{ background: activeTab === 'admin' ? '#38bdf8' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), color: activeTab === 'admin' ? '#030712' : (isDark ? '#fff' : '#0f172a'), border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Admin Panel {pendingCount > 0 && `(${pendingCount})`}
              </button>
            )}
          </div>
          <span style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '15px' }}>Welcome, <strong style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{user.name}</strong></span>
          <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* Welcome Banner */}
        <div style={{ background: isDark ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '40px', borderRadius: '24px', marginBottom: '35px', backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: '20px', marginBottom: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>{activeTab === 'admin' && isAdmin ? 'Admin Verification Control' : 'Active Neural Workspace (Groq Powered)'}</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1px', color: isDark ? '#fff' : '#0f172a' }}>
            {activeTab === 'admin' && isAdmin ? 'Payment Approval Dashboard 🛡️' : `Hello, ${user.name} 🚀`}
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '16px', maxWidth: '700px', lineHeight: '1.6' }}>
            {activeTab === 'admin' && isAdmin 
              ? 'Review user subscription requests via UTR numbers and approve access instantly.' 
              : 'Choose your engineering domain, upload your resume, or search your specialized tech stack below to start an advanced Groq AI-powered mock interview.'}
          </p>
        </div>

        {activeTab === 'admin' && isAdmin ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}` }}>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>Pending Approvals</p>
                <h3 style={{ fontSize: '32px', color: '#f59e0b', margin: '8px 0 0' }}>{pendingCount}</h3>
              </div>
              <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff', padding: '24px', borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.1)'}` }}>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>Approved Subscriptions</p>
                <h3 style={{ fontSize: '32px', color: '#10b981', margin: '8px 0 0' }}>{approvedCount}</h3>
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#ffffff', borderRadius: '20px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`, padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: isDark ? '#fff' : '#0f172a' }}>Submitted Payment Requests</h3>
              {loadingPayments ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading payment records...</p>
              ) : payments.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No payment requests found.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
                      <th style={{ padding: '14px' }}>Email</th>
                      <th style={{ padding: '14px' }}>Plan</th>
                      <th style={{ padding: '14px' }}>Amount</th>
                      <th style={{ padding: '14px' }}>UTR Number</th>
                      <th style={{ padding: '14px' }}>Status</th>
                      <th style={{ padding: '14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p._id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, fontSize: '14px' }}>
                        <td style={{ padding: '16px', color: isDark ? '#f8fafc' : '#0f172a' }}>{p.email}</td>
                        <td style={{ padding: '16px', color: '#38bdf8' }}>{p.plan}</td>
                        <td style={{ padding: '16px' }}>₹{p.amount}</td>
                        <td style={{ padding: '16px', fontFamily: 'monospace' }}>{p.utrNumber}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            background: p.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: p.status === 'Approved' ? '#10b981' : '#f59e0b',
                            border: `1px solid ${p.status === 'Approved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                          }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          {p.status === 'Pending' ? (
                            <button 
                              onClick={() => handleApprovePayment(p._id)}
                              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                              Approve
                            </button>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '12px' }}>Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: isDark ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' : '#ffffff', padding: '28px', borderRadius: '20px', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.1)'}`, backdropFilter: 'blur(12px)' }}>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Total Mock Tests</p>
                <h3 style={{ fontSize: '34px', fontWeight: '900', color: '#38bdf8', margin: 0 }}>00</h3>
                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>Ready for your first session</span>
              </div>

              <div style={{ background: isDark ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' : '#ffffff', padding: '28px', borderRadius: '20px', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.1)'}`, backdropFilter: 'blur(12px)' }}>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Avg Confidence Score</p>
                <h3 style={{ fontSize: '34px', fontWeight: '900', color: '#10b981', margin: 0 }}>—</h3>
                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>Unlock after 1st mock test</span>
              </div>

              <div style={{ background: isDark ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' : '#ffffff', padding: '28px', borderRadius: '20px', border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0,0,0,0.1)'}`, backdropFilter: 'blur(12px)' }}>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Readiness Status</p>
                <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#a855f7', margin: 0 }}>Beginner</h3>
                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>Calibration pending</span>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ position: 'relative', maxWidth: '100%' }}>
                <span style={{ position: 'absolute', left: '18px', top: '16px', fontSize: '18px' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search domain or tech stack (e.g. Full-Stack, Python, Cloud, Security...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '16px 16px 16px 52px', background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0,0,0,0.15)'}`, borderRadius: '16px', color: isDark ? '#fff' : '#0f172a', fontSize: '16px', outline: 'none', backdropFilter: 'blur(12px)', boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)' }}
                />
              </div>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.5px', color: isDark ? '#fff' : '#0f172a' }}>
              Select Interview Domain & Copilot ({filteredDomains.length + 1} Available)
            </h2>
            
            {/* Grid for Domains + AI Career Copilot Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '60px' }}>
              
              {/* AI Career Copilot & Resume Card */}
              <div style={{ background: isDark ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)' : '#ffffff', padding: '32px', borderRadius: '22px', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '52px', height: '52px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    🤖
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: isDark ? '#f8fafc' : '#0f172a' }}>AI Career Copilot & Resume</h3>
                  <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    Upload your PDF resume to analyze skills, track errors, and chat with your dedicated Groq AI career assistant in a new window.
                  </p>
                  
                  {/* PDF Upload Input inside card */}
                  <label style={{ display: 'block', background: isDark ? '#030712' : '#f1f5f9', border: '1px dashed #38bdf8', padding: '10px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>📄 {uploadedFileName || 'Upload PDF Resume'}</span>
                    <input type="file" accept="application/pdf" onChange={handleDashboardResumeUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                <button 
                  onClick={() => navigate('/ai-chat')} 
                  style={{ width: '100%', background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(56,189,248,0.3)', transition: '0.3s' }}>
                  Open AI Chat Window →
                </button>
              </div>

              {/* Filtered Domain Cards */}
              {filteredDomains.map((domain) => (
                <div key={domain.id} style={{ background: isDark ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)' : '#ffffff', padding: '32px', borderRadius: '22px', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}`, backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '52px', height: '52px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      {domain.icon}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: isDark ? '#f8fafc' : '#0f172a' }}>{domain.title}</h3>
                    <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>{domain.desc}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/interview', { state: { domain: domain.title, isPro: user.isPro || isAdmin } })}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.4)', transition: '0.3s' }}>
                    Start Interview →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <footer style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(3, 7, 18, 0.95)' : '#f1f5f9', padding: '50px 20px 30px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '14px' }}>
              ⚡ AI Interview Hub
            </h3>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Empowering engineers and professionals across all tech domains with Groq-powered simulated evaluations and deep diagnostic analytics.
            </p>
          </div>
          <div>
            <h4 style={{ color: isDark ? '#f8fafc' : '#0f172a', fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Quick Tracks</h4>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', marginBottom: '8px' }}>Full-Stack & Cloud Architecture</p>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', marginBottom: '8px' }}>Data Structures & Algorithms</p>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '14px', marginBottom: '8px' }}>Generative AI & Data Science</p>
          </div>
          
          <div>
            <h4 style={{ color: isDark ? '#f8fafc' : '#0f172a', fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>System Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span>
              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>Groq Neural Core Operational</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Latency: 14ms | V4.3.1 Stable</p>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>© 2026 AI Interview Hub. Engineered for Future Leaders.</p>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Designed with ⚡ Precision</p>
        </div>
      </footer>

    </div>
  );
}