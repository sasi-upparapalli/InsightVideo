const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const auth = require("../middleware/auth");
const Video = require("../models/Video");

// ---------- Multer setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------- Upload video ----------
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  const video = await Video.create({
    filename: req.file.filename,
    owner: req.user.id,
    status: "processing",
    sensitivity: "pending"
  });

  // start async processing
  require("../utils/processor")(req.io, video._id);

  res.json(video);
});

// ---------- List videos ----------
router.get("/", auth, async (req, res) => {
  const videos = await Video.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(videos);
});
router.delete("/:id", auth, async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) return res.status(404).json({ message: "Not found" });

  // Only owner or admin can delete
  if (
    video.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const filePath = path.join(__dirname, "../uploads", video.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await video.deleteOne();
  res.json({ message: "Video deleted" });
});
// ---------- Stream video (NO auth here) ----------
router.get("/stream/:filename", (req, res) => {
  const videoPath = path.join(__dirname, "../uploads", req.params.filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    });

    fs.createReadStream(videoPath).pipe(res);
  }
});

module.exports = router;
