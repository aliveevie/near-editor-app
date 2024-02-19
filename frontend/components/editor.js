import React, { useState } from 'react';

import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import './editor.css'


const CodeEditor = ({ account_id }) => {
  const [editorContent, setEditorContent] = useState(`import { NearBindgen, near, call, view } from 'near-sdk-js';

  @NearBindgen({})
  class HelloNear {
    greeting: string = "Hello";
  
    @view // This method is read-only and can be called for free
    get_greeting(): string {
      return this.greeting;
    }
  
    @call // This method changes the state, for which it cost gas
    set_greeting({ message }: { message: string }): void {
      // Record a log permanently to the blockchain!
      near.log(\`Saving greeting \${message}\`);
      this.greeting = message;
    }
  }
  `);

  const [output, setOutput] = useState("");

  

  const handleChange = (value, event) => {
    setEditorContent(value);
  };

  const handleSave = () => {
    axios.post('http://localhost:3001/user', editorContent, {
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
       <p>{output}</p>
      </div>
      <div className="result" >
          
      </div>
</div>
     
</div>

    
  );
};

export default CodeEditor;
