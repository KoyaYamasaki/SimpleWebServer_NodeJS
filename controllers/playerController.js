const fs = require('fs')
const path = require('path')
const mm = require(`music-metadata`)

const trackBasePath = "./tracks"
const ignoreFile = ".DS_Store"
var fullPathArray = Array()

const getArtistList = (req, res) => {
    let jsonArray = getArtistListJson(trackBasePath)
    res.json(jsonArray)
    res.end()
}

const getAlbumList = (req, res) => {
    fullPathArray = []
    const fullPathArrray = findResources(trackBasePath + "/" + req.params.artist);

    var parseFileArray = []
    fullPathArrray.forEach((path) => {
        parseFileArray.push(parseFile(path))
    })
    Promise.all(parseFileArray).then((metadatas) => {
        let songs = []
        var contentsCount = []
        var albumTitle = ""
        metadatas.forEach((metadata, index) => {
            const img = metadata.common.picture[0]["data"].toString('base64')
            // console.log("img", img)
            if (albumTitle !== metadata.common.album) {
                albumTitle = metadata.common.album
                contentsCount.push(metadata.common.track[`of`])
            }
            song = {
                title: metadata.common.title,
                duration: metadata.format.duration,
                track: metadata.common.track[`no`],
                uri: fullPathArrray[index]
            }
            songs.push(song)
        })

        var i = 0
        var responseJson = []
        contentsCount.forEach((count, index) => {
            count += i
            var songsForAlbum = []
            console.log("count: ", count)
            for (i; i < count; i++) {
                songsForAlbum.push(songs[i])
                // console.log("foreach: ", songs[i])
            }

            var json = {
                artist: metadatas[i-1].common.artist,
                title: metadatas[i-1].common.album,
                tracks: metadatas[i-1].common.track[`of`],
                image: metadatas[i-1].common.picture[0]["data"].toString('base64'),
                songs: songsForAlbum
            }
            responseJson.push(json)
            i = count
        })

        res.json(responseJson)
        res.end()
    })
}

const getSelectedTrack = (req, res) => {
    const trackPath = trackBasePath + `/` + req.params.artist + `/` + req.params.album + `/` + req.params.track
    var stat = fs.statSync(trackPath)
    range = req.headers.range;
    var readStream;

    if (range !== undefined) {
        console.log("range is undefined")
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
        }

        var start = parseInt(partial_start, 10);
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        readStream = fs.createReadStream(trackPath, {start: start, end: end});
    } else {
        console.log("range is defined")
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        console.log("size", stat.size)
        readStream = fs.createReadStream(trackPath);
    }
    readStream.pipe(res);
}

function getArtistListJson(dir) {
    var jsonArray = []
    const artistNames = fs.readdirSync(dir);
    const filteredArtist = artistNames.filter(elem => elem !== ignoreFile)
    filteredArtist.forEach((artistName => {
        const imageData = getArtistImage(artistName)
        const fullPath = path.join(dir, artistName);
        const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
            const albums = fs.readdirSync(fullPath)
            const filteredAlbums = albums.filter(elem => elem !== ignoreFile)
            json = {
                name: artistName,
                image: imageData,
                // albums: new Array()
            }
            jsonArray.push(json)
        }
    }))
    return jsonArray
}

function getArtistImage(artistName) {
    const url = './images/' + artistName + '/Artist.jpeg'
    const imageData = fs.readFileSync(url)
    return imageData.toString('base64');
}

function findResources(dir) {
    const filenames = fs.readdirSync(dir);
    const filteredFiles = filenames.filter(elem => elem !== ignoreFile)
  
    filteredFiles.forEach((filename) => {
      const fullPath = path.join(dir, filename);
  
      const stats = fs.statSync(fullPath);
  
      if (stats.isFile()) {
          fullPathArray.push(fullPath)
      } else if (stats.isDirectory()) {
          console.log(`this is directory`)
          findResources(fullPath);
      }
    });
  
    return fullPathArray
}

const parseFile = async (path) => {
    return parsedFile =
    await mm.parseFile(path, {native: false})
        .then(metadata => {
        return metadata
    })
    .catch(err => {
        console.log(err)
    })
}

module.exports = {
    getArtistList,
    getAlbumList,
    getSelectedTrack,
    // getArtistImage
}