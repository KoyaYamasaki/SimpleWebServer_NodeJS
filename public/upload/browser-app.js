const url = '/upload'
const fileFormDOM = document.querySelector('.file-form')

const tracksInputDOM = document.querySelector('#import-tracks')

const resultDOM = document.getElementById('result')
let importTracks = new Array();


tracksInputDOM.addEventListener('change', async (e)=>{
  const result = await getAlbumInfo(e.target.files[0])
  // const elem = document.createElement('div');
  // elem.classList.add('result-container');
  resultDOM.innerHTML = `
      <div class="info-container">
        <p class="album-artist">${result.data.artist}</p>
        <img class="artwork img" src=data:image/png;base64,${result.data.artistImage}>
      </div>
      <div class="info-container">
        <p class="album-title">${result.data.album}</p>
        <img class="artwork img" src=data:image/png;base64,${result.data.albumImage}>
      </div>
  `;

  const result_title = document.querySelector('.result-title')
  result_title.classList.add('show');

  // resultDOM.appendChild(elem);
  // console.log(result.data)
  showAlbumList(e)
})

function showAlbumList(event) {
  const listContainer = document.createElement('div');
  listContainer.classList.add('album-list-container');

  var listContent = document.createElement("ul");
  listContent.innerText = "Album List"
  const files = event.target.files

  for (var i=0; i<files.length; i++) {
    if (files[i].name !== ".DS_Store") {
      var item = document.createElement("li");
      item.innerHTML = files[i].name;
      importTracks.push(files[i])
      listContent.appendChild(item);
    }
  };

  console.log(importTracks)
  listContainer.appendChild(listContent);
  resultDOM.appendChild(listContainer);
}

fileFormDOM.addEventListener('submit',async (e)=>{
e.preventDefault()
console.log(e.target.files)
//  const imageFile = e.target.files[0];
//  const formData = new FormData();
 let ary = e.target.files
 for (var i=0; i<ary.length; i++) {
  // formData.append('image', ary[i])
   const formData = new FormData();
  formData.append('image', ary[i])

  postSingleFile(formData)
 }
})

function getAlbumInfo(file) {
  console.log(file)
  const formData = new FormData();
  formData.append('track', file)
  return axios.post(`${url}/getInfo`, formData, {
    headers: {
      'Content-Type':'multipart/form-data'
     }    
  })
}

function postSingleFile(formData) {
  try {
    axios.post(`${url}/uploads`, formData, {
     headers: {
      'Content-Type':'multipart/form-data'
     }
    })
    console.log("After uploads")
    // imageValue = src
   } catch (error) {
    //  imageValue = null
    console.log(error);
   }
}