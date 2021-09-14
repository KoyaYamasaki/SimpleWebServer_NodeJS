const albumList = document.getElementById('album-list')
const loading = document.querySelector('.loader')
const filter = document.getElementById('filter')
var allDatas = new Array()
let limit = 5;
let page = 1;

async function getArtists() {
  const res = await fetch(`./list/`);
  const data = await res.json()
  console.log(data)
  return data;
}

async function showAlbums() {
  const artists = await getArtists();
  var tasks = new Array()
  artists.forEach(artist => {
    tasks.push(getAlbum(`./list/` + artist.name))
  })

  Promise.all(tasks).then(result => {
    console.log(result)
    allDatas = result
    result.forEach((artistAlbums, artistIndex) => {
      artistAlbums.forEach(album => {
        const albumElem = document.createElement('div');
        albumElem.classList.add('single-album');
        albumElem.innerHTML = `
          <div class="album-container">
            <div class="artwork-wrapper">
              <img class="artwork" src=data:image/png;base64,${album.image}>
            </div>
            <div class="play-button-wrapper">
              <button id="${artistIndex}-${album.title}" class="album-play" value="${album.title}" onclick="prepareAudio(this.id)">
                <i class="fas fa-play"></i>
              </button>
            </div>
            <div class="album-info">
              <p class="album-artist">${album.artist}</p>
              <p class="album-title">${album.title}</p>
            </div>
          </div>
        `;
    
        albumList.appendChild(albumElem);
      })
    })

  })
}

function prepareAudio(id) {
  console.log("id: ", id)
  const albumId = id.split('-');

  const targetAlbum = allDatas[albumId[0]].filter(albums => {
    return albums.title === albumId[1]
  })
  console.log(targetAlbum)
  selectedAlbum = targetAlbum[0]
  console.log(selectedAlbum)
  const isPlaying = musicContainer.classList.contains('play');
  let albumBtn = document.getElementById(id)
  if (isPlaying) {
    // albumBtn.querySelector('i.fas').classList.add('fa-play');
    // albumBtn.querySelector('i.fas').classList.remove('fa-pause');

    pauseSong();
  } else {
    // albumBtn.querySelector('i.fas').classList.remove('fa-play');
    // albumBtn.querySelector('i.fas').classList.add('fa-pause');
    
    loadSong();
    playSong();
  }
}

const getAlbum = async (path) => {
  return result =
  await fetch(path).then(data => {
    return data.json()
  })
}

// Show loader & fetch more posts
function showLoading() {
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      page++;
      // showAlbums();
    }, 300);
  }, 1000);
}

// Filter albums by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const albumsElem = document.querySelectorAll('.single-album');

  albumsElem.forEach(albumElem => {
    const title = albumElem.querySelector('.album-artist').innerText.toUpperCase();
    const body = albumElem.querySelector('.album-title').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      albumElem.style.display = 'flex';
    } else {
      albumElem.style.display = 'none';
    }
  });
}

// Show initial albums
showAlbums()

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

filter.addEventListener('input', filterPosts);
