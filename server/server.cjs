const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

dotenv.config();
app.use(cors());
app.use(express.json());
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");` `
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  
      const result = await cloudinary.uploader.upload(dataURI,{ folder: "Bill_Craft/Cycle_Images"});
      res.json({ url: result.secure_url });
  
    } catch (error) {
      console.log("Cloudinary upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

    
asdasd