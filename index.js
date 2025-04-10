// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gameDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
});

const Player = mongoose.model('Player', PlayerSchema);

// API endpoint
app.post('/submit', async (req, res) => {
  const { name, email, phone, score } = req.body;
  try {
    const newPlayer = new Player({ name, email, phone, score });
    await newPlayer.save();
    res.json({ message: 'Data saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
