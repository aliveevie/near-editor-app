import React, { useState } from 'react';

import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import './editor.css';
import { Loader } from './loader';
import success from '../assets/success.gif';
import deploy from '../assets/deploy.gif';
import error from '../assets/error.gif';
import builder from '../assets/builder.gif';

const CodeEditor = ({ account_id }) => {
  const [editorContent, setEditorContent] = useState(`import { NearBindgen, near, call, view } from 'near-sdk-js';`);

  const [output, setOutput] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editor, setEditor] = useState(false);
  const [source, setSource] = useState('');
  const [text, setText] = useState('');

  
  const handleChange = (value, event) => {
        setEditorContent(value);
  };

  const handleSave = () => {

    setShowBuilder(true);
    setText("Building Your Contract");
    setSource(builder);
    setEditor(true);

    axios.post('http://localhost:3001/user', editorContent, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then(response => {
        setTimeout(() => {
          setSource(success);
          setText("Building Was Success");
        }, 10000)
        setShowBuilder(false);
        setEditor(false);
       
    })
    .catch(error => {
      console.error('Error saving file:', error);
        setSource(error);
        setText("UnExpected Error Occured")
    });
  };

  const handleRunFile = () => {
    // Send a POST request to the backend endpoint to run the file
    axios.post('http://localhost:3001/run-file', account_id, {
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
        <>
         {showBuilder && editor &&  <Loader source={source} text={text} />}

          {!editor  &&  !showBuilder && <div className='editor'>
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

    }
        
        </>
  );
};

export default CodeEditor;
