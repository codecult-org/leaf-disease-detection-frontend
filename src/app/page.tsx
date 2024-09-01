'use client'
import React, { useState } from 'react'
import axios from 'axios';
import './App.css';
import {ImagePicker} from './ImagePicker'
import Image from 'next/image'

function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    //import.meta.env.API
    try {
      const response = await axios.post("https://leaf-serveit.debsen.co/checking", formData, {
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
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] mt-20">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <ImagePicker file={file} setFile={setFile} setImageSrc={setImageSrc} imageSrc={imageSrc}/>
            </div>
            <div className="flex m-5 justify-center">
              <button className=" bg-lime-800" type="submit">Detect</button>
            </div>
          </form>
        </div>
      <div className="flex justify-evenly ">
        <div>
          <h4>Uploaded Image Preview: </h4>
          {imageSrc && <Image src={imageSrc} alt="Selected" width={350} height={350}/>}
        </div>
        <div style={{ border: '1px solid grey' }}>
          {
            loading ? <p>Disease detection: Loading...</p> :
            error ? <p>Error: {error.message}</p> : <p>Disease detected : {JSON.stringify(data, null, 2)}</p>
          }
        </div>
      </div>
    </main>
  )
}

export default Component;
