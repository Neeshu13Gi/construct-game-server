
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



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema
const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
});
const Player = mongoose.model("Player", PlayerSchema);

// Save user details (real-time)
app.post("/register", async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newUser = new Player({ name, email, phone, score: 0 });
    await newUser.save();
    res.json({ message: "User registered", id: newUser._id });
  } catch (err) {
    res.status(500).json({ error: "User registration failed" });
  }
});

// Save score later using same ID
app.post("/save-score", async (req, res) => {
  const { id, score } = req.body;
  try {
    await Player.findByIdAndUpdate(id, { $set: { score } });
    res.json({ message: "Score saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update score" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
