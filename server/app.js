const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const cors = require('cors');

const storage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
  const isPhoto = file.mimetype.startsWith('image/');
  if (isPhoto) {
    next(null, true);
  } else {
    next(new Error('Only image filetypes can be uploaded.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const app = express();

const PORT = 3000;

function stripWhitespaceAndNewlines(text = '') {
  return text.trim().replace(/\n/g, ' ');
}

function convertBufferToText(imgBuffer) {
  return new Promise((resolve, reject) => {
    const child = spawn('tesseract', ['stdin', 'stdout']);
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
    });
    child.stdin.write(imgBuffer);
    child.stdin.end();
  });
}

app.post('/convert', cors(), upload.single('upload'), async ({ file }, res) => {
  try {
    const convertedText = await convertBufferToText(file.buffer);
    res.send(stripWhitespaceAndNewlines(convertedText));
  } catch (err) {
    console.log('Error:', err);
  }
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
