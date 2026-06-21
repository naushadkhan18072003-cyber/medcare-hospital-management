const db = require('../config/db');

// Get all doctors
const getAllDoctors = (req, res) => {
  db.query('SELECT * FROM doctors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add new doctor
const addDoctor = (req, res) => {
  const { name, specialization, phone, email } = req.body;
  const sql = 'INSERT INTO doctors (name, specialization, phone, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, specialization, phone, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doctor added successfully!', id: result.insertId });
  });
};

// Delete doctor
const deleteDoctor = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM doctors WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doctor deleted successfully!' });
  });
};

module.exports = { getAllDoctors, addDoctor, deleteDoctor };