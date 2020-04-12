const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');

const storage = multer.diskStorage({
  destination: 'tmp/',
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
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

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

function stripWhitespaceAndNewlines(text = '') {
  return text.trim().replace(/\n/g, ' ');
}

function deleteImage(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(`Unable to delete ${filePath}`, err);
    }
  });
}

function convertImageToText(filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('tesseract', [filePath, 'stdout']);
    child.stdout.on('data', (data) => {
      resolve(data.toString('utf-8'));
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', upload.single('upload'), (req, res) => {
  const filePath = path.join(__dirname, '../', req.file.path);

  convertImageToText(filePath)
    .then(convertedText => {
      res.send(stripWhitespaceAndNewlines(convertedText));
      deleteImage(filePath);
    })
    .catch((err) => {
      console.log('Error:', err);
    });
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
