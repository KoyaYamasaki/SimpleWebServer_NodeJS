const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const fs = require('fs');
const mm = require(`music-metadata`)

const trackBasePath = "./tracks"
const ignoreFile = ".DS_Store"

const getAlbumInfo = async (req, res) => {
  console.log(req.files.track)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  const track = req.files.track;
  const trackInfo = await parseFile(track.tempFilePath);
  console.log(trackInfo.common)
  const json = {
    artist: trackInfo.common.artist,
    artistImage: getArtistImage(trackInfo.common.artist),
    album: trackInfo.common.album,
    albumImage: trackInfo.common.picture[0]["data"].toString('base64'),
  }

  return res
  .status(StatusCodes.OK)
  .json(json);  
}

const parseFile = (path) => {
  return parsedFile = 
    mm.parseFile(path, {native: false})
      .then(metadata => {
      // console.log("metadata", metadata)
      return metadata
  })
  .catch(err => {
      console.log(err)
  })
}

function getArtistImage(artistName) {
  const url = './images/' + artistName + '/Artist.jpeg'
  var imageData;
  try {
    imageData = fs.readFileSync(url)
  } catch(error) {
    imageData = fs.readFileSync('./images/not-found.jpeg')
  }
  
  return imageData.toString('base64');
}

const uploadProductImageLocal = async (req, res) => {
  console.log(req.files)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  const productImage = req.files.image;
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  productImage.mv(imagePath);

  return res
  .status(StatusCodes.OK)
  .json({ image: { src: `/uploads/` } });
};

const uploadArtistImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  files.forEach(elem => {
    const productImage = elem.image;
    const imagePath = path.join(
      __dirname,
      '/images/uploads/' + `${productImage.name}`);
  });
}

const uploadAlbumImage = async (req, res) => {

}

const uploadMultipleFiles = async (req, res) => {
  console.log(req.files)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  files.forEach(elem => {
    const productImage = elem.image;
    const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
    );
    productImage.mv(imagePath);
  });

  return res
  .status(StatusCodes.OK)
  .json({ image: { src: `/uploads/` } });
}

module.exports = {
  uploadProductImageLocal,
  getAlbumInfo
};
