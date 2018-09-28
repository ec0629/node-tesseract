const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
const dropArea = document.getElementById('drop-area');
const checkBox = document.querySelector('[type="checkbox"]');


function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight (e) {
  dropArea.classList.add('highlight');
}

function unhighlight (e) {
  dropArea.classList.remove('highlight');
}

function handleDrop (e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles (files) {
  ([...files]).forEach(uploadFile);
}

function uploadFile (file) {
  const url = '/convert';
  const formData = new FormData();

  const deskewImage = checkBox.checked;
  formData.append('upload', file);
  formData.append('deskewImage', deskewImage);

  axios({
    url,
    method: 'POST',
    data: formData
  })
  .then(response => {
    const textArea = document.getElementById('converted-text');
    textArea.value = response.data;
  })
  .catch(err => console.log(err));
}

events.forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener('drop', handleDrop, false);
