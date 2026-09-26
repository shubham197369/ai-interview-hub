import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  
  const plans = [
    { id: 1, duration: '1 Month', price: 89, label: '⚡ Starter Pro', badge: 'Basic' },
    { id: 2, duration: '3 Months', price: 219, label: '🚀 Most Popular', badge: 'Save 20%' },
    { id: 3, duration: '6 Months', price: 399, label: '🔥 Half Yearly', badge: 'Save 30%' },
    { id: 4, duration: '1 Year', price: 599, label: '👑 Elite Annual', badge: 'Best Value' }
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [utrNumber, setUtrNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const MY_UPI_ID = "9974058027@ibl"; 
  const MY_QR_IMAGE_PATH = "/my-qr-code.png"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 8) {
      alert('Kripya valid 12-digit UTR / Transaction ID enter karein!');
      return;
    }

    // LocalStorage se logged-in user ka email nikalna (Dynamic)
    const storedUser = JSON.parse(localStorage.getItem('ai_user'));
    const userEmail = storedUser?.email || storedUser?.username || "shubham@example.com";

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail, // Ab yahan dynamic email jayega
          plan: selectedPlan.duration,
          amount: selectedPlan.price,
          utrNumber: utrNumber
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Kuch error aa gaya!');
      }
    } catch (err) {
      console.error(err);
      alert('Server connection error! Check karein ki backend server chal raha hai ya nahi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '50px 20px', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background Glow Elements */}
      <div style={{ position: 'absolute', top: '5%', left: '20%', width: '400px', height: '400px', background: 'rgba(168, 85, 247, 0.12)', filter: 'blur(140px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.1)', filter: 'blur(140px)', borderRadius: '50%', zIndex: 0 }}></div>

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '5px 14px', borderRadius: '20px', color: '#c084fc', fontSize: '11px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Secure Verification Gateway
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '900', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 60%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>
            Unlock Pro Elite Intelligence
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Select your access tier, scan the QR code via any UPI app, and submit your transaction reference.
          </p>
        </div>

        {!submitted ? (
          <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '32px', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            
            {/* Plans Grid */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  1. Select Subscription Plan
                </label>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>Active: {selectedPlan.duration}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '12px' }}>
                {plans.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      style={{ 
                        background: isSelected ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)' : '#030712',
                        border: isSelected ? '2px solid #c084fc' : '1px solid rgba(255,255,255,0.08)',
                        padding: '16px 12px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease',
                        position: 'relative', overflow: 'hidden', boxShadow: isSelected ? '0 0 20px rgba(168, 85, 247, 0.25)' : 'none'
                      }}>
                      <div style={{ position: 'absolute', top: '6px', right: '6px', background: isSelected ? '#a855f7' : 'rgba(255,255,255,0.06)', color: isSelected ? '#fff' : '#94a3b8', fontSize: '8px', fontWeight: '800', padding: '2px 5px', borderRadius: '4px' }}>
                        {plan.badge}
                      </div>
                      <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: '700', marginBottom: '4px' }}>{plan.label}</div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>₹{plan.price}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{plan.duration}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR Code Section */}
            <div style={{ background: '#020617', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '22px', borderRadius: '20px', textAlign: 'center', marginBottom: '25px', boxShadow: 'inset 0 0 15px rgba(56,189,248,0.04)' }}>
              <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>
                2. Scan & Pay <span style={{ color: '#fff', fontSize: '18px', fontWeight: '900', background: 'rgba(56,189,248,0.15)', padding: '2px 8px', borderRadius: '6px' }}>₹{selectedPlan.price}</span> via GPay / PhonePe / Paytm
              </p>
              
              <div style={{ background: '#fff', padding: '8px', borderRadius: '14px', width: '150px', height: '150px', margin: '0 auto 14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                <img 
                  src={MY_QR_IMAGE_PATH} 
                  alt="QR Code" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '8px 14px', borderRadius: '10px', display: 'inline-block' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>UPI ID: </span>
                <strong style={{ color: '#38bdf8', fontSize: '13px', letterSpacing: '0.5px' }}>{MY_UPI_ID}</strong>
              </div>
            </div>

            {/* UTR Form */}
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', color: '#f8fafc', fontSize: '13px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                3. Enter 12-Digit UTR / Transaction Reference ID
              </label>
              <input 
                type="text"
                placeholder="e.g. 4235xxxxxxxx"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', background: '#020617', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '12px', color: '#fff', fontSize: '15px', marginBottom: '18px', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.5px' }}
              />

              <button 
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 25px rgba(147,51,234,0.4)', transition: '0.2s', marginBottom: '12px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting Request...' : '🚀 Submit Payment Request for Approval'}
              </button>
            </form>

            <button 
              onClick={() => navigate('/dashboard')}
              style={{ width: '100%', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              ← Return to Dashboard
            </button>

          </div>
        ) : (
          <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>Request Submitted to Admin!</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '22px', maxWidth: '420px', margin: '0 auto 22px auto', lineHeight: '1.5' }}>
              Tera UTR database me save ho gaya hai. Admin verification ke baad tera account Pro ho jayega.
            </p>
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
              Go to Dashboard 🏠
            </button>
          </div>
        )}

      </div>
    </div>
  );
}