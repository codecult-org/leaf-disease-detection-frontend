'use client';
import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';
import { ImagePicker } from './ImagePicker';
import Image from 'next/image';

interface ApiResponse {
  disease: string; // Replace with actual structure returned by your API
}

function Component() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(new Error('No file selected') as AxiosError);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);
  //import.meta.env.API
    try {
      const response = await axios.post<ApiResponse>("https://leaf-serveit.debsen.co/checking", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
      console.log('File uploaded successfully:', response.data, response); // for testing
    } catch (error) {
      setError(error as AxiosError);
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] mt-20">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <ImagePicker file={file} setFile={setFile} setImageSrc={setImageSrc} imageSrc={imageSrc} />
          </div>
          <div className="flex m-5 justify-center">
            <button className="bg-lime-800" type="submit">Detect</button>
          </div>
        </form>
      </div>
      <div className="flex justify-evenly">
        <div>
          <h4>Uploaded Image Preview:</h4>
          {imageSrc && <Image src={imageSrc} alt="Selected" width={350} height={350} />}
        </div>
        <div style={{ border: '1px solid grey' }}>
          {loading ? <p>Disease detection: Loading...</p> :
            error ? <p>Error: {error.message}</p> :
            data ? <p>Disease detected: {JSON.stringify(data, null, 2)}</p> :
            <p>No data</p>
          }
        </div>
      </div>
    </main>
  );
}

export default Component;
