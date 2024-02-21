import React, { useState } from 'react';

import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import './editor.css';
import { Loader } from './loader';


const CodeEditor = ({ account_id }) => {
  const [editorContent, setEditorContent] = useState(`import { NearBindgen, near, call, view } from 'near-sdk-js';

  
  `);

  const [output, setOutput] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  
  
  const handleChange = (value, event) => {
    setEditorContent(value);
  };

  const handleSave = () => {
    axios.post('/user', editorContent, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
      console.log(response.data);
      alert('File saved successfully!');
    })
    .catch(error => {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    });
  };

  const handleRunFile = () => {
    // Send a POST request to the backend endpoint to run the file
    axios.post('/run-file', account_id, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response => {
        console.log('File executed successfully:', response.data);
        setOutput(response.data)
        alert('File executed successfully!');
      })
      .catch(error => {
        console.error('Error executing file:', error);
        alert('Error executing file. Please try again.');
      });
  };

  /**
    <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" /></>;
   * 
   */
  
  return (
    <div className='editor'>
    <div className='buttons' >
        <button onClick={handleSave} type='submit' >Build</button>
        <button onClick={handleRunFile} type='submit' >Deploy</button> 
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
        <p><strong>Transaction Info:</strong> <a href={data.Transaction_info} target='_blank' >{data.Transaction_info}</a></p>

      </div>
    ))}
  </div>
</div>


</div>

    
  );
};

export default CodeEditor;
