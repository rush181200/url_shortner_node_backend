const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = 5001;

// Allow all CORS methods and headers
app.use(
  cors({
    origin: "http://localhost:5173", // Allow the frontend's origin
    methods: "GET,POST,OPTIONS", // Allow specific HTTP methods
    allowedHeaders: "Content-Type", // Allow specific headers
    credentials: true,
  })
);

// Middleware to handle preflight requests
app.options("*", cors());

// Parse incoming request body as JSON
app.use(bodyParser.json());

// Simple in-memory store for shortened URLs
const urlStore = {};

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  // Generate a random string for the shortened URL
  const randomString = crypto.randomBytes(4).toString("hex"); // 8 characters long
  const shortUrl = `http://urlshortner-fonvamvf.b4a.run/${randomString}`;

  // Save the mapping in memory (could be a DB in a real application)
  urlStore[randomString] = url;

  res.json({ shortUrl });
});

// Optional: Create a redirect endpoint for shortened URLs
app.get("/:shortenedUrl", (req, res) => {
  const { shortenedUrl } = req.params;
  const originalUrl = urlStore[shortenedUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  }

  return res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
