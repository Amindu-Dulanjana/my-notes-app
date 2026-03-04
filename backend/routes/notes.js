const express = require('express');
const router = express.Router();

// placeholder
router.get('/', (req, res) => res.json({ msg: 'notes route works' }));

module.exports = router;