const express = require('express');
const router = express.Router();
const photosController = require('../controllers/photosController');

router.get('/', photosController.getAllPhotos);
router.post('/', photosController.createPhoto);

module.exports = router;
