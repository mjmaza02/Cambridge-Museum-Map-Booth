/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express"); // for some reason, can't use import
const cors = require("cors"); // needed to deal with CORS

// File Storage
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const basePath = "./server/media";

// Storage Engine to save files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = basePath;
    cb(null, uploadDir); // Save to the uploads directory
  },
  filename: function (req, file, cb) {
    // Save the file with its original name
    cb(null, Date.now() + path.extname(file.originalname)); // Filename will include the timestamp to avoid conflicts
  },
});

const upload = multer({ storage: storage });

const app = express();
const PORT = 8080;

app.use(cors()); //to use cors requests
app.use(express.json()); // to use json formating

function getRandomFile(location) {
  const files = fs.readFileSync(path.join(basePath, location));
  // const files = fs.readdirSync(basePath);
  const randInd = Math.floor(Math.random() * files.length);
  return files[randInd];
}

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/play", (req, res) => {
  try {
    const location = res.body.location
    const file = getRandomFile(location);
    const fPath = path.join(basePath, file);
    console.log(fPath)

    res.setHeader("Content-Type", "video/webm");
    const stream = fs.createReadStream(fPath);
    stream.pipe(res);

    stream.on("error", (_) => {
      res.status(500).send("Error streaming file");
    });
  } catch (_) {
    res.status(500).send("Error getting file");
  }
});

app.post("/save", upload.single("file"), (req, res) => {
  res.status(200);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
