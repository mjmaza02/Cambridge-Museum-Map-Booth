/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express"); // for some reason, can't use import
const cors = require("cors"); // needed to deal with CORS

// File Storage
const multer = require("multer");
const path = require("path");

// Storage Engine to save files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./server/media";
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

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/save", upload.single("file"), (req, res) => {
  console.log("recieved!");
  console.log(req.file, req.body)
  res.status(200);
  res.send("PASSED");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
