import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSearch, FiFileText, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';

function Doctors({ search, addNotification }) {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    const res = await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/doctors');
    const data = await res.json();
    setDoctors(data);
  };

  const addDoctor = async () => {
    if (!name || !specialization || !phone || !email) { alert('Please fill all fields!'); return; }
    await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialization, phone, email })
    });
    fetchDoctors();
    if (addNotification) addNotification('appointment', 'New Doctor Added', `Dr. ${name} has joined the team`, 'doctors');
    setName(''); setSpecialization(''); setPhone(''); setEmail('');
    setShowForm(false);
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await fetch(`https://outstanding-harmony-production-d4b2.up.railway.app/api/doctors/${id}`, { method: 'DELETE' });
    fetchDoctors();
  };

  const generateDoctorReport = (doctor) => {
    const doc = new jsPDF();

    doc.setFillColor(13, 43, 31);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(0, 201, 122);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MedCare Hospital', 15, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Gurugram, Haryana | info@medcare.com | +91 9999999999', 15, 30);

    doc.setTextColor(13, 43, 31);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DOCTOR PROFILE REPORT', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Report ID: DR-${doctor.id.toString().padStart(4, '0')}`, 15, 63);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 69);

    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 78, 180, 65, 3, 3, 'F');

    doc.setTextColor(0, 201, 122);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Information', 20, 90);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let y = 100;
    const details = [
      ['Doctor ID:', `#${doctor.id}`],
      ['Full Name:', `Dr. ${doctor.name}`],
      ['Specialization:', doctor.specialization],
      ['Phone:', doctor.phone],
      ['Email:', doctor.email],
    ];

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 70, y);
      y += 9;
    });

    y = 155;
    doc.setTextColor(13, 43, 31);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Joined Hospital On', 15, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(doctor.created_at).toLocaleDateString(), 15, y + 7);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('This is a computer-generated profile report.', 15, 280);
    doc.text('MedCare Hospital Management System', 15, 285);

    doc.save(`Doctor_Report_${doctor.name}.pdf`);
  };

  const generateAllDoctorsReport = () => {
    const doc = new jsPDF();

    doc.setFillColor(13, 43, 31);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(0, 201, 122);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MedCare Hospital', 15, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('All Doctors Report', 15, 27);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Doctors: ${filtered.length}`, 15, 45);

    let y = 55;
    doc.setFillColor(0, 201, 122);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 18, y + 6);
    doc.text('Name', 35, y + 6);
    doc.text('Specialization', 90, y + 6);
    doc.text('Phone', 150, y + 6);

    y += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');

    filtered.forEach((d) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(230, 230, 230);
      doc.rect(15, y, 180, 8);
      doc.text(`#${d.id}`, 18, y + 6);
      doc.text(d.name.substring(0, 20), 35, y + 6);
      doc.text(d.specialization.substring(0, 20), 90, y + 6);
      doc.text(d.phone, 150, y + 6);
      y += 8;
    });

    doc.save(`All_Doctors_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const specializations = ['Cardiologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Dermatologist', 'Gynecologist', 'Psychiatrist', 'General Physician'];

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes((search || '').toLowerCase()) ||
    d.specialization.toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Doctors</h1>
          <p>Manage all registered doctors</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={generateAllDoctorsReport}
            style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '10px 18px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiDownload size={16} />
            Export All
          </button>
          <button className="add-patient-btn" onClick={() => setShowForm(!showForm)}>
            <FiPlus size={16} />
            Add Doctor
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h2>Add New Doctor</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Dr. Name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <select value={specialization} onChange={e => setSpecialization(e.target.value)}>
                <option value="">Select Specialization</option>
                {specializations.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={addDoctor}>Save Doctor</button>
            <button className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>All Doctors ({filtered.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td style={{ fontWeight: 600 }}>👨‍⚕️ {d.name}</td>
                  <td>
                    <span className="badge badge-confirmed">{d.specialization}</span>
                  </td>
                  <td>{d.phone}</td>
                  <td>{d.email}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => generateDoctorReport(d)}
                      style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <FiFileText size={14} />
                    </button>
                    <button className="btn-danger" onClick={() => deleteDoctor(d.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No doctors found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Doctors;