import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';


const CodeEditor = () => {
  const [editorContent, setEditorContent] = useState("// Start typing your code here...");

  const handleChange = (value, event) => {
    setEditorContent(value);
  };

  const handleSave = () => {
    const userData = {
      firstName: 'Fred',
      lastName: 'Flintstone'
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    };
  
    // Corrected URL: "http://localhost:3001/user"
    fetch('http://localhost:3001/user', requestOptions)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  






  return (
    <div>
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={editorContent}
        onChange={handleChange}
      />
      <button onClick={handleSave} type='submit' >Save as JavaScript File</button>
    </div>
  );
};

export default CodeEditor;
