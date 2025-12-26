const Video = require("../models/Video");

module.exports = async (io, videoId) => {
  let progress = 0;

  const interval = setInterval(async () => {
    progress += 20;

    io.emit("progress", { videoId, progress });

    if (progress >= 100) {
      const sensitivity = Math.random() > 0.5 ? "safe" : "flagged";

      await Video.findByIdAndUpdate(videoId, {
        status: "completed",
        sensitivity
      });

      io.emit("completed", { videoId, sensitivity });
      clearInterval(interval);
    }
  }, 1000);
};
