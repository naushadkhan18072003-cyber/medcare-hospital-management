const db = require('../config/db');

// Get all appointments
const getAllAppointments = (req, res) => {
  const sql = `
    SELECT a.id, p.name as patient_name, d.name as doctor_name, 
    d.specialization, a.appointment_date, a.status 
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add new appointment
const addAppointment = (req, res) => {
  const { patient_id, doctor_id, appointment_date } = req.body;
  const sql = 'INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)';
  db.query(sql, [patient_id, doctor_id, appointment_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment booked successfully!', id: result.insertId });
  });
};

// Update appointment status
const updateAppointment = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment updated successfully!' });
  });
};

// Delete appointment
const deleteAppointment = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM appointments WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Appointment deleted successfully!' });
  });
};

module.exports = { getAllAppointments, addAppointment, updateAppointment, deleteAppointment };