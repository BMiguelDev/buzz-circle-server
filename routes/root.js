const path = require('path');
const express = require('express');
const router = express.Router();

// Router to handle the routes to the "/" route/path
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

module.exports = router;
