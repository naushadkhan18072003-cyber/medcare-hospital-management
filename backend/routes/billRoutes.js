const express = require('express');
const router = express.Router();
const { getAllBills, addBill, updateBill, deleteBill } = require('../controllers/billController');

router.get('/', getAllBills);
router.post('/', addBill);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

module.exports = router;