import React, { useRef } from 'react';
import { FiSettings, FiLogOut, FiUser, FiCamera } from 'react-icons/fi';

function ProfileMenu({ user, onClose, onLogout, onGoToSettings, profileImage, onImageChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: '60px', right: '20px',
      width: '320px', background: 'white', borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)', zIndex: 1000,
      overflow: 'hidden', textAlign: 'center'
    }}>
      {/* TOP GREEN HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0d2b1f, #1a4a32)', padding: '25px 20px 50px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>MedCare Hospital Management</p>
      </div>

      {/* PROFILE PICTURE - overlapping */}
      <div style={{ marginTop: '-40px', position: 'relative', display: 'inline-block' }}>
        <div
          onClick={handleImageClick}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: profileImage ? `url(${profileImage})` : '#00c97a',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 700, color: '#0d2b1f',
            border: '4px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            cursor: 'pointer', margin: '0 auto'
          }}
        >
          {!profileImage && user.name.charAt(0).toUpperCase()}
        </div>
        <div
          onClick={handleImageClick}
          style={{
            position: 'absolute', bottom: '0', right: '0',
            width: '26px', height: '26px', borderRadius: '50%',
            background: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: '2px solid white'
          }}
        >
          <FiCamera size={12} color="white" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* USER INFO */}
      <div style={{ padding: '10px 20px 20px' }}>
        <h3 style={{ fontSize: '18px', color: '#0d2b1f', marginBottom: '4px' }}>Hi, {user.name}! 👋</h3>
        <p style={{ fontSize: '13px', color: '#888' }}>{user.email || `${user.name.toLowerCase().replace(' ', '.')}@hospital.com`}</p>
        <span style={{
          display: 'inline-block', marginTop: '8px', padding: '4px 14px',
          background: '#e8f5e9', color: '#00c97a', borderRadius: '20px',
          fontSize: '12px', fontWeight: 600, textTransform: 'capitalize'
        }}>
          {user.role}
        </span>
      </div>

      {/* MENU OPTIONS */}
      <div style={{ borderTop: '1px solid #f0f4f8', padding: '10px' }}>
        <div
          onClick={onGoToSettings}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 15px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '14px', color: '#444', textAlign: 'left'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiUser size={18} color="#666" />
          Manage your Account
        </div>
        <div
          onClick={onGoToSettings}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 15px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '14px', color: '#444', textAlign: 'left'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiSettings size={18} color="#666" />
          Settings
        </div>
        <div
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 15px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '14px', color: '#e53935', textAlign: 'left'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FiLogOut size={18} color="#e53935" />
          Sign out
        </div>
      </div>
    </div>
  );
}

export default ProfileMenu;