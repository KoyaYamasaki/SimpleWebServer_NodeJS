const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
// const album_playBtn = document.getElementByClass('album-play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('song-title');
const cover = document.getElementById('cover');

var selectedAlbum = {}

// Song titles
const songs = ['hey', 'summer', 'ukulele'];

// Keep track of song
let songIndex = 0;


// Update song details
function loadSong() {
    title.innerText = selectedAlbum.songs[songIndex].title;
    audio.src = selectedAlbum.songs[songIndex].uri;
    cover.src = `data:image/png;base64,${selectedAlbum.image}`
}

// Play song
function playSong() {
  if (!musicContainer.classList.contains('show')) {
    musicContainer.classList.add('show')
  }
    
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

//   album_playBtn.querySelector('i.fas').classList.remove('fa-play');
//   album_playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

//   album_playBtn.querySelector('i.fas').classList.add('fa-play');
//   album_playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = selectedAlbum.songs.length - 1;
  }

  loadSong();

  playSong();
}

// Next song
function nextSong() {
  songIndex++;
  console.log(`songIndex:`, songIndex)
  console.log(`songs.length:`, selectedAlbum.songs.length)
  if (songIndex > selectedAlbum.songs.length - 1) {
    console.log(`songIndex > songs.length - 1`)
    songIndex = 0;
  }

  loadSong();

  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);
