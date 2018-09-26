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
  let filePath = path.join(__dirname, '../', req.file.path);

  const child = spawn('tesseract', [filePath, 'stdout']);
  child.stdout.on('data', (data) => {
    res.send(data);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(`Unable to delete ${filePath}`, err);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
