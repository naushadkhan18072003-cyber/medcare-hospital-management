import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields!');
      return;
    }
    setLoading(true);
    const res = await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } else {
      setError(data.message);
    }
  };

  if (!showLogin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d2b1f 0%, #1a4a32 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏥</div>
          <h1 style={{ color: '#00c97a', fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>MedCare</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '40px' }}>Hospital Management System</p>

          <div style={{ marginBottom: '50px' }}>
            {['Patient Management', 'Doctor Scheduling', 'Billing & Payments', 'AI Diagnosis Assistant'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'center' }}>
                <span style={{ color: '#00c97a', fontSize: '18px' }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowLogin(true)}
            style={{
              background: '#00c97a',
              color: '#0d2b1f',
              border: 'none',
              padding: '16px 60px',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              boxShadow: '0 4px 20px rgba(0,201,122,0.4)'
            }}
          >
            Get Started →
          </button>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '20px' }}>
            Hospital Management System v1.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d2b1f 0%, #1a4a32 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '35px 25px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏥</div>
          <h2 style={{ color: '#0d2b1f', fontSize: '24px', marginBottom: '5px' }}>Welcome Back!</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#fff0f0', color: '#e53935', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '13px 15px', border: '1.5px solid #e0e0e0',
              borderRadius: '10px', fontSize: '15px', outline: 'none',
              boxSizing: 'border-box', margin: 0
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '13px 15px', border: '1.5px solid #e0e0e0',
              borderRadius: '10px', fontSize: '15px', outline: 'none',
              boxSizing: 'border-box', margin: 0
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', background: '#00c97a',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,201,122,0.3)'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p
          onClick={() => setShowLogin(false)}
          style={{ textAlign: 'center', marginTop: '15px', color: '#00c97a', fontSize: '14px', cursor: 'pointer' }}
        >
          ← Back
        </p>
      </div>
    </div>
  );
}

export default Login;