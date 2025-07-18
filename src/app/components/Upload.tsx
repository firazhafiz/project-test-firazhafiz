"use client";

import { useState, useRef, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Upload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isOpen]);

  const handleUploadClick = () => {
    setIsOpen(true);
    setMessage(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = selectedFile;

    if (!file) {
      setMessage("No file selected");
      return;
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.type)) {
      setMessage(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
      );
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`Image uploaded successfully. New URL: ${result.url}`);
        setUploadedUrl(result.url);
        window.dispatchEvent(new Event("banner-updated"));
        let timeoutId: NodeJS.Timeout | null = null;
        const handleBannerDone = () => {
          setIsLoading(false);
          setIsOpen(false);
          setSelectedFile(null);
          window.removeEventListener("banner-updated-done", handleBannerDone);
          if (timeoutId) clearTimeout(timeoutId);
          router.refresh();
        };
        window.addEventListener("banner-updated-done", handleBannerDone);
        timeoutId = setTimeout(() => {
          setIsLoading(false);
          setIsOpen(false);
          setSelectedFile(null);
          window.removeEventListener("banner-updated-done", handleBannerDone);
          router.refresh();
        }, 5000);
      } else {
        setIsLoading(false);
        setMessage(`Error: ${result.error}`);
        setUploadedUrl(null);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage("Failed to upload file");
      setUploadedUrl(null);
      console.error("Upload error:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleUploadClick}
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none z-50"
        aria-label="Upload Banner Image"
      >
        <FaUpload size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] relative">
            <h2 className="text-xl text-slate-700 font-bold mb-4">
              Upload Banner Image
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                id="fileInput"
                accept="image/jpeg,image/png,image/jpg"
                className="mb-4 text-slate-700"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFile(null);
                    setMessage(null);
                  }}
                  className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
            {!isLoading && message && (
              <div className="mt-2 text-sm text-center text-green-600">
                <p>{message}</p>
                {message.startsWith("Image uploaded successfully") &&
                  uploadedUrl && (
                    <Image
                      src={uploadedUrl}
                      alt="Uploaded banner preview"
                      width={320}
                      height={160}
                      className="mt-2 mx-auto rounded shadow max-h-40 object-contain"
                    />
                  )}
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                <svg
                  className="animate-spin h-8 w-8 text-orange-500 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <span className="text-orange-500 font-semibold">
                  Uploading & updating banner...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
