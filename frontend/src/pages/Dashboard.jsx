import { useEffect, useState } from "react";
import axios from "axios";
import Upload from "../components/Upload";
import VideoCard from "../components/VideoCard";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userRole = jwtDecode(token).role;

  const loadVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos", {
      headers: { Authorization: token }
    });
    setVideos(res.data);
  };

  useEffect(() => {
    loadVideos();
    socket.on("progress", loadVideos);
    socket.on("completed", loadVideos);

    return () => {
      socket.off("progress", loadVideos);
      socket.off("completed", loadVideos);
    };
  }, []);

  const filteredVideos = videos.filter(v =>
    filter === "all" ? true : v.sensitivity === filter
  );

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>

          <h3>Filters</h3>

          <button onClick={() => { setFilter("all"); setSidebarOpen(false); }}>
            All
          </button>
          <button onClick={() => { setFilter("safe"); setSidebarOpen(false); }}>
            Safe
          </button>
          <button onClick={() => { setFilter("flagged"); setSidebarOpen(false); }}>
            Flagged
          </button>

          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className="content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <h1>🎥 Video Processing Dashboard</h1>

          {(userRole === "editor" || userRole === "admin") && (
            <div style={{ maxWidth: "720px", margin: "20px auto" }}>
              <Upload onUploaded={loadVideos} />
            </div>
          )}

          {filteredVideos.map(v => (
            <VideoCard
              key={v._id}
              video={v}
              role={userRole}
              onDelete={loadVideos}
            />
          ))}
        </div>
      </div>
    </>
  );
}
