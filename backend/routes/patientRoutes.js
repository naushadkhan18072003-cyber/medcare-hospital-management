const express = require('express');
const router = express.Router();
const { getAllPatients, addPatient, deletePatient } = require('../controllers/patientController');

router.get('/', getAllPatients);
router.post('/', addPatient);
router.delete('/:id', deletePatient);

module.exports = router;