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





// Endpoint: Update score using email
app.post('/save-score', async (req, res) => {
  const { email, score } = req.body;
  console.log('🎯 Updating score for email:', email, 'to', score);

  if (!email || typeof score === "undefined") {
    return res.status(400).json({ error: "Missing email or score" });
  }

  try {
    const updated = await Player.findOneAndUpdate(
      { email },
      { $set: { score } },
      { new: true }
    );

    if (updated) {
      res.json({ message: '✅ Score updated successfully', updated });
    } else {
      res.status(404).json({ error: 'User with this email not found' });
    }
  } catch (err) {
    console.error('❌ Error updating score:', err);
    res.status(500).json({ error: 'Failed to update score' });
  }
});


// ✅ Endpoint 2: Update score using _id later
// app.patch("/save-score", async (req, res) => {
//   const { id, score } = req.body;

//   if (!id || typeof score === "undefined") {
//     return res.status(400).json({ error: "Missing id or score" });
//   }

//   try {
//     const updated = await Player.findByIdAndUpdate(id, { score }, { new: true });
    

//     if (!updated) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ message: "Score updated", user: updated });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// });


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




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
// .then(() => console.log('✅ MongoDB connected'))
// .catch((err) => console.error('❌ MongoDB error:', err));

// // Schema
// const PlayerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   score: Number,
// });
// const Player = mongoose.model('Player', PlayerSchema);

// // ✅ Endpoint 1: Save user details and return the _id
// app.post('/submit', async (req, res) => {
//   console.log('📩 Received user data:', req.body);
//   const { name, email, phone } = req.body;
//   try {
//     const newPlayer = new Player({ name, email, phone, score: 0 });
//     await newPlayer.save();
//     res.json({ message: '✅ User data saved!', id: newPlayer._id });
//   } catch (err) {
//     console.error('❌ Error saving user:', err);
//     res.status(500).json({ error: 'Error saving user data' });
//   }
// });

// // ✅ Endpoint 2: Update score using MongoDB _id
// // ✅ Update score using email instead of _id
// // ✅ Update score using email instead of ID
// app.post('/save-score', async (req, res) => {
//   const { email, score } = req.body;
//   console.log('🎯 Updating score for email:', email, 'to', score);

//   try {
//     const updated = await Player.findOneAndUpdate(
//       { email },
//       { $set: { score } },
//       { new: true }
//     );

//     if (updated) {
//       res.json({ message: '✅ Score updated successfully', updated });
//     } else {
//       res.status(404).json({ error: 'User with this email not found' });
//     }
//   } catch (err) {
//     console.error('❌ Error updating score:', err);
//     res.status(500).json({ error: 'Failed to update score' });
//   }
// });




// // ✅ Optional: View all users (for testing/debugging)
// app.get('/users', async (req, res) => {
//   try {
//     const users = await Player.find({});
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
