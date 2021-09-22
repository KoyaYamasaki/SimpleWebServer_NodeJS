const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const fs = require('fs');
const mm = require(`music-metadata`)

const trackBasePath = "./tracks"
const ignoreFile = ".DS_Store"
const trackUrl = './tracks/'
const imageUrl = './images/'

let artistName;
let albumName;

const getAlbumInfo = async (req, res) => {
  console.log(req.files.track)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  const track = req.files.track;
  const trackInfo = await parseFile(track.tempFilePath);
  console.log(trackInfo.common)
  artistName = trackInfo.common.artist
  albumName = trackInfo.common.album
  const json = {
    artist: artistName,
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

const uploadArtistImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  placeArtistImage(req.files.image)

  return res
  .status(StatusCodes.OK)
  .send()
}

function placeArtistImage(file) {
  const mkDirUrl = imageUrl + artistName
  fs.mkdir(mkDirUrl, (err) => {
    if (err) { throw err; }
    console.log('Succeeded to create folder');
    const imagePath =
      path.join(
        __dirname,
        "../" + imageUrl + artistName + "/Artist.jpeg"
    );
    file.mv(imagePath)
  });
}

const uploadTrack = async (req, res) => {
  console.log(req.files)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  // const url = trackUrl + artistName
  const track = req.files.track;
  const mkDirUrl = trackUrl + artistName + "/" + albumName
  if (!fs.existsSync(mkDirUrl)) {
    await fs.mkdir(mkDirUrl, {recursive: true });
  }

  const trackPath =
  path.join(
    __dirname,
    "../" + trackUrl + artistName + "/" + albumName + "/" + track.name
  );
  track.mv(trackPath)

  return res
  .status(StatusCodes.OK)
  .send()
}

function makeDirectory() {
  // TODO
}

function uploadMultipleFiles(files) {
  const url = trackUrl + artistName

  files.forEach(elem => {
    const track = elem.track;
    const trackPath = path.join(
      __dirname, url + `${track.name}`);

    track.mv(trackPath);
  });
}

module.exports = {
  getAlbumInfo,
  uploadArtistImage,
  uploadTrack
};
