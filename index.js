const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = 5001;

// CORS configuration to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "OPTIONS"], // Allow specific methods
    allowedHeaders: ["Content-Type"], // Allow headers like Content-Type
    optionsSuccessStatus: 200, // Some browsers (IE) choke on 204
  })
);

app.use(bodyParser.json());

// Handle preflight requests
app.options("*", cors()); // Preflight route for all requests

// Simple in-memory store for shortened URLs
const urlStore = {};

app.post("/shorten", (req, res) => {
  const { url } = req.body;

  // Generate a random string for the shortened URL
  const randomString = crypto.randomBytes(4).toString("hex"); // 8 characters long
  const shortUrl = `http://urlshortner-fonvamvf.b4a.run/${randomString}`;

  // Save the mapping in memory
  urlStore[randomString] = url;

  res.json({ shortUrl });
});

// Create a redirect endpoint for shortened URLs
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
