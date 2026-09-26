import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! Main aapka Groq-powered AI Career Coach hoon. Aapke resume aur career growth ko track karne ke liye taiyar hoon. Koi bhi sawal poochiye!' }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, email: 'shubham@example.com' })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply || data.message }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: data.message || 'Server error.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Network error connecting to Groq neural engine. Please check if backend server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', width: '100%', margin: '0 auto 20px auto', backgroundColor: '#111827', padding: '16px 20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#38bdf8' }}>
            ⚡ Groq AI Career Copilot
          </h1>
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>● Neural Engine Connected</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ backgroundColor: '#1f2937', color: '#e5e7eb', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Chat Container */}
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '70vh', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                fontSize: '15px', 
                lineHeight: '1.5',
                backgroundColor: msg.sender === 'user' ? '#2563eb' : '#1f2937',
                color: '#ffffff',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.sender === 'ai' ? '2px' : '12px'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ backgroundColor: '#1f2937', color: '#38bdf8', padding: '10px 14px', borderRadius: '12px', fontStyle: 'italic', fontSize: '14px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                ⚡ Groq AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} style={{ padding: '16px', backgroundColor: '#030712', borderTop: '1px solid #1f2937', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Groq AI coach anything about your tech career..."
            style={{ flex: 1, backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '10px', padding: '12px 16px', color: '#ffffff', outline: 'none', fontSize: '15px' }}
          />
          <button 
            type="submit" 
            style={{ backgroundColor: '#38bdf8', color: '#030712', border: 'none', padding: '0 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}