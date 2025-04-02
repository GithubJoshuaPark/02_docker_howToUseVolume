const fs = require('fs').promises;   // Using promises for fs module
const exists = require('fs').exists; // Using the callback version of exists
const path = require('path');        // Using path module for file paths

const express = require('express');  // Using express for server
const bodyParser = require('body-parser'); // Using body-parser for parsing form data

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to serve static files
app.use(express.static('public'));
// Middleware to serve static files from the feedback directory
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();

  const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
  const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

  console.log('Temp file path:', tempFilePath);
  console.log('Final file path:', finalFilePath);
  console.log('Title:', title);
  console.log('Content:', content);

  await fs.writeFile(tempFilePath, content);
  exists(finalFilePath, async (exists) => {
    if (exists) {
      res.redirect('/exists');
    } else {
      //await fs.rename(tempFilePath, finalFilePath);
      // File doesn't exist, copy instead of rename
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath); // Delete the temp file after copying

      // show message box
      console.log('File copied successfully');
      res.redirect('/');
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
