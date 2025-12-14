
var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date?", (req, res) => {
  let dateInput = req.params.date;

  let date;
  if (!dateInput) {
    date = new Date();
  } else if (!isNaN(dateInput)) {
    // If it's a number, parse as timestamp
    date = new Date(parseInt(dateInput));
  } else {
    // Otherwise, treat as date string
    date = new Date(dateInput);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),        // 👈 this is the "unix" key they want
    utc: date.toUTCString()
  });
});




// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});