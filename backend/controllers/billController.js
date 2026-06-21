const db = require('../config/db');

// Get all bills
const getAllBills = (req, res) => {
  const sql = `
    SELECT b.id, b.patient_id, p.name as patient_name, p.phone, p.address,
    b.description, b.amount, b.status, b.created_at
    FROM bills b
    JOIN patients p ON b.patient_id = p.id
    ORDER BY b.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add new bill
const addBill = (req, res) => {
  const { patient_id, description, amount, status } = req.body;
  const sql = 'INSERT INTO bills (patient_id, description, amount, status) VALUES (?, ?, ?, ?)';
  db.query(sql, [patient_id, description, amount, status || 'Unpaid'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Bill added successfully!', id: result.insertId });
  });
};

// Update bill status
const updateBill = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query('UPDATE bills SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Bill updated successfully!' });
  });
};

// Delete bill
const deleteBill = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM bills WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Bill deleted successfully!' });
  });
};

module.exports = { getAllBills, addBill, updateBill, deleteBill };