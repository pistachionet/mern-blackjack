const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blackjack';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Game model
const Game = mongoose.model('Game', {
  playerName: String,
  status: String, // "playing", "won", "lost"
  cards: [String],
  createdAt: { type: Date, default: Date.now }
});

// Routes
app.get('/api/games', async (req, res) => {
  const games = await Game.find().sort({ createdAt: -1 });
  res.json(games);
});

app.post('/api/games', async (req, res) => {
  try {
    console.log('REQ BODY:', req.body);
    const newGame = new Game(req.body);
    const saved = await newGame.save();
    res.json(saved);
  } catch (err) {
    console.error('POST ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.delete('/api/games/:id', async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
