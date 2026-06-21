import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#00c97a', '#0d2b1f', '#1a4a32', '#e53935', '#fb8c00', '#1a73e8'];

function Statistics() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pRes = await fetch('http://localhost:5000/api/patients');
    const pData = await pRes.json();
    const dRes = await fetch('http://localhost:5000/api/doctors');
    const dData = await dRes.json();
    const aRes = await fetch('http://localhost:5000/api/appointments');
    const aData = await aRes.json();
    setStats({ patients: pData.length, doctors: dData.length, appointments: aData.length });
    setAppointments(aData);
    setPatients(pData);
    setDoctors(dData);
  };

  const appointmentStatusData = [
    { name: 'Pending', value: appointments.filter(a => a.status === 'Pending').length },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'Confirmed').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length },
  ];

  const genderData = [
    { name: 'Male', value: patients.filter(p => p.gender === 'Male').length },
    { name: 'Female', value: patients.filter(p => p.gender === 'Female').length },
    { name: 'Other', value: patients.filter(p => p.gender === 'Other').length },
  ];

  const overviewData = [
    { name: 'Patients', count: stats.patients },
    { name: 'Doctors', count: stats.doctors },
    { name: 'Appointments', count: stats.appointments },
  ];

  const monthlyData = [
    { month: 'Jan', patients: 20, appointments: 15 },
    { month: 'Feb', patients: 35, appointments: 28 },
    { month: 'Mar', patients: 45, appointments: 38 },
    { month: 'Apr', patients: 30, appointments: 25 },
    { month: 'May', patients: 55, appointments: 48 },
    { month: 'Jun', patients: 60, appointments: 52 },
    { month: 'Jul', patients: stats.patients, appointments: stats.appointments },
  ];

  // Weekly Appointments Data
  const weeklyData = [
    { day: 'Mon', appointments: 12 },
    { day: 'Tue', appointments: 19 },
    { day: 'Wed', appointments: 8 },
    { day: 'Thu', appointments: 15 },
    { day: 'Fri', appointments: 22 },
    { day: 'Sat', appointments: 10 },
    { day: 'Sun', appointments: 5 },
  ];

  // Top Doctors Leaderboard
  const topDoctors = doctors.map(d => ({
    ...d,
    appointmentCount: appointments.filter(a => a.doctor_name === d.name).length
  })).sort((a, b) => b.appointmentCount - a.appointmentCount).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>📊 Statistics & Analytics</h1>
        <p>Overview of hospital performance and data insights</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid" style={{ marginBottom: '25px' }}>
        <div className="stat-card green">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{stats.patients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{stats.doctors}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.appointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{appointments.filter(a => a.status === 'Confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid-2" style={{ marginBottom: '25px' }}>
        <div className="card">
          <div className="card-header">
            <h2>Monthly Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#0d2b1f" strokeWidth={2} name="Patients" />
              <Line type="monotone" dataKey="appointments" stroke="#00c97a" strokeWidth={2} name="Appointments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Appointment Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={appointmentStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid-2" style={{ marginBottom: '25px' }}>
        <div className="card">
          <div className="card-header">
            <h2>Hospital Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#00c97a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Patient Gender Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {genderData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW: WEEKLY APPOINTMENTS + TOP DOCTORS */}
      <div className="grid-2">

        {/* WEEKLY APPOINTMENTS BAR CHART */}
        <div className="card">
          <div className="card-header">
            <h2>📅 Weekly Appointments</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="appointments" fill="#00c97a" radius={[6, 6, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TOP DOCTORS LEADERBOARD */}
        <div className="card">
          <div className="card-header">
            <h2>🏆 Top Doctors</h2>
            <span style={{ fontSize: '12px', color: '#888' }}>By Appointments</span>
          </div>
          {topDoctors.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>No doctors found</p>
          ) : (
            topDoctors.map((d, index) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 0', borderBottom: '1px solid #f0f4f8' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#00c97a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px', color: index < 3 ? '#fff' : '#fff', flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>👨‍⚕️ {d.name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{d.specialization}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#00c97a', fontSize: '16px' }}>{d.appointmentCount}</p>
                  <p style={{ fontSize: '11px', color: '#888' }}>appointments</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;