const { clipboard } = require('electron');

const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
const dropArea = document.getElementById('drop-area');
const checkBox = document.querySelector('[type="checkbox"]');


function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let [file] = dt.files;
  uploadFile(files);
}

function uploadFile(file) {
  const url = 'http://localhost:3000/convert';
  const formData = new FormData();


  const options = {
    deskewImage: checkBox.checked
  };

  formData.append('upload', file);
  formData.append('options', JSON.stringify(options));

  return fetch(url, {
    method: 'POST',
    body: formData,
  })
  .then((resp) => resp.text())
  .then((text) => {
      const textArea = document.getElementById('converted-text');
      textArea.value = text;
      textArea.select();
      return text;
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

const copyButton = document.getElementById('clipboard');
copyButton.addEventListener('click', () => {

  const img = clipboard.readImage();
  const file = new File([img.toPNG()], 'image', { type: 'image/png' });
  uploadFile(file)
    .then((text) => {
      clipboard.writeText(text);
    });
});
