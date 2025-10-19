const express = require('express');
const { getCharacters } = require('./database.js');
const { generate } = require('./card-generator.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from the battler backend!');
});

app.get('/cards', async (req, res) => {
  try {
    const characters = await getCharacters();
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching characters');
  }
});

app.get('/generate-card', (req, res) => {
    const card = generate();
    res.json(card);
});

app.listen(port, () => {
  console.log(`Battler backend listening at http://localhost:${port}`);
});
