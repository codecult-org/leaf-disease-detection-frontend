"use client";
import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import "./App.css";
import { ImagePicker } from "./ImagePicker";
import Image from "next/image";
import { LineWave, MutatingDots } from "react-loader-spinner";

interface ApiResponse {
  disease: string;
}

function Component() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Remedy logic
  const [remedy, setRemedy] = useState<string>("");
  const [remedyLoading, setRemedyLoading] = useState<boolean>(false);
  const [remedyError, setRemedyError] = useState<string>("");

  const handleRemedyClick = async () => {
    if (!data) return;
    setRemedy("");
    setRemedyError("");
    setRemedyLoading(true);
    try {
      const res = await axios.post("/api/remedy", { disease: data });
      setRemedy(res.data.remedy);
    } catch {
      setRemedyError("Failed to fetch remedies.");
    } finally {
      setRemedyLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(new Error("No file selected") as AxiosError);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ApiResponse>(
        "https://codecult-leaf-serveit.codecult.tech/checking",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server:", response);
      setData(response.data);
      setRemedy(""); // Reset remedy when new result comes
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] mt-20 p-5 flex flex-col min-h-screen">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <ImagePicker
              file={file}
              setFile={setFile}
              setImageSrc={setImageSrc}
              imageSrc={imageSrc}
            />
          </div>
          <div className="flex m-5 justify-center">
            <button
              type="submit"
              className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-0 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50"
            >
              Detect
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-evenly flex-1">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Image Preview:
          </h4>
          {imageSrc ? (
            <div className="overflow-hidden rounded-lg">
              <Image src={imageSrc} alt="Selected" width={250} height={250} />
            </div>
          ) : (
            <LineWave
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
            />
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Result here:
          </h4>
          {loading ? (
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="#4fa94d"
              secondaryColor="#4fa94d"
              radius="12.5"
              ariaLabel="mutating-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : error ? (
            <p className="text-lg font-medium text-red-500 mb-2">
              Error: {error.message}
            </p>
          ) : data ? (
            <>
              <p>Result: {JSON.stringify(data, null, 2)}</p>
            </>
          ) : (
            <LineWave
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
            />
          )}
        </div>
      </div>
      {/* Remedies Button and Output at the bottom */}
      <div className="flex flex-col items-center mt-8">
        <button
          className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
          onClick={handleRemedyClick}
          disabled={!data || remedyLoading}
        >
          {remedyLoading ? "Fetching AI Remedies..." : "AI Remedies"}
        </button>
        {remedyError && <p className="text-red-400 mt-2">{remedyError}</p>}
        {remedy && (
          <div className="mt-4 p-4 bg-slate-900 rounded-lg text-white max-w-xl">
            <h4 className="font-semibold mb-2">Remedies Generated By Ai:</h4>
            <ol className="list-decimal ml-6 space-y-2">
              {remedy
                .split(/\d+\.\s+/) // Split on "1. ", "2. ", etc.
                .filter(Boolean) // Remove empty strings
                .map((point, idx) => (
                  <li key={idx}>{point.trim()}</li>
                ))}
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}

export default Component;
