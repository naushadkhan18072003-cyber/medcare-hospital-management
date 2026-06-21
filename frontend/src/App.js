import React, { useState, useEffect } from 'react';
import './App.css';
import { FiGrid, FiUsers, FiCalendar, FiDollarSign, FiActivity, FiSettings, FiLogOut, FiSearch, FiPlus, FiBell } from 'react-icons/fi';
import { FaUserMd, FaRobot } from 'react-icons/fa';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Billing from './components/Billing';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import ProfileMenu from './components/ProfileMenu';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    setNotifications([
      { type: 'patient', title: 'New Patient Registered', message: 'Naushad Khan has been registered', time: '2 mins ago', read: false, page: 'patients' },
      { type: 'appointment', title: 'Appointment Booked', message: 'Appointment with Dr. Rahul Sharma', time: '15 mins ago', read: false, page: 'appointments' },
      { type: 'billing', title: 'Payment Received', message: 'Bill of ₹500 has been paid', time: '1 hour ago', read: true, page: 'billing' },
    ]);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleImageChange = (imageData) => {
    setProfileImage(imageData);
    localStorage.setItem('profileImage', imageData);
  };

  const addNotification = (type, title, message, page) => {
    const newNotif = {
      type, title, message, page,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleNotificationClick = (notif, index) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, read: true } : n));
    if (notif.page) {
      setActivePage(notif.page);
      setShowNotifications(false);
    }
  };

  const clearNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return <Login onLogin={handleLogin} />;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { id: 'patients', label: 'Patients', icon: <FiUsers size={18} /> },
    { id: 'appointments', label: 'Appointment', icon: <FiCalendar size={18} /> },
    { id: 'doctors', label: 'Doctors', icon: <FaUserMd size={18} /> },
    { id: 'billing', label: 'Payments', icon: <FiDollarSign size={18} /> },
    { id: 'ai', label: 'AI Assistant', icon: <FaRobot size={18} /> },
  ];

  const otherMenu = [
    { id: 'analytics', label: 'Statistic', icon: <FiActivity size={18} /> },
    { id: 'settings', label: 'Setting', icon: <FiSettings size={18} /> },
  ];

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '24px' }}>🏥</span>
          <h2>MedCare</h2>
        </div>

        <p className="sidebar-section-title">Menu</p>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li
              key={item.id}
              className={activePage === item.id ? 'active' : ''}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>

        <p className="sidebar-section-title">Other Menu</p>
        <ul className="sidebar-menu">
          {otherMenu.map(item => (
            <li
              key={item.id}
              className={activePage === item.id ? 'active' : ''}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{user.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div className="search-bar">
            <FiSearch color="#888" size={16} />
            <input
              placeholder="Search here..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="add-patient-btn" onClick={() => setActivePage('patients')}>
              <FiPlus size={16} />
              Add Patient
            </button>

            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
              <FiBell size={22} color="#555" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: '#e53935', color: 'white',
                  borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{unreadCount}</span>
              )}
            </div>
            {showNotifications && (
              <Notifications
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onClear={clearNotifications}
                onNotificationClick={handleNotificationClick}
              />
            )}

            <div style={{ position: 'relative' }}>
              <div
                className="user-avatar"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  width: '36px', height: '36px', fontSize: '14px', cursor: 'pointer',
                  background: profileImage ? `url(${profileImage})` : '#00c97a',
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}
              >
                {!profileImage && user.name.charAt(0).toUpperCase()}
              </div>
              {showProfileMenu && (
                <ProfileMenu
                  user={user}
                  onClose={() => setShowProfileMenu(false)}
                  onLogout={handleLogout}
                  onGoToSettings={() => { setActivePage('settings'); setShowProfileMenu(false); }}
                  profileImage={profileImage}
                  onImageChange={handleImageChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className="page-content">
          {activePage === 'dashboard' && <Dashboard user={user} />}
          {activePage === 'patients' && <Patients search={search} addNotification={addNotification} />}
          {activePage === 'appointments' && <Appointments addNotification={addNotification} />}
          {activePage === 'doctors' && <Doctors search={search} addNotification={addNotification} />}
          {activePage === 'billing' && <Billing addNotification={addNotification} />}
          {activePage === 'ai' && <AIAssistant />}
          {activePage === 'analytics' && <Statistics />}
          {activePage === 'settings' && <Settings user={user} />}
        </div>
      </div>
    </div>
  );
}

export default App;