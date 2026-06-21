import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { FiSend, FiUser } from 'react-icons/fi';

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am MedCare AI Assistant 🏥 I can help you with:\n\n• Patient symptom analysis\n• Doctor specialization suggestions\n• Medical advice & health tips\n\nPlease describe the patient\'s symptoms!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again! 🙏'
      }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AI Medical Assistant</h1>
        <p>Powered by Claude AI — Symptom analysis & medical guidance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>

        {/* CHAT */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: '36px', height: '36px', background: '#0d2b1f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaRobot color="#00c97a" size={18} />
                  </div>
                )}
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? '#00c97a' : '#f8fafc',
                  color: msg.role === 'user' ? 'white' : '#333',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: '36px', height: '36px', background: '#00c97a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiUser color="white" size={18} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: '#0d2b1f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaRobot color="#00c97a" size={18} />
                </div>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '18px 18px 18px 4px', fontSize: '14px', color: '#888' }}>
                  Analyzing... 🔍
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #f0f4f8', paddingTop: '15px', display: 'flex', gap: '10px' }}>
            <input
              placeholder="Describe patient symptoms..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #e0e0e0', borderRadius: '25px', outline: 'none', fontSize: '14px', margin: 0 }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ width: '46px', height: '46px', background: '#00c97a', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <FiSend color="white" size={18} />
            </button>
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h2 style={{ fontSize: '15px', marginBottom: '15px', color: '#0d2b1f' }}>Quick Symptoms</h2>
            {[
              'Patient has fever and headache',
              'Chest pain and shortness of breath',
              'Severe stomach pain',
              'Skin rash and itching',
              'Joint pain and swelling',
              'Anxiety and depression symptoms'
            ].map((s, i) => (
              <div
                key={i}
                onClick={() => setInput(s)}
                style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', fontSize: '13px', color: '#555', cursor: 'pointer', border: '1px solid #e0e0e0' }}
              >
                💬 {s}
              </div>
            ))}
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #0d2b1f, #1a4a32)', color: 'white' }}>
            <h2 style={{ fontSize: '15px', marginBottom: '10px', color: '#00c97a' }}>⚠️ Disclaimer</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              This AI assistant is for informational purposes only. Always consult a qualified medical professional for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;