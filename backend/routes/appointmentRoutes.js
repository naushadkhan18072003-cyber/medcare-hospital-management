const express = require('express');
const router = express.Router();
const { getAllAppointments, addAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');

router.get('/', getAllAppointments);
router.post('/', addAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;