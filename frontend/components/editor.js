import React, { useState } from 'react';

import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import './editor.css';
import { Builder, Success, Deploy, Error } from './loader';
import success from '../assets/success.gif';
import deploy from '../assets/deploy.gif';
import erro from '../assets/error.gif';
import builder from '../assets/builder.gif';

const CodeEditor = ({ account_id }) => {
  const [editorContent, setEditorContent] = useState(`import { NearBindgen, near, call, view } from 'near-sdk-js';
  // Write Your Smart Contract Here
  
  `);

  const [output, setOutput] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editor, setEditor] = useState(false);
  const [source, setSource] = useState('');
  const [text, setText] = useState('');
  const [active, setActive] = useState(false);
  

  
  const handleChange = (value, event) => {
        setEditorContent(value);
  };

  const handleSave = () => {

    setShowBuilder(true);
    setText("Building Your Contract");
    setSource(builder);
    
    axios.post('http://localhost:3001/user', editorContent, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      setSource(success);
      setText("Success");
      setActive(true);
      setTimeout(() => {
          setShowBuilder(false);
        }, 5000) 
    })
    .catch(error => {
      console.error('Error saving file:', error);
        setSource(erro);
        setText("UnExpected Error try again");
        setTimeout(() => {
          setShowBuilder(false);
        }, 5000);
    });
  };

  const handleRunFile = () => {
   
    setShowBuilder(true);
    setText("Deploying your Contract");
    setSource(deploy);
    // Send a POST request to the backend endpoint to run the file
    axios.post('http://localhost:3001/run-file', account_id, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response => {
        setOutput(response.data)
        setSource(success);
        setText("Deployed");
        setTimeout(() => {
            setShowBuilder(false);
         
          }, 5000) 
      })
      .catch(error => {
        setSource(erro);
        setText("Deploy Failed, Unexpected Error Try again");
        setTimeout(() => {
          setShowBuilder(false);
         
        }, 5000);
      });
  };

  return (
        <>
       <div className='container-class'>
  <div className='builder-container'>
    {showBuilder && <Builder source={source} text={text} />}
  </div>

  <div className='editor'>
    <div className='buttons'>
      <button onClick={handleSave} type='submit'>Build</button>
      <button
        onClick={handleRunFile}
        type='submit'
        disabled={!active}
        className={active ? '' : 'disabled'}
      >
        {active ? 'Deploy' : 'Deploy (Disabled)'}
      </button>
    </div>
  
    <Editor 
      height="70vh"
      width={800}
      defaultLanguage="typescript" 
      defaultValue={editorContent}
      onChange={handleChange}
      theme='vs-dark'
    />

    <div className='output'>
      <h3>Output</h3>
      <div className='console'>
        {output.map((data, key) => (
          <div key={key}>
            <p><strong>Account ID:</strong> {data.Account_id}</p>
            <p><strong>Contract Name:</strong> {data.ContractName}</p>
            <p><strong>Transaction ID:</strong> {data.Trasaction_id}</p>
            <p><strong>Transaction Info:</strong> <a href={data.Transaction_info} target='_blank'>{data.Transaction_info}</a></p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

       
        </>
  );
};

export default CodeEditor;
