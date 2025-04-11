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

// Endpoint 1: Save user details and return the ID
app.post('/submit', async (req, res) => {
  console.log('Received user data:', req.body);
  const { name, email, phone } = req.body;
  try {
    const newPlayer = new Player({ name, email, phone, score: 0 });
    await newPlayer.save();
    res.json({ message: 'User data saved!', id: newPlayer._id });
  } catch (err) {
    res.status(500).json({ error: 'Error saving user data' });
  }
});

// ✅ Endpoint 2: Update score using _id later
app.post('/save-score', async (req, res) => {
  console.log('Updating score:', req.body);
  const { id, score } = req.body;
  try {
    const updated = await Player.findByIdAndUpdate(id, { $set: { score } }, { new: true });
    if (updated) {
      res.json({ message: 'Score updated successfully', updated });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
