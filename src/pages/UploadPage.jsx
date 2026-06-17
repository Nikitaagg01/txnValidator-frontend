import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDropzone from "../components/FileDropzone";
import Alert from "../components/Alert";
import ProgressBar from "../components/ProgressBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { uploadFile, validateData, setSessionId, clearSessionId } from "../utils/api";

export default function UploadPage({ uploadData, setUploadData, setValidationData }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile]   = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [validating, setValidating]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleFileSelect = async (file) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are supported.");
      return;
    }

    setSelectedFile(file);
    setError("");
    setSuccess("");
    setUploadData(null);
    setValidationData(null);
    setUploadProgress(0);
    setUploading(true);

    // Clear any previous session
    clearSessionId();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFile(formData, setUploadProgress);
      const data = res.data.data;

      // ✅ Persist session ID — all future requests carry this automatically
      setSessionId(data.sessionId);

      setUploadData(data);
      setSuccess(
        `File parsed successfully — ${data.total_rows.toLocaleString()} rows detected.`
      );
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    setError("");
    try {
      const res = await validateData();
      setValidationData(res.data.data);
      navigate("/results");
    } catch (err) {
      setError(err.message);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h2 className="text-xl font-semibold text-white">Upload Transaction File</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload a CSV with transaction records. Supported fields: order_id, customer_name,
          phone, country, date, payment_mode, amount.
        </p>
      </div>

      {error   && <Alert type="error"   message={error}   onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} />}

      <FileDropzone onFileSelect={handleFileSelect} disabled={uploading || validating} />

      {uploading && (
        <div className="card p-5 space-y-3">
          <ProgressBar value={uploadProgress} label="Uploading & parsing…" />
        </div>
      )}

      {uploadData && !uploading && (
        <div className="card p-5 space-y-4 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-lg">
                📋
              </div>
              <div>
                <p className="text-sm font-medium text-white">{uploadData.filename}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {uploadData.total_rows.toLocaleString()} rows · {uploadData.columns?.length} columns
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ready
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                session: {uploadData.sessionId?.slice(0, 8)}…
              </span>
            </div>
          </div>

          {/* Detected columns */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Detected columns</p>
            <div className="flex flex-wrap gap-1.5">
              {uploadData.columns?.map((col) => (
                <span key={col} className="badge bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Preview */}
          {uploadData.preview?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-2">Preview (first 5 rows)</p>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-xs">
                  <thead className="bg-slate-800/60">
                    <tr>
                      {uploadData.columns?.map((col) => (
                        <th key={col} className="text-left text-slate-400 font-medium px-3 py-2 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {uploadData.preview.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/20">
                        {uploadData.columns?.map((col) => (
                          <td key={col} className="px-3 py-2 text-slate-400 whitespace-nowrap max-w-[120px] truncate">
                            {row[col] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button onClick={handleValidate} disabled={validating} className="btn-primary flex-1 text-center">
              {validating ? "Running validation…" : "Run Validation →"}
            </button>
            <button
              onClick={() => { setSelectedFile(null); setUploadData(null); setSuccess(""); clearSessionId(); }}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>

          {validating && <LoadingSpinner label="Validating all rows…" />}
        </div>
      )}

      {/* Rules reference */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Validation Rules
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: "Phone — India",     value: "10 digits" },
            { label: "Phone — Singapore", value: "8 digits" },
            { label: "Phone — USA",       value: "10 digits" },
            { label: "Date formats",      value: "YYYY-MM-DD or DD-MM-YYYY" },
            { label: "Payment modes",     value: "UPI, CARD, NETBANKING, COD" },
            { label: "Amount",            value: "Numeric & > 0" },
          ].map((rule) => (
            <div key={rule.label} className="flex justify-between gap-2 bg-slate-800/40 rounded-lg px-3 py-2">
              <span className="text-slate-500">{rule.label}</span>
              <span className="text-slate-300 font-medium text-right">{rule.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
