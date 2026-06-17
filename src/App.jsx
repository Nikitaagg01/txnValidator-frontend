import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  // Global state shared between pages
  const [uploadData, setUploadData] = useState(null);
  const [validationData, setValidationData] = useState(null);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <UploadPage
              uploadData={uploadData}
              setUploadData={setUploadData}
              setValidationData={setValidationData}
            />
          }
        />
        <Route
          path="/results"
          element={
            validationData ? (
              <ResultsPage
                validationData={validationData}
                uploadData={uploadData}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
