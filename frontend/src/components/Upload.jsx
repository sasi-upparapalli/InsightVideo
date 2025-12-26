import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("Uploading...");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", file);

    await axios.post("http://localhost:5000/api/videos/upload", formData, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percent);
      }
    });

    setStatus("Upload complete. Processing started...");
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="file" accept="video/*" onChange={handleUpload} />

      {uploadProgress > 0 && (
        <div style={{ marginTop: "10px" }}>
          <p>Upload Progress: {uploadProgress}%</p>
          <div
            style={{
              height: "8px",
              background: "#1e293b",
              borderRadius: "6px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#6366f1"
              }}
            />
          </div>
        </div>
      )}

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
}
