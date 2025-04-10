
// // index.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect("mongodb+srv://neeshu:YC7pQ0Unf32NKHi7@neeshu.cwxzomm.mongodb.net/UserData?retryWrites=true&w=majority&appName=neeshu", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB error:', err));

// // Schema
// const PlayerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   score: Number,
// });
// const Player = mongoose.model('Player', PlayerSchema);

// // Endpoint
// app.post('/submit', async (req, res) => {
//     console.log('Received data:', req.body);
//   const { name, email, phone, score } = req.body;
//   try {
//     const newPlayer = new Player({ name, email, phone, score });
//     await newPlayer.save();
//     res.json({ message: 'Data saved!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error saving data' });
//   }
// });


// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://neeshu:YC7pQ0Unf32NKHi7@neeshu.cwxzomm.mongodb.net/UserData?retryWrites=true&w=majority&appName=neeshu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

// ✅ Schema & Model
const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
});
const Player = mongoose.model('Player', PlayerSchema);

//
// ✅ Route 1: Register user (without score)
//
app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newPlayer = new Player({ name, email, phone });
    const savedPlayer = await newPlayer.save();
    res.json({ message: 'User registered', id: savedPlayer._id });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

//
// ✅ Route 2: Save/Update score later using ID
//
app.post('/save-score', async (req, res) => {
  const { id, score } = req.body;
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { $set: { score } },
      { new: true }
    );
    if (!updatedPlayer) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Score updated', player: updatedPlayer });
  } catch (err) {
    console.error('Error updating score:', err);
    res.status(500).json({ error: 'Error updating score' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
