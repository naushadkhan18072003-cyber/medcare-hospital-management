import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiDollarSign, FiPrinter } from 'react-icons/fi';
import jsPDF from 'jspdf';

function Billing({ addNotification }) {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Unpaid');

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  const fetchBills = async () => {
    const res = await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/bills');
    const data = await res.json();
    setBills(data);
  };

  const fetchPatients = async () => {
    const res = await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/patients');
    const data = await res.json();
    setPatients(data);
  };

  const addBill = async () => {
    if (!patientId || !description || !amount) {
      alert('Please fill all fields!');
      return;
    }
    await fetch('https://outstanding-harmony-production-d4b2.up.railway.app/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId, description, amount, status })
    });
    fetchBills();
    const patient = patients.find(p => p.id === parseInt(patientId));
    if (addNotification) addNotification('billing', 'New Bill Created', `₹${amount} bill for ${patient?.name}`, 'billing');
    setPatientId(''); setDescription(''); setAmount(''); setStatus('Unpaid');
    setShowForm(false);
  };

  const updateBillStatus = async (id, newStatus) => {
    await fetch(`https://outstanding-harmony-production-d4b2.up.railway.app/api/bills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchBills();
  };

  const deleteBill = async (id) => {
    if (!window.confirm('Delete this bill?')) return;
    await fetch(`https://outstanding-harmony-production-d4b2.up.railway.app/api/bills/${id}`, { method: 'DELETE' });
    fetchBills();
  };

  const generateInvoice = (bill) => {
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
    doc.text('INVOICE', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: INV-${bill.id.toString().padStart(4, '0')}`, 15, 63);
    doc.text(`Date: ${new Date(bill.created_at).toLocaleDateString()}`, 15, 69);

    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 78, 180, 30, 3, 3, 'F');
    doc.setTextColor(13, 43, 31);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 88);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${bill.patient_name}`, 20, 95);
    doc.text(`${bill.phone || ''}`, 20, 101);

    let y = 120;
    doc.setFillColor(0, 201, 122);
    doc.rect(15, y, 180, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, y + 7);
    doc.text('Amount', 165, y + 7);

    y += 10;
    doc.setDrawColor(230, 230, 230);
    doc.rect(15, y, 180, 12);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(bill.description, 20, y + 8);
    doc.text(`Rs. ${parseFloat(bill.amount).toLocaleString()}`, 165, y + 8);

    y += 20;
    doc.setFillColor(13, 43, 31);
    doc.rect(115, y, 80, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 120, y + 8);
    doc.text(`Rs. ${parseFloat(bill.amount).toLocaleString()}`, 165, y + 8);

    y += 25;
    doc.setTextColor(13, 43, 31);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Status:', 15, y);
    if (bill.status === 'Paid') {
      doc.setTextColor(0, 201, 122);
    } else {
      doc.setTextColor(229, 57, 53);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(bill.status, 55, y);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing MedCare Hospital!', 15, 280);
    doc.text('This is a computer-generated invoice.', 15, 285);

    doc.save(`Invoice_${bill.patient_name}_${bill.id}.pdf`);
  };

  const totalAmount = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const paidAmount = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const unpaidAmount = bills.filter(b => b.status === 'Unpaid').reduce((sum, b) => sum + parseFloat(b.amount), 0);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Billing & Payments</h1>
          <p>Manage all patient bills and payments</p>
        </div>
        <button className="add-patient-btn" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} />
          Add Bill
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
        <div className="stat-card green">
          <div className="stat-icon"><FiDollarSign size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3>₹{totalAmount.toLocaleString()}</h3>
            <p>Total Billing</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiDollarSign size={22} color="#00c97a" /></div>
          <div className="stat-info">
            <h3 style={{ color: '#00c97a' }}>₹{paidAmount.toLocaleString()}</h3>
            <p>Paid Amount</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiDollarSign size={22} color="#e53935" /></div>
          <div className="stat-info">
            <h3 style={{ color: '#e53935' }}>₹{unpaidAmount.toLocaleString()}</h3>
            <p>Unpaid Amount</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header"><h2>Add New Bill</h2></div>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Patient</label>
              <select value={patientId} onChange={e => setPatientId(e.target.value)}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input placeholder="e.g. Consultation, Surgery" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={addBill}>Save Bill</button>
            <button className="btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>All Bills ({bills.length})</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td style={{ fontWeight: 600 }}>👤 {b.patient_name}</td>
                  <td>{b.description}</td>
                  <td style={{ fontWeight: 600, color: '#0d2b1f' }}>₹{parseFloat(b.amount).toLocaleString()}</td>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={e => updateBillStatus(b.id, e.target.value)}
                      style={{
                        padding: '4px 8px', borderRadius: '6px', border: '1px solid #e0e0e0',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        color: b.status === 'Paid' ? '#00c97a' : '#e53935'
                      }}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => generateInvoice(b)}
                      style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <FiPrinter size={14} />
                    </button>
                    <button className="btn-danger" onClick={() => deleteBill(b.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '30px' }}>No bills found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Billing;