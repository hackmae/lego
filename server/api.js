const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);



//testtt
/*
const fs = require('fs');
const path = require('path');

// Load all deals from the Alldeals file
const allDeals = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/Alldeals.json'), 'utf-8')
);

// Get a specific deal by ID
app.get('/deals/:id', async (req, res) => {
  const id = req.params.id;

  // 🔥 Search for the deal by _id
  const deal = allDeals.find(deal => deal._id === id);

  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  // ✅ Return the deal as JSON
  res.json(deal);
});
*/
