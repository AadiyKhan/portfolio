const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static assets from Vite's build output (dist)
app.use(express.static(path.join(__dirname, 'dist')));

const PORTFOLIO_DATA_PATH = path.join(__dirname, 'data', 'portfolio.json');
const MESSAGES_PATH = path.join(__dirname, 'data', 'messages.json');

// Helper to ensure directory exists
function ensureDirExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// GET dynamic portfolio data
app.get('/api/portfolio-data', (req, res) => {
  if (!fs.existsSync(PORTFOLIO_DATA_PATH)) {
    return res.status(404).json({ error: 'Portfolio data file not found' });
  }

  fs.readFile(PORTFOLIO_DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading portfolio data:', err);
      return res.status(500).json({ error: 'Failed to read portfolio data' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing portfolio data JSON:', parseErr);
      res.status(500).json({ error: 'Invalid portfolio data JSON structure' });
    }
  });
});

// POST contact form message submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
  }

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const newMessage = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  ensureDirExists(MESSAGES_PATH);

  fs.readFile(MESSAGES_PATH, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) {
      try {
        messages = JSON.parse(data);
      } catch (e) {
        messages = [];
      }
    }

    messages.push(newMessage);

    fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error saving contact message:', writeErr);
        return res.status(500).json({ error: 'Failed to save the message.' });
      }
      res.status(201).json({ success: true, message: 'Message received successfully!' });
    });
  });
});

// Fallback to index.html for single page application routing (served from dist)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
