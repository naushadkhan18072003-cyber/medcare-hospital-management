import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function Appointments({ addNotification }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const fetchPatients = async () => {
    const res = await fetch('http://localhost:5000/api/patients');
    const data = await res.json();
    setPatients(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:5000/api/doctors');
    const data = await res.json();
    setDoctors(data);
  };

  const addAppointment = async () => {
    if (!patientId || !doctorId || !date) { alert('Please fill all fields!'); return; }
    await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId, appointment_date: date })
    });
    fetchAppointments();
setPatientId(''); setDoctorId(''); setDate('');
if (addNotification) addNotification('appointment', 'Appointment Booked', 'New appointment has been scheduled', 'appointments');
    setShowForm(false);
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    await fetch(`http://localhost:5000/api/appointments/${id}`, { method: 'DELETE' });
    fetchAppointments();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Appointments</h1>
          <p>Manage all patient appointments</p>
        </div>
        <button className="add-patient-btn" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} />
          Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><h2>Book New Appointment</h2></div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Patient</label>
              <select value={patientId} onChange={e => setPatientId(e.target.value)}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Select Doctor</label>
              <select value={doctorId} onChange={e => setDoctorId(e.target.value)}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Appointment Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={addAppointment}>Book Appointment</button>
            <button className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>All Appointments ({appointments.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>#{a.id}</td>
                  <td style={{ fontWeight: 600 }}>👤 {a.patient_name}</td>
                  <td>👨‍⚕️ {a.doctor_name}</td>
                  <td>{a.specialization}</td>
                  <td>{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={e => updateStatus(a.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '12px',
                        color: a.status === 'Pending' ? '#f59e0b' : a.status === 'Confirmed' ? '#00c97a' : '#e53935',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => deleteAppointment(a.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Appointments;