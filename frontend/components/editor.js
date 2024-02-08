import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';


const CodeEditor = () => {
  const [editorContent, setEditorContent] = useState("// Start typing your code here...");

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
