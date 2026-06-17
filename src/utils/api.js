/**
 * API Client — v1.1
 *
 * Session ID lifecycle:
 *   • Created by the backend on POST /upload and returned in response.data.data.sessionId
 *   • Stored in sessionStorage (survives page refresh, cleared on tab close)
 *   • Sent as X-Session-ID header on every subsequent request
 *   • The backend uses it to load/save state from disk or Redis
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Session ID helpers ────────────────────────────────────────────────────────

export const getSessionId  = () => sessionStorage.getItem("txn_session_id");
export const setSessionId  = (id) => sessionStorage.setItem("txn_session_id", id);
export const clearSessionId = () => sessionStorage.removeItem("txn_session_id");

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 120_000,   // 2 min for large files
});

// Attach session ID to every outgoing request
api.interceptors.request.use((config) => {
  const sid = getSessionId();
  if (sid) config.headers["X-Session-ID"] = sid;
  return config;
});

// Unwrap error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// ── API methods ───────────────────────────────────────────────────────────────

export const uploadFile = (formData, onProgress) =>
  api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      const pct = Math.round((e.loaded * 100) / (e.total || 1));
      onProgress?.(pct);
    },
  });

export const validateData = () => api.post("/validate");

export const chunkData = (chunkSize) => api.post("/chunk", { chunkSize });

/** Download URLs include sessionId as a query param (no JS needed — direct <a href>) */
export const downloadCleanUrl  = () =>
  `${BASE_URL}/api/download/clean?sessionId=${getSessionId()}`;

export const downloadErrorsUrl = () =>
  `${BASE_URL}/api/download/errors?sessionId=${getSessionId()}`;

/**
 * Download ALL rows (valid + invalid) with an extra `validation_errors` column.
 * Valid rows have an empty validation_errors cell; invalid rows show the error reasons.
 */
export const downloadAnnotatedUrl = () =>
  `${BASE_URL}/api/download/annotated?sessionId=${getSessionId()}`;

export const downloadChunkUrl  = (filename) =>
  `${BASE_URL}/api/download/chunk/${filename}?sessionId=${getSessionId()}`;

export default api;
