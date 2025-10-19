
const express = require('express');
const cors = require('cors');
const { addCharacter, addUser, getUserByUsername, getUserById, addUserCard, getUserCards } = require('./database.js');
const { generate } = require('./card-generator.js');

const app = express();
const api = express.Router();

app.use(express.json());
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['https://darkestbattlcards.web.app', 'http://localhost:4200']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle pre-flight requests

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello from the battler backend!');
});

// API routes
api.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).send('Username already exists');
    }
    const newUser = await addUser(username, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while registering the user');
  }
});

api.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    try {
      const user = await getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).send('Invalid username or password');
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while logging in');
    }
});

api.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching user data');
    }
});

api.get('/currency/gold/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ gold: user.gold || 0 });
    } catch (error) {
        console.error('Error fetching gold for user ' + id, error);
        res.status(500).send('An error occurred while fetching user gold');
    }
});

api.get('/user/:id/cards', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const cards = await getUserCards(id);
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching user cards');
    }
});

api.post('/user/:id/cards', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const card = generate();
        const cardId = await addCharacter(card);
        await addUserCard(id, cardId);
        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding a card to the user');
    }
});

app.use('/api', api);

app.listen(port, () => {
  console.log(`Battler backend listening at http://localhost:${port}`);
});
