const { createClient } = require('@libsql/client');
const { v4: uuidv4 } = require('uuid');

const client = createClient({
  url: 'libsql://ranbat-zwiebelonkel.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjA4ODA4ODMsImlkIjoiMTc5OWE3ZmQtMDYwYy00MmUzLWI1NmEtZTQ5M2FhMDRlNmUyIiwicmlkIjoiZjlhNWNmYjMtNjI3NC00YmNjLWFjN2MtYzhlNDQzYzNmNjVlIn0.i6a_hgkWuZY7vbhbGXNpwdzRrAN8Y54VyW7yeYIFiOgAfiRW39I1PXH149SjNYCTV6nyjNBagHdp0ryTwAbkAg'
});

const createStatements = [
  `CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    seed INTEGER NOT NULL UNIQUE,
    rarity TEXT NOT NULL,
    tier TEXT NOT NULL,
    race TEXT NOT NULL,
    hasWeapon INTEGER,
    weapon TEXT,
    hasPower INTEGER,
    power TEXT,
    strength INTEGER NOT NULL,
    speed INTEGER NOT NULL,
    stamina INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    createdAt INTEGER NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gold INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS user_cards (
    user_id TEXT NOT NULL,
    card_id TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, card_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (card_id) REFERENCES cards (id)
  );`
];

async function initializeDatabase() {
  for (const statement of createStatements) {
    await client.execute(statement);
  }
}

initializeDatabase();

async function getCardBySeed(seed) {
    const result = await client.execute({
        sql: 'SELECT * FROM cards WHERE seed = ?',
        args: [seed]
    });
    return result.rows[0];
}

async function addCharacter(character) {
    const existingCard = await getCardBySeed(character.seed);
    if (existingCard) {
        return existingCard.id;
    }

    const { id, name, seed, rarity, tier, race, hasWeapon, weapon, hasPower, power, stats, createdAt } = character;
    const { strength, speed, stamina, defense } = stats;
    await client.execute({
        sql: 'INSERT INTO cards (id, name, seed, rarity, tier, race, hasWeapon, weapon, hasPower, power, strength, speed, stamina, defense, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [id, name, seed, rarity, tier, race, hasWeapon ? 1: 0, weapon, hasPower ? 1 : 0, power, strength, speed, stamina, defense, createdAt]
    });
    return id;
}


async function addUser(username, password) {
  const id = uuidv4();
  await client.execute({
    sql: 'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
    args: [id, username, password]
  });
  return { id, username };
}

async function getUserByUsername(username) {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE username = ?',
    args: [username]
  });
  return result.rows[0];
}

async function getUserById(id) {
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    return result.rows[0];
  }


async function addUserCard(userId, cardId) {
  try {
    await client.execute({
        sql: 'INSERT INTO user_cards (user_id, card_id) VALUES (?, ?)',
        args: [userId, cardId]
    });
  } catch (e) {
      if (e.message.includes('UNIQUE constraint failed')) {
          console.log(`User ${userId} already has card ${cardId}`);
      } else {
          throw e;
      }
  }
}

async function getUserCards(userId) {
    const result = await client.execute({
        sql: `
            SELECT
                c.id, c.name, c.seed, c.rarity, c.tier, c.race, c.hasWeapon, c.weapon, c.hasPower, c.power,
                c.strength, c.speed, c.stamina, c.defense, c.createdAt,
                uc.level, uc.xp
            FROM cards c
            JOIN user_cards uc ON c.id = uc.card_id
            WHERE uc.user_id = ?
        `,
        args: [userId]
    });

    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        seed: row.seed,
        rarity: row.rarity,
        tier: row.tier,
        race: row.race,
        hasWeapon: row.hasWeapon === 1,
        weapon: row.weapon,
        hasPower: row.hasPower === 1,
        power: row.power,
        stats: {
            strength: row.strength,
            speed: row.speed,
            stamina: row.stamina,
            defense: row.defense,
        },
        level: row.level,
        xp: row.xp,
        createdAt: row.createdAt
    }));
}

module.exports = { addCharacter, addUser, getUserByUsername, getUserById, addUserCard, getUserCards };
