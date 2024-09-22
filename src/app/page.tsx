'use client';
import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';
import { ImagePicker } from './ImagePicker';
import Image from 'next/image';
import { LineWave , MutatingDots} from 'react-loader-spinner';


interface ApiResponse {
  disease: string; // Replace with actual structure returned by your API
}

function Component() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Updated to handle null

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

    try {
      const response = await axios.post<ApiResponse>(process.env.API as string, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
      console.log('File uploaded successfully:', response.data, response);
    } catch (error) {
      setError(error as AxiosError);
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] mt-20 p-5">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <ImagePicker file={file} setFile={setFile} setImageSrc={setImageSrc} imageSrc={imageSrc} />
          </div>
          <div className="flex m-5 justify-center">
            <button type="submit" className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-0 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50">
        Detect
      </button>
          </div>
        </form>
      </div>
      <div className="flex justify-evenly">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Image Preview:</h4>
            
          {imageSrc ? ( 
            <div className="overflow-hidden rounded-lg">
            <Image src={imageSrc} alt="Selected" width={250} height={250} />
            </div>
          ) : (<LineWave
  visible={true}
  height="100"
  width="100"
  color="#4fa94d"
  ariaLabel="line-wave-loading"
  wrapperStyle={{}}
  wrapperClass=""
  firstLineColor=""
  middleLineColor=""
  lastLineColor=""
  />)}
        </div>
        <div>
        <h4 className="text-lg font-semibold text-white mb-2">Result here:</h4>
          {loading ? <MutatingDots
  visible={true}
  height="100"
  width="100"
  color="#4fa94d"
  secondaryColor="#4fa94d"
  radius="12.5"
  ariaLabel="mutating-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  /> :
            error ? <p className="text-lg font-medium text-red-500 mb-2">Error: {error.message}</p> :
            data ? <p>Result: {JSON.stringify(data, null, 2)}</p> :
            (<LineWave
  visible={true}
  height="100"
  width="100"
  color="#4fa94d"
  ariaLabel="line-wave-loading"
  wrapperStyle={{}}
  wrapperClass=""
  firstLineColor=""
  middleLineColor=""
  lastLineColor=""
  />)
          }
        </div>
      </div>
    </main>
  );
}

export default Component;
