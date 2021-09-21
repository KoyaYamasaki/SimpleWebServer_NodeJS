const express = require(`express`)
const router = express.Router()

const {
  getArtistList,
  getAlbumList,
  getSelectedTrack,
} = require('../controllers/controller')

router.get('/list', getArtistList)
router.get('/list/:artist', getAlbumList)
router.get(`/tracks/:artist/:album/:track`, getSelectedTrack)

module.exports = router
