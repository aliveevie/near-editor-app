// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// const { exec } = require('child_process');
const { error } = require('console');
const { stderr } = require('process');

const seed = require('near-seed-phrase').generateSeedPhrase();


const util = require('util');

const exec = util.promisify(require('child_process').exec);

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

  fs.writeFile(filePath, content, (err, stdout) => {
    if (err) {
      console.error('Error saving file:', err);
      res.status(500).send('Error saving file');
    } else {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing file:', error);
          res.status(500).send('Error executing file');
        } else {
          console.log(stdout)
          console.log('Contract Build successfully');
          res.send('Contract Build successfully');
        }
      })
    }
  });
});



app.post('/run-file', (req, res) => {
  // Execute the JavaScript file using Node.js
  const account_id = req.body;
  
  const account_contract = 'smart_contract' + account_id;
  
  exec(`mkdir -p neardev`)
    .then(({ stdout, stderr }) => {
      const dev1_path = path.join(__dirname, 'neardev', 'dev-account')
      const dev_path = path.join(__dirname, 'neardev', 'dev-account.env')
      console.log('Directory Created Successifully'); 
      fs.writeFile(dev1_path, account_id, (err, stdout) => {
          if(err){
            console.log(err)
            res.status(500).send('Error Saving File')
          }else{
            console.log('Contract text file Created Successifully')
          
          }
      })

      fs.writeFile(dev_path, account_id, (err, stdout) => {
        if(err){
          console.log(err)
          res.status(500).send('Error Saving File')
        }else{
          console.log('Contract .env file Created Successifully')
          
        }
    })    
    })
      exec(`near dev-deploy --wasmFile build/contract.wasm --initFunction new --initArgs 
      '{"owner_id": "${account_id}", "total_supply": "10000000"}'`)
      .then(({stdout, stderr}) => {
        console.log("Contract Created Deployed")
        res.json(stdout)
     
  })
    .catch(error => {
      console.error('Error executing file:', error);
      res.status(500).send('Error executing file');
    });
  
 /*
 *exec(`near deploy ${account_id} build/contract.wasm`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing file:', error);
      res.status(500).send('Error executing file');
    } else {
      console.log(stdout)
      console.log('File executed successfully');
      res.send('File executed successfully');
    }
  });
 *
 */ 
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
