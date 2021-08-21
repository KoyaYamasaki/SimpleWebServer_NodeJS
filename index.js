const express     = require('express');
const app         = express();
const fs          = require('fs');
const path = require('path');
const mm = require(`music-metadata`)
var fullPathArray = Array()

app.listen(3005, function() {
    console.log("[NodeJS] Application Listening on Port 3005");
});

const parseFile = async (path) => {
    return parsedFile =
    await mm.parseFile(path, {native: false})
        .then(metadata => {
        // console.log("metadata", metadata)
        // console.log(metadata.common.artist)
        let jsonData = {
            track: metadata.common.track[`no`],
            artist: metadata.common.artist,
            title: metadata.common.title,
            album: metadata.common.album,
            duration: metadata.format.duration,
            codec: metadata.format.codec,
            uri: path,
            trackInfo: metadata.format.trackInfo,
            // image: metadata.common.picture
        }
        return jsonData
    })
    .catch(err => {
        console.log(err)
    })
}

function findResources(dir) {
  const filenames = fs.readdirSync(dir);

  filenames.forEach((filename) => {
    const fullPath = path.join(dir, filename);
    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
        console.log("fullPath", fullPath);
        fullPathArray.push(fullPath)
    } else if (stats.isDirectory()) {
        console.log(`this is directory`)
        findResources(fullPath);
    }
  });

  return fullPathArray
}

app.get(`/list`, (req, res) => {
    const dir = process.cwd();
    const fullPathArrray = findResources(dir + "/tracks");

    var parseFileArray = Array()
    fullPathArrray.forEach((path) => {
        parseFileArray.push(parseFile(path))
    })
    Promise.all(parseFileArray).then((data) => {
        console.log("data", data)
        res.json(data)
        res.end()
    })
})

app.get('/', (req, res) => {
    var key = req.params.key;

    var music = `tracks/Shakermaker.m4a`;

    var stat = fs.statSync(music);
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

        readStream = fs.createReadStream(music, {start: start, end: end});
    } else {
        console.log("range is defined")
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        console.log("size", stat.size)
        readStream = fs.createReadStream(music);
    }
    readStream.pipe(res);
});