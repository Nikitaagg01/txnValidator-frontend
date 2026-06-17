import React, { useRef, useState } from "react";

export default function FileDropzone({ onFileSelect, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-200 group select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          dragging
            ? "border-brand-500 bg-brand-600/10 scale-[1.01]"
            : "border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 ${
          dragging ? "bg-brand-600/30 scale-110" : "bg-slate-800 group-hover:bg-slate-700"
        }`}
      >
        <svg
          className={`w-7 h-7 transition-colors duration-200 ${
            dragging ? "text-brand-400" : "text-slate-500 group-hover:text-slate-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <p className="text-sm font-medium text-slate-300 mb-1">
        {dragging ? "Drop your file here" : "Drag & drop your CSV file"}
      </p>
      <p className="text-xs text-slate-500">
        or <span className="text-brand-400 font-medium">browse files</span> · CSV only · up to 100MB
      </p>
    </div>
  );
}
