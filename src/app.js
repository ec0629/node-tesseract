const express = require('express');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const { spawn } = require('child_process');

const storage = multer.diskStorage({
  destination: 'tmp/',
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, next) => {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next(new Error('Only image filetypes can be uploaded.'), false);
    }
  }
 });

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', upload.single('upload'), (req, res) => {
  const filePath = path.join(__dirname, '../', req.file.path);

  const options = JSON.parse(req.body.options);

  const preProcessingPromise = options.deskewImage
    ? deskewImage(filePath)
    : Promise.resolve();

  preProcessingPromise
    .then(() => {
      return convertImageToText(filePath);
    })
    .then(data => {
      res.send(data);
      deleteImage(filePath);
    })
    .catch((err) => {
      console.log('Error:', err);
    });
});

function deleteImage (filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(`Unable to delete ${filePath}`, err);
    }
  });
}

function deskewImage (filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [
      'src/python/correct_skew.py',
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
    child.stderr.on('data', (data) => {
      console.log('Error:', data.toString('utf-8'));
    });
    child.stdout.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(`Unable to convert image ${filePath} to text.`);
      }
    })
  });
}

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
