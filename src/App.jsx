import React, { useState } from 'react'
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // create a URL for the image and set it as the source for the image
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageSrc(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(import.meta.env.API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data)
      console.log('File uploaded successfully:', response.data, response); // for testing

    } catch (error) {
      setError(error);
      console.error('Error uploading file:', error); // for testing
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div style={{ border: '1px solid grey' }}>
          <h4>Upload the photo of plant leaf: </h4>
          <div style={{ border: '1px solid grey', padding: '4px' }}>
            <form onSubmit={handleSubmit}>
              <input name='file' type="file" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>
        <div>
          <h4>Uploaded Image Preview: </h4>
          {imageSrc && <img src={imageSrc} alt="Selected" style={{ width: '100%' }} />}
        </div>
      </div>
      <div style={{ border: '1px solid grey' }}>
        {
          loading ? <p>Disease detection: Loading...</p> :
            error ? <p>Error: {error.message}</p> : <p>Disease detected : {JSON.stringify(data, null, 2)}</p>
        }
      </div>
    </>
  )
}

export default App;
