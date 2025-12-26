import axios from "axios";

export default function VideoCard({ video, role, onDelete }) {
  const deleteVideo = async () => {
    await axios.delete(
      `http://localhost:5000/api/videos/${video._id}`,
      {
        headers: { Authorization: localStorage.getItem("token") }
      }
    );
    onDelete();
  };

  return (
    <div className="video-card">
      <p><strong>Status:</strong> {video.status}</p>
      <p><strong>Sensitivity:</strong> {video.sensitivity}</p>

      {video.status === "processing" && (
        <p style={{ color: "#facc15" }}>⏳ Processing...</p>
      )}

      {video.status === "completed" && (
        <video controls width="100%">
          <source
            src={`http://localhost:5000/api/videos/stream/${video.filename}`}
            type="video/mp4"
          />
        </video>
      )}

      {(role === "editor" || role === "admin") && (
        <button
          onClick={deleteVideo}
          style={{ marginTop: "10px", background: "#dc2626" }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
