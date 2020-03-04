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
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  // ([...files]).forEach(uploadFile);
  const [file] = files;
  return uploadFile(file);
}

function uploadFile(file) {
  const url = '/convert';
  const formData = new FormData();


  const options = {
    deskewImage: checkBox.checked
  };

  formData.append('upload', file);
  formData.append('options', JSON.stringify(options));

  return axios({
    url,
    method: 'POST',
    data: formData
  })
    .then(({ data: text }) => {
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

  navigator.clipboard.read().then(data => {
    data.forEach((item) => {
      const type = item.types[0];
      if (["image/png", "image/jpeg"].includes(type)) {
        item.getType(type)
          .then((blob) => {
            const file = new File([blob], 'image', { type });
            handleFiles([file])
              .then((text) => {
                if (window.isSecureContext) {
                  navigator.clipboard.writeText(text);
                }
              });
          });

      } else {
        alert('No image data is not available on the clipboard.');
      }
    });
  });
});
