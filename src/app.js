const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/uploads', upload.single('upload'), (req, res) => {
  let filePath = path.join(__dirname, '../', req.file.path);


});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
