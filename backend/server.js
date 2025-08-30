const express = require("express");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const app = express();
const PORT = 3000;
app.use(express.static('../frontend'));

app.get("/sets", (req, res) => {
  const dataDir = path.join(__dirname, "data");
  const files = fs.readdirSync(dataDir);

  let sets = [];

  files.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const setfile = xlsx.readFile(filePath);
    const setpage = setfile.SheetNames[0];
    const set = setfile.Sheets[setpage];

    const data = xlsx.utils.sheet_to_json(set);

    sets.push({
      filename: file,
      data: data,
    });
  });

  res.json(sets);
});

const multer = require("multer");


const storage = multer.diskStorage({
  // const storage was made by AI
  destination: (req, file, cb) => cb(null, path.join(__dirname, "data")),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
