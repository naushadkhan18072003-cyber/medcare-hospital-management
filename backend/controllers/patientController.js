const db = require('../config/db');

// Get all patients
const getAllPatients = (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add new patient
const addPatient = (req, res) => {
  const { name, age, gender, phone, address } = req.body;
  const sql = 'INSERT INTO patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, age, gender, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Patient added successfully!', id: result.insertId });
  });
};

// Delete patient
const deletePatient = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM patients WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Patient deleted successfully!' });
  });
};

module.exports = { getAllPatients, addPatient, deletePatient };