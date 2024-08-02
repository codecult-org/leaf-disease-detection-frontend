import React, { useState } from 'react'
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/checking', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data)
      console.log('File uploaded successfully:', response.data, response); // for testing

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input name='file' type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
      <div>
        <p>disease: {JSON.stringify(data, null, 2)}</p>
      </div>
    </>
  )
}

export default App;
