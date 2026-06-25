import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiTrash2, FiFileText, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';

function Patients({ search, addNotification }) {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    const res = await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/patients');
    const data = await res.json();
    setPatients(data);
  };

  const addPatient = async () => {
    if (!name || !age || !phone) { alert('Please fill all fields!'); return; }
    await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, gender, phone, address })
    });
    fetchPatients();
    if (addNotification) addNotification('patient', 'New Patient Registered', `${name} has been added`, 'patients');
    setName(''); setAge(''); setPhone(''); setAddress('');
    setShowForm(false);
  };

  const deletePatient = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    await fetch(`https://outstanding-harmony-production-d4b2.up.railway.app/api/patients/${id}`, { method: 'DELETE' });
    fetchPatients();
  };

  // Generate single patient PDF report
  const generatePatientReport = (patient) => {
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
    doc.text('PATIENT MEDICAL REPORT', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Report ID: PR-${patient.id.toString().padStart(4, '0')}`, 15, 63);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 69);

    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 78, 180, 70, 3, 3, 'F');

    doc.setTextColor(0, 201, 122);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, 90);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let y = 100;
    const details = [
      ['Patient ID:', `#${patient.id}`],
      ['Full Name:', patient.name],
      ['Age:', `${patient.age} years`],
      ['Gender:', patient.gender],
      ['Phone:', patient.phone],
      ['Address:', patient.address || 'N/A'],
    ];

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 70, y);
      y += 9;
    });

    y = 160;
    doc.setTextColor(13, 43, 31);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Registration Date', 15, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(new Date(patient.created_at).toLocaleDateString(), 15, y + 7);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('This is a computer-generated medical report.', 15, 280);
    doc.text('MedCare Hospital Management System', 15, 285);

    doc.save(`Patient_Report_${patient.name}.pdf`);
  };

  // Generate all patients list PDF
  const generateAllPatientsReport = () => {
    const doc = new jsPDF();

    doc.setFillColor(13, 43, 31);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(0, 201, 122);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MedCare Hospital', 15, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('All Patients Report', 15, 27);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Patients: ${filtered.length}`, 15, 45);

    let y = 55;
    doc.setFillColor(0, 201, 122);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 18, y + 6);
    doc.text('Name', 35, y + 6);
    doc.text('Age', 90, y + 6);
    doc.text('Gender', 110, y + 6);
    doc.text('Phone', 140, y + 6);

    y += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');

    filtered.forEach((p, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(230, 230, 230);
      doc.rect(15, y, 180, 8);
      doc.text(`#${p.id}`, 18, y + 6);
      doc.text(p.name.substring(0, 20), 35, y + 6);
      doc.text(String(p.age), 90, y + 6);
      doc.text(p.gender, 110, y + 6);
      doc.text(p.phone, 140, y + 6);
      y += 8;
    });

    doc.save(`All_Patients_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes((search || '').toLowerCase()) ||
    p.phone.includes(search || '')
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Patients</h1>
          <p>Manage all registered patients</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={generateAllPatientsReport}
            style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '10px 18px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiDownload size={16} />
            Export All
          </button>
          <button className="add-patient-btn" onClick={() => setShowForm(!showForm)}>
            <FiPlus size={16} />
            Add Patient
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <h2>Add New Patient</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input placeholder="Enter age" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={addPatient}>Save Patient</button>
            <button className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>All Patients ({filtered.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.age}</td>
                  <td>
                    <span className={`badge ${p.gender === 'Male' ? 'badge-confirmed' : 'badge-pending'}`}>
                      {p.gender}
                    </span>
                  </td>
                  <td>{p.phone}</td>
                  <td>{p.address}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => generatePatientReport(p)}
                      style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <FiFileText size={14} />
                    </button>
                    <button className="btn-danger" onClick={() => deletePatient(p.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No patients found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Patients;