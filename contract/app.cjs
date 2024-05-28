// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = express();
const PORT = 3001;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next();
});

app.use(bodyParser.json()); 
app.use(bodyParser.text());
app.use(express.static('../frontend/views'));


app.post('/user', (req, res) => {
  const content = req.body;
  console.log(content)
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


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        result += characters.charAt(randomIndex);
    }
    return result.toLowerCase();
}


app.post('/run-file', (req, res) => {
  // Execute the JavaScript file using Node.js
  const account_id = req.body;
  
  const account_contract = generateRandomString(10) + account_id;
  
  exec(`near create-account ${account_contract} --useFaucet`)
    .then(() => {
      exec(`near deploy ${account_contract} build/contract.wasm`)
      .then(({stdout, stderr}) => {
        const info = stdout.split(' ');
        let data = [{
          Account_id: account_id,
          ContractName: info[4].replaceAll("\nDone", ''),
          Trasaction_id: info[9].replaceAll("\nOpen", ''),
          Trasaction_info: info[info.length - 1].replaceAll("\n", '')
        }];
        res.json(data)
    })  
  })
    .catch(error => {
      console.error('Error executing file:', error);
      res.status(500).send('Error executing file');
    });
  
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views', 'index.html' ))
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
