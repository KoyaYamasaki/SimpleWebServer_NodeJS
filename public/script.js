const postsContainer = document.getElementById('posts-container')
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
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
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
              <p class="post-title">${album.artist}</p>
              <p class="post-body">${album.title}</p>
            </div>
          </div>
        `;
    
        postsContainer.appendChild(postEl);
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

// Show posts in DOM
async function showPosts() {
  const posts = await getPosts();

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="album-play">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
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

// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}

// Show initial posts
showAlbums()

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

filter.addEventListener('input', filterPosts);
