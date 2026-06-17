import React, { useState } from "react";
import { chunkData, downloadChunkUrl } from "../utils/api";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

const CHUNK_SIZES = [1000, 5000, 10000];

export default function ChunkDownloader({ hasValidData }) {
  const [selectedSize, setSelectedSize] = useState(1000);
  const [loading, setLoading]   = useState(false);
  const [chunks, setChunks]     = useState([]);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleChunk = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setChunks([]);

    try {
      const res = await chunkData(selectedSize);
      setChunks(res.data.data.chunks);
      setSuccess(
        `Split into ${res.data.data.total_chunks} chunk(s) · ${selectedSize.toLocaleString()} rows each.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error   && <Alert type="error"   message={error}   onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} />}

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-400">Rows per chunk:</span>
        {CHUNK_SIZES.map((size) => (
          <button key={size} onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
              selectedSize === size
                ? "bg-brand-600/20 border-brand-600/40 text-brand-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
            }`}>
            {size.toLocaleString()}
          </button>
        ))}
        <button onClick={handleChunk} disabled={loading || !hasValidData} className="btn-primary ml-auto">
          {loading ? "Splitting…" : "Split & Generate"}
        </button>
      </div>

      {loading && <LoadingSpinner label="Generating chunks…" />}

      {chunks.length > 0 && (
        <div className="space-y-2 mt-2">
          {chunks.map((chunk) => (
            <div key={chunk.chunk_number}
              className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-medium text-slate-200">{chunk.filename}</p>
                  <p className="text-xs text-slate-500">{chunk.row_count.toLocaleString()} rows</p>
                </div>
              </div>
              <a href={downloadChunkUrl(chunk.filename)} download={chunk.filename}
                 className="btn-secondary text-xs px-3 py-1.5">
                ↓ Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
