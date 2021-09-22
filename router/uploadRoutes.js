const express = require('express');
const router = express.Router();

// Import From uploadsController
const { 
  getAlbumInfo,
  uploadArtistImage,
  uploadTrack,
} = require('../controllers/uploadsController');

router.route(`/getInfo`).post(getAlbumInfo);
router.route('/uploadArtistImage').post(uploadArtistImage);
router.route('/uploadTrack').post(uploadTrack);

module.exports = router;
