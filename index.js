require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

const shortUrl = {};
let urlId = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  const urlRegex = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrlKey = urlId++;
  shortUrl[shortUrlKey] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrlKey,
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrlKey = req.params.short_url;
  const originalUrl = shortUrl[shortUrlKey];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({error: "No short URL found for the given input"});
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
