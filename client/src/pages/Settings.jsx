import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem('ai_user');
  const storedUser = rawUser ? JSON.parse(rawUser) : { name: 'Shubham', email: 'shubham@example.com' };

  // Admin emails list
  const adminEmails = ['admin@gmail.com', 'shubhamravale9@gmail.com'];
  const isAdmin = adminEmails.includes(storedUser.email);

  // States
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(storedUser.language || 'English');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Suggestion & Pack Extension states
  const [suggestion, setSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  
  // Admin Data states
  const [allUsers, setAllUsers] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Kripya current aur new password dono enter karein!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedUser.email, currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        alert(data.message || 'Error updating password');
      }
    } catch (err) {
      console.error(err);
      alert('Server connection error.');
    }
  };

  // Handle Suggestion & Pack Booster (Max 2 times a month)
  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      alert('Kripya apna suggestion likhein!');
      return;
    }

    setSuggestionLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/suggest-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedUser.email, suggestion })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSuggestion('');
        if (data.updatedUser) {
          localStorage.setItem('ai_user', JSON.stringify(data.updatedUser));
        }
      } else {
        alert(data.message || 'Limit exceeded or error occurred.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Fetch Admin Data (Users & Suggestions)
  useEffect(() => {
    if (isAdmin) {
      const fetchAdminData = async () => {
        setLoadingAdminData(true);
        try {
          // Fetch Users
          const userRes = await fetch('http://localhost:5000/api/admin/users');
          const userData = await userRes.json();
          if (userRes.ok) setAllUsers(userData);

          // Fetch Suggestions
          const sugRes = await fetch('http://localhost:5000/api/admin/suggestions');
          const sugData = await sugRes.json();
          if (sugRes.ok) setAllSuggestions(sugData);
        } catch (err) {
          console.error('Error fetching admin data:', err);
        } finally {
          setLoadingAdminData(false);
        }
      };
      fetchAdminData();
    }
  }, [isAdmin]);

  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#030712' : '#f8fafc', color: isDark ? '#fff' : '#0f172a', fontFamily: 'sans-serif', paddingBottom: '60px' }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'}` }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          ⚙️ Account Settings
        </h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* 1. Theme & Language Preferences */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#38bdf8' }}>1. Preferences & Appearance</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span>Theme Mode ({theme.toUpperCase()})</span>
            <button onClick={toggleTheme} style={{ background: '#38bdf8', color: '#030712', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
              Switch to {isDark ? 'Light ☀️' : 'Dark 🌙'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Preferred Language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '8px 14px', borderRadius: '8px', background: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#fff' : '#000', border: '1px solid #38bdf8' }}>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="gujrati">Gujarati (ગુજરાતી)</option>
              <option value="khandeshi">Khandeshi (खंदेशी)</option>
              <option value="rajsrtani">Rajasthani (राजस्थानी)</option>
              <option value="tamil">Tamil (தமிழ்)</option>
              <option value="kannadi">Kannada (ಕನ್ನಡ)</option>
              <option value="malayalam">Malayalam (മലയാളം)</option>
            </select>
          </div>
        </div>

        {/* 2. Account Status & Subscription (Sirf Normal User ko dikhega) */}
        {!isAdmin && (
          <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(192, 132, 252, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#c084fc' }}>2. Account Status & Subscription</h3>
            <p style={{ margin: '8px 0' }}>Email: <b>{storedUser.email}</b></p>
            <p style={{ margin: '8px 0' }}>Tier: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{storedUser.isPro ? 'Pro Member' : 'Free Tier'}</span></p>
            <p style={{ margin: '8px 0' }}>Pack Days Remaining: {storedUser.daysRemaining || 0} Days</p>
          </div>
        )}

        {/* 3. Password Change (Sabhi ke liye rahega) */}
        <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#38bdf8' }}>3. Security & Password Change</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Current Password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              style={{ padding: '12px', borderRadius: '8px', background: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#fff' : '#000', border: '1px solid #334155', outline: 'none' }}
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              style={{ padding: '12px', borderRadius: '8px', background: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#fff' : '#000', border: '1px solid #334155', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Update Password
            </button>
          </form>
        </div>

        {/* 4. App Suggestion & Pack Booster (Sirf Normal User ko dikhega, Admin ko nahi) */}
        {!isAdmin && (
          <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: `1px solid ${isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.1)'}`, padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#34d399' }}>4. App Suggestion & Pack Booster 🚀</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '15px' }}>Give valuable app suggestions and extend your pack! (Can be used max 2 times a month. 1st time: +3 Days, 2nd time: +6 Days extension).</p>
            <form onSubmit={handleSuggestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <textarea 
                rows="3" 
                placeholder="Write your app feedback or feature suggestion here..." 
                value={suggestion} 
                onChange={(e) => setSuggestion(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', background: isDark ? '#020617' : '#f1f5f9', color: isDark ? '#fff' : '#000', border: '1px solid #334155', outline: 'none', resize: 'vertical' }}
              />
              <button type="submit" disabled={suggestionLoading} style={{ padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                {suggestionLoading ? 'Submitting...' : 'Submit Suggestion & Boost Pack'}
              </button>
            </form>
          </div>
        )}

        {/* 5. Admin Panel (Sirf Admin ke liye registered users aur suggestions ki list) */}
        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Registered Users Table */}
            <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '30px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#f59e0b' }}>🛡️ Admin Panel: Registered Users & Credentials</h3>
              {loadingAdminData ? (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Loading users data...</p>
              ) : allUsers.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Koi user nahi mila.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Password</th>
                        <th style={{ padding: '10px' }}>Tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px' }}>{u.name || 'User'}</td>
                          <td style={{ padding: '10px', color: '#38bdf8' }}>{u.email}</td>
                          <td style={{ padding: '10px', color: '#f87171' }}>{u.password}</td>
                          <td style={{ padding: '10px' }}>{u.isPro ? 'Pro' : 'Free'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* User Suggestions Admin View Table */}
            <div style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#fff', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '30px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#38bdf8' }}>💡 User App Suggestions (Live Feed)</h3>
              {allSuggestions.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Abhi tak kisi user ne suggestion nahi diya hai.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '10px' }}>User Email</th>
                        <th style={{ padding: '10px' }}>Suggestion Text</th>
                        <th style={{ padding: '10px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSuggestions.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px', color: '#38bdf8' }}>{s.email}</td>
                          <td style={{ padding: '10px' }}>{s.text}</td>
                          <td style={{ padding: '10px', color: '#94a3b8' }}>{new Date(s.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}