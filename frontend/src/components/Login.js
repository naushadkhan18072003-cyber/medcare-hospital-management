import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields!');
      return;
    }
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/auth/login', {
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

  return (
    <div className="login-page">
      <div style={{ display: 'flex', width: '900px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
        
        {/* LEFT SIDE */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #0d2b1f, #1a4a32)', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🏥</div>
          <h1 style={{ color: '#00c97a', fontSize: '32px', marginBottom: '10px' }}>MedCare HMS</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.6' }}>
            Advanced Hospital Management System for modern healthcare professionals.
          </p>
          <div style={{ marginTop: '40px' }}>
            {['Patient Management', 'Doctor Scheduling', 'Billing & Payments', 'AI Diagnosis Assistant'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#00c97a', fontSize: '18px' }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1, background: 'white', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: '#0d2b1f', fontSize: '26px', marginBottom: '5px' }}>Welcome Back!</h2>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Sign in to your account</p>

          {error && (
            <div style={{ background: '#fff0f0', color: '#e53935', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleLogin}
            style={{ width: '100%', padding: '13px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '13px' }}>
            Hospital Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;