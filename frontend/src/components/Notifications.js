import React from 'react';
import { FiX, FiUser, FiCalendar, FiDollarSign, FiCheck } from 'react-icons/fi';

function Notifications({ notifications, onClose, onClear, onNotificationClick }) {
  return (
    <div style={{
      position: 'absolute', top: '60px', right: '20px',
      width: '350px', background: 'white', borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f0f4f8' }}>
        <h3 style={{ fontSize: '16px', color: '#0d2b1f' }}>🔔 Notifications</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {notifications.length > 0 && (
            <span
              onClick={onClear}
              style={{ fontSize: '12px', color: '#00c97a', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear All
            </span>
          )}
          <FiX size={18} color="#888" style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            <p style={{ fontSize: '32px', marginBottom: '10px' }}>🔕</p>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <div
              key={i}
              onClick={() => onNotificationClick(n, i)}
              style={{
                display: 'flex', gap: '12px', padding: '15px 20px',
                borderBottom: '1px solid #f0f4f8',
                background: n.read ? 'white' : '#f0fdf6',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? 'white' : '#f0fdf6'}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: n.type === 'patient' ? '#e8f5e9' : n.type === 'appointment' ? '#e3f2fd' : '#fff8e1'
              }}>
                {n.type === 'patient' && <FiUser size={18} color="#00c97a" />}
                {n.type === 'appointment' && <FiCalendar size={18} color="#1a73e8" />}
                {n.type === 'billing' && <FiDollarSign size={18} color="#f59e0b" />}
                {n.type === 'success' && <FiCheck size={18} color="#00c97a" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d2b1f' }}>{n.title}</p>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{n.message}</p>
                <p style={{ fontSize: '11px', color: '#bbb', marginTop: '5px' }}>{n.time}</p>
              </div>
              {!n.read && (
                <div style={{ width: '8px', height: '8px', background: '#00c97a', borderRadius: '50%', marginTop: '5px', flexShrink: 0 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;