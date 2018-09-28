const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const { spawn } = require('child_process');

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', upload.single('upload'), (req, res) => {
  const filePath = path.join(__dirname, '../', req.file.path);
  const filename = req.file.filename;

  deskewImage(filePath, filename)
    .then(() => {
      return convertImageToText(filePath);
    })
    .then(data => {
      res.send(data);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Unable to delete ${filePath}`, err);
        }
      });
    })
    .catch((err) => {
      console.log('Error:', err);
    });
});

function deskewImage (filePath, filename) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [
      'python/correct_skew.py',
      '--image',
      filePath
    ]);
    child.on('exit', (code, signal) => {
      if(!code) {
        resolve();
      }
    });
    child.stderr.on('data', (data) => {
      reject(data.toString('utf-8'));
    });
  });
}

function convertImageToText (filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('tesseract', [filePath, 'stdout']);
    child.stdout.on('data', (data) => {
      resolve(data);
    });
  });
}

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
