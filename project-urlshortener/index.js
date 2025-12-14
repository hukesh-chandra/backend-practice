require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // ✅ needed
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // ✅ parse form data
app.use(bodyParser.json()); // ✅ parse JSON

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Store urls in memory for now
let urls = [];
let shortUrlCounter = 1;

// POST endpoint
app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;

  // Simple validation
  const urlRegex = /^https?:\/\/(.*)/;
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Save url with short code
  const short_url = shortUrlCounter++;
  urls[short_url] = url;

  res.json({
    original_url: url,
    short_url: short_url
  });
});

// Redirect endpoint
app.get('/api/shorturl/:short_url', function (req, res) {
  const short_url = req.params.short_url;
  const original_url = urls[short_url];

  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.json({ error: 'No short URL found for given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
