const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createVendor, updateVendor, getVendor } = require('../controllers/vendorController');

router.post('/', auth, createVendor);
router.put('/:id', auth, updateVendor);
router.get('/:id', auth, getVendor);

module.exports = router;
