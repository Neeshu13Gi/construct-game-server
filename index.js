
// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://neeshu:YC7pQ0Unf32NKHi7@neeshu.cwxzomm.mongodb.net/UserData?retryWrites=true&w=majority&appName=neeshu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

// Schema
const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
});
const Player = mongoose.model('Player', PlayerSchema);

// Endpoint
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
