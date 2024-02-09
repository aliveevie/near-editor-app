// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers
  next();
});

app.use(bodyParser.json()); // Parse text/plain request body
app.use(bodyParser.text());


// Endpoint to save the JavaScript file
app.post('/user', (req, res) => {
  const content = req.body;

  // Specify the file path where you want to save the file
  const filePath = path.join(__dirname, 'src', 'contract.ts');

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      res.status(500).send('Error saving file');
    } else {
      console.log('File saved successfully');
      res.send('File saved successfully');
    }
  });
});



app.post('/run-file', (req, res) => {
  // Execute the JavaScript file using Node.js
  exec('node client/client.js', (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing file:', error);
      res.status(500).send('Error executing file');
    } else {
      console.log(stdout)
      console.log('File executed successfully');
      res.send('File executed successfully');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
