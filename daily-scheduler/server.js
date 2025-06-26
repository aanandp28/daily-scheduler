// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// GET: Serve the main HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// POST: Save schedule to file
app.post('/save-schedule', (req, res) => {
  const scheduleData = req.body;

  fs.writeFile('schedule.json', JSON.stringify(scheduleData), (err) => {
    if (err) {
      console.error('Error saving schedule:', err);
      return res.status(500).send('Failed to save');
    }
    res.send('Schedule saved successfully!');
  });
});

// GET: Load schedule from file
app.get('/load-schedule', (req, res) => {
  fs.readFile('schedule.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error loading schedule:', err);
      return res.status(500).send('Failed to load');
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
