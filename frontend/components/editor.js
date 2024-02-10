import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';


const CodeEditor = () => {
  const [editorContent, setEditorContent] = useState(`// Start typing your code here...
  import { NearBindgen, near, call, view } from 'near-sdk-js';
  
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
    axios.post('http://localhost:3001/run-file')
      .then(response => {
        console.log('File executed successfully:', response.data);
        alert('File executed successfully!');
      })
      .catch(error => {
        console.error('Error executing file:', error);
        alert('Error executing file. Please try again.');
      });
  };
  
  return (
    <div>
    <button onClick={handleSave} type='submit' >Build</button>
    <button onClick={handleRunFile} type='submit' >Deploy</button>
      <MonacoEditor
        width="600"
        height="400"
        language="javascript"
        theme="vs-dark"
        value={editorContent}
        onChange={handleChange}
        options={{
          automaticLayout: true, // automatically adjust the editor's layout
          minimap: {
            enabled: false // disable the minimap
          },
          renderIndentGuides: true, // render indent guides
          renderLineHighlight: 'all', // highlight the entire line
          renderWhitespace: 'boundary', // highlight whitespace only at the beginning and end of lines
          contextmenu: false, // disable the context menu
          wordWrap: 'on', // enable word wrapping
          scrollBeyondLastLine: false, // do not allow scrolling beyond the last line
          highlightActiveIndentGuide: true, // highlight the active indent guide
          matchBrackets: 'always', // always highlight matching brackets
          fontFamily: 'Consolas, "Courier New", monospace' // set font family
        }}
      />
      
    </div>
  );
};

export default CodeEditor;
