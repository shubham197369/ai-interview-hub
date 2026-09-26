import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill all fields!');
      return;
    }
    
    // User data save kar rahe hain taaki dashboard pe naam dikhe
    const userName = email.split('@')[0]; // Email ke pehle part ko naam maan lete hain
    localStorage.setItem('ai_user', JSON.stringify({ name: userName.charAt(0).toUpperCase() + userName.slice(1), email }));

    alert('Login Successful!');
    navigate('/dashboard'); // <-- Yahan '/' ki jagah '/dashboard' kar diya hai
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '24px', textAlign: 'center' }}>Sign In to AI Hub</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', outline: 'none' }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', outline: 'none' }}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#38bdf8', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}