const express = require('express');
const router = express.Router();
const { getAllDoctors, addDoctor, deleteDoctor } = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.post('/', addDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;