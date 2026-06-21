import React, { useState } from 'react';
import { FiUser, FiLock, FiBell, FiHome, FiSave, FiUsers, FiDatabase, FiPlus, FiTrash2, FiDownload } from 'react-icons/fi';

function Settings({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [hospitalName, setHospitalName] = useState('MedCare Hospital');
  const [hospitalEmail, setHospitalEmail] = useState('info@medcare.com');
  const [hospitalPhone, setHospitalPhone] = useState('+91 9999999999');
  const [hospitalAddress, setHospitalAddress] = useState('Gurugram, Haryana');
  const [hospitalLogo, setHospitalLogo] = useState(localStorage.getItem('hospitalLogo') || null);
  const [notifications, setNotifications] = useState({
    appointments: true,
    patients: true,
    billing: false,
    reports: true
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const [staffList, setStaffList] = useState(JSON.parse(localStorage.getItem('staffList')) || [
    { id: 1, name: 'Naushad Khan', email: 'naushad@hospital.com', role: 'Admin' },
  ]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('Receptionist');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addStaff = () => {
    if (!staffName || !staffEmail) { alert('Please fill all fields!'); return; }
    const newStaff = { id: Date.now(), name: staffName, email: staffEmail, role: staffRole };
    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem('staffList', JSON.stringify(updated));
    setStaffName(''); setStaffEmail(''); setStaffRole('Receptionist');
    setShowStaffForm(false);
  };

  const removeStaff = (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    const updated = staffList.filter(s => s.id !== id);
    setStaffList(updated);
    localStorage.setItem('staffList', JSON.stringify(updated));
  };

  const exportData = () => {
    const data = {
      hospitalName, hospitalEmail, hospitalPhone, hospitalAddress,
      staffList, exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medcare_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const tabs = [
    { id: 'profile', label: 'Hospital Profile', icon: <FiHome size={16} /> },
    { id: 'account', label: 'My Account', icon: <FiUser size={16} /> },
    { id: 'password', label: 'Change Password', icon: <FiLock size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell size={16} /> },
    { id: 'users', label: 'User Management', icon: <FiUsers size={16} /> },
    { id: 'data', label: 'Backup & Export', icon: <FiDatabase size={16} /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your hospital and account settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '15px', height: 'fit-content' }}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 15px', borderRadius: '8px', cursor: 'pointer',
                marginBottom: '5px', fontSize: '14px',
                background: activeTab === tab.id ? '#00c97a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#555',
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </div>
          ))}
        </div>

        <div className="card">

          {activeTab === 'profile' && (
            <div>
              <div className="card-header"><h2>Hospital Profile</h2></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                <div
                  onClick={() => document.getElementById('logoUpload').click()}
                  style={{
                    width: '80px', height: '80px',
                    background: hospitalLogo ? `url(${hospitalLogo})` : 'linear-gradient(135deg, #0d2b1f, #1a4a32)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '36px', cursor: 'pointer', position: 'relative'
                  }}
                >
                  {!hospitalLogo && '🏥'}
                  <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#1a73e8', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                    📷
                  </div>
                </div>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setHospitalLogo(reader.result);
                        localStorage.setItem('hospitalLogo', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0d2b1f' }}>{hospitalName}</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>Hospital Management System</p>
                  <p style={{ color: '#00c97a', fontSize: '12px', cursor: 'pointer', marginTop: '4px' }} onClick={() => document.getElementById('logoUpload').click()}>
                    Click to change logo
                  </p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hospital Name</label>
                  <input value={hospitalName} onChange={e => setHospitalName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={hospitalEmail} onChange={e => setHospitalEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={hospitalPhone} onChange={e => setHospitalPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={hospitalAddress} onChange={e => setHospitalAddress(e.target.value)} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}>
                <FiSave style={{ marginRight: '8px' }} />
                Save Changes
              </button>
              {saved && <span style={{ marginLeft: '15px', color: '#00c97a', fontWeight: 600 }}>✅ Saved!</span>}
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <div className="card-header"><h2>My Account</h2></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                <div style={{ width: '70px', height: '70px', background: '#00c97a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: '#0d2b1f' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0d2b1f' }}>{user?.name}</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>{user?.role}</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input defaultValue={user?.name} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input defaultValue={user?.role} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave}>
                <FiSave style={{ marginRight: '8px' }} />
                Save Changes
              </button>
              {saved && <span style={{ marginLeft: '15px', color: '#00c97a', fontWeight: 600 }}>✅ Saved!</span>}
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <div className="card-header"><h2>Change Password</h2></div>
              <div style={{ maxWidth: '400px' }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={() => {
                  if (newPassword !== confirmPassword) { alert('Passwords do not match!'); return; }
                  handleSave();
                }}>
                  <FiLock style={{ marginRight: '8px' }} />
                  Update Password
                </button>
                {saved && <span style={{ marginLeft: '15px', color: '#00c97a', fontWeight: 600 }}>✅ Updated!</span>}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="card-header">
                <h2>User Management</h2>
                <button className="add-patient-btn" onClick={() => setShowStaffForm(!showStaffForm)}>
                  <FiPlus size={16} />
                  Add Staff
                </button>
              </div>

              {showStaffForm && (
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input placeholder="Enter name" value={staffName} onChange={e => setStaffName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input placeholder="Enter email" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select value={staffRole} onChange={e => setStaffRole(e.target.value)}>
                        <option>Receptionist</option>
                        <option>Doctor</option>
                        <option>Nurse</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={addStaff}>Add Staff Member</button>
                </div>
              )}

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>👤 {s.name}</td>
                        <td>{s.email}</td>
                        <td><span className="badge badge-confirmed">{s.role}</span></td>
                        <td>
                          <button className="btn-danger" onClick={() => removeStaff(s.id)}>
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <div className="card-header">
                <h2>Backup & Export Data</h2>
              </div>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                Export your hospital data for backup purposes. This includes hospital settings and staff information.
              </p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', flex: '1', minWidth: '200px' }}>
                  <FiDatabase size={28} color="#00c97a" style={{ marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '15px', marginBottom: '5px' }}>Export Settings</h3>
                  <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Download hospital profile & staff data as JSON</p>
                  <button className="btn-primary" onClick={exportData}>
                    <FiDownload style={{ marginRight: '8px' }} />
                    Export Data
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#fff8e1', borderRadius: '10px', fontSize: '13px', color: '#92700a' }}>
                ⚠️ Note: For full database backup (patients, doctors, appointments), use MySQL Workbench's export feature.
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="card-header"><h2>Notification Settings</h2></div>
              {[
                { key: 'appointments', label: 'Appointment Notifications', desc: 'Get notified when appointments are booked or cancelled' },
                { key: 'patients', label: 'Patient Notifications', desc: 'Get notified when new patients are registered' },
                { key: 'billing', label: 'Billing Notifications', desc: 'Get notified for payment updates' },
                { key: 'reports', label: 'Report Notifications', desc: 'Get notified when new reports are available' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f4f8' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#0d2b1f' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{item.desc}</p>
                  </div>
                  <div onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{ width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer', background: notifications[item.key] ? '#00c97a' : '#ddd', position: 'relative', transition: 'all 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'all 0.3s', left: notifications[item.key] ? '25px' : '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: '20px' }} onClick={handleSave}>
                <FiSave style={{ marginRight: '8px' }} />
                Save Preferences
              </button>
              {saved && <span style={{ marginLeft: '15px', color: '#00c97a', fontWeight: 600 }}>✅ Saved!</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;