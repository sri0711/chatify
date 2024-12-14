const { exec } = require("node:child_process");
const path = require("path");
const fs = require("fs");

let test = (videoId = "kgioXYYZR74") => {
  // Construct the YouTube URL
  let Uri = "https://www.youtube.com/watch?v=" + videoId;

  // Output file path for the M4A audio
  let outputFile = path.join(__dirname, "/../public/audio.m4a");

  // Full path to yt-dlp binary/script (replace with actual path if needed)
  let ytDlpPath = path.join(__dirname, "yt-dlp"); // or just 'yt-dlp' if it's globally available
  fs.chmodSync(ytDlpPath, "755");

  // Run yt-dlp asynchronously using exec
  const ytDlpProcess = exec(ytDlpPath, [
    "-x",
    "--audio-format", // Download the best audio in M4A format
    "m4a",
    "-o",
    outputFile, // Set the output file path
    Uri, // Video URL
  ]);

  // Handle the output from stdout
  ytDlpProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // Handle the error output from stderr
  ytDlpProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle the completion of the process
  ytDlpProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Download complete! Audio saved as M4A.");
    } else {
      console.error(`yt-dlp process exited with code ${code}`);
    }
  });

  // Optionally handle errors starting the process (e.g., file not found or permission issues)
  ytDlpProcess.on("error", (err) => {
    console.error("Failed to start yt-dlp:", err);
  });
};

// Call the test function with a default video ID
test();
