// server/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');

router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ filePath: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ message: 'File upload failed' });
    }
});

module.exports = router;
