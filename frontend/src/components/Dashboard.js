import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiPhone, FiUsers } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';

const monthlyData = [
  { month: 'Jan', patients: 400, inpatients: 240 },
  { month: 'Feb', patients: 600, inpatients: 380 },
  { month: 'Mar', patients: 800, inpatients: 500 },
  { month: 'Apr', patients: 1000, inpatients: 700 },
  { month: 'May', patients: 1400, inpatients: 900 },
  { month: 'Jun', patients: 1800, inpatients: 1200 },
  { month: 'Jul', patients: 1856, inpatients: 1400 },
  { month: 'Aug', patients: 1600, inpatients: 1100 },
  { month: 'Sep', patients: 1900, inpatients: 1300 },
  { month: 'Oct', patients: 2100, inpatients: 1500 },
  { month: 'Nov', patients: 2300, inpatients: 1700 },
  { month: 'Dec', patients: 2500, inpatients: 1900 },
];

function Dashboard({ user }) {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAppointments();
  }, []);

  const fetchStats = async () => {
    const pRes = await fetch('http://localhost:5000/api/patients');
    const pData = await pRes.json();
    const dRes = await fetch('http://localhost:5000/api/doctors');
    const dData = await dRes.json();
    const aRes = await fetch('http://localhost:5000/api/appointments');
    const aData = await aRes.json();
    setStats({ patients: pData.length, doctors: dData.length, appointments: aData.length });
    setAppointments(aData.slice(0, 5));
  };

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/api/appointments');
    const data = await res.json();
    setAppointments(data.slice(0, 5));
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {/* HEADER */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Hello, {user.name} 👋</h1>
          <p>There is the latest update for the last 7 days, check now</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 18px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <FiCalendar color="#00c97a" />
          <span style={{ fontSize: '14px', color: '#444' }}>{today}</span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon"><FiCalendar size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3>{stats.appointments}</h3>
            <p>Appointments</p>
            <span className="stat-change" style={{ color: '#00c97a' }}>↑ 4.8% from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiPhone size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3>1,002</h3>
            <p>Call Consultancy</p>
            <span className="stat-change">↑ 40% from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUserMd size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Total Doctors</p>
            <span className="stat-change">↑ 25% from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiUsers size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Total Patients</p>
            <span className="stat-change">↑ 2.1% from last week</span>
          </div>
        </div>
      </div>

      {/* CHART + APPOINTMENTS */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2>Patient Statistics</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Week', 'Month', 'Year'].map(t => (
                <button key={t} style={{
                  padding: '4px 12px', borderRadius: '6px', border: '1px solid #e0e0e0',
                  background: t === 'Year' ? '#0d2b1f' : 'white',
                  color: t === 'Year' ? 'white' : '#666', fontSize: '12px', cursor: 'pointer'
                }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#0d2b1f" strokeWidth={2} dot={false} name="Total patients" />
              <Line type="monotone" dataKey="inpatients" stroke="#00c97a" strokeWidth={2} dot={false} name="Inpatients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TODAY'S APPOINTMENTS */}
        <div className="card">
          <div className="card-header">
            <h2>Today's Appointments</h2>
            <button style={{ background: '#00c97a', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '18px' }}>+</button>
          </div>
          {appointments.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No appointments yet</p>
          ) : (
            appointments.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f4f8' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{a.patient_name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{a.doctor_name}</p>
                </div>
                <span className={`badge badge-${a.status === 'Pending' ? 'pending' : a.status === 'Confirmed' ? 'confirmed' : 'cancelled'}`}>
                  {a.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* BALANCE + ROOM */}
      <div className="grid-3">
        <div className="card">
          <div className="card-header"><h2>Balance</h2></div>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '8px solid #00c97a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '18px', fontWeight: 700, color: '#0d2b1f' }}>87%</div>
            <p style={{ color: '#888', fontSize: '12px' }}>Total Transaction Revenue</p>
            <h2 style={{ color: '#0d2b1f', fontSize: '22px' }}>$136,450</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div><p style={{ fontSize: '12px', color: '#888' }}>Total Income</p><p style={{ fontWeight: 700, color: '#00c97a' }}>$8,135,450</p></div>
            <div><p style={{ fontSize: '12px', color: '#888' }}>Total Expense</p><p style={{ fontWeight: 700, color: '#e53935' }}>$7,999,000</p></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Room Occupancy</h2></div>
          <div style={{ fontSize: '42px', fontWeight: 700, color: '#0d2b1f', marginBottom: '15px' }}>
            52 <span style={{ fontSize: '16px', color: '#00c97a' }}>+124</span>
          </div>
          {[['General Room', 124], ['Private Room', 52], ['ICU', 12]].map(([name, count]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f4f8', fontSize: '14px' }}>
              <span style={{ color: '#555' }}>🏥 {name}</span>
              <span style={{ fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><h2>Reports</h2></div>
          {[
            'Patient discharge report updated',
            'Monthly billing report ready',
            'Doctor schedule updated',
            'New lab results available'
          ].map((report, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f4f8' }}>
              <p style={{ fontSize: '13px', color: '#444' }}>📋 {report}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>Just now</span>
                <span style={{ fontSize: '11px', color: '#00c97a', cursor: 'pointer' }}>View report →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;