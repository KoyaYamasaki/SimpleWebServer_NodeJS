const express = require('express');
const router = express.Router();

// Import From uploadsController
const { 
  uploadProductImageLocal,
  getAlbumInfo,
} = require('../controllers/uploadsController');

router.route('/uploads').post(uploadProductImageLocal);
router.route(`/getInfo`).post(getAlbumInfo);

module.exports = router;
