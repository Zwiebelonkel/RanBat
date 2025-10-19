
import { createClient, Client } from '@libsql/client';
import { environment } from '../environments/environment'; // Assuming you have environment files

export class DatabaseService {
  private client: Client;

  constructor() {
    this.client = createClient({
      url: environment.tursoDbUrl,
      authToken: environment.tursoAuthToken,
    });
  }

  async setupDatabase() {
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        gold INTEGER NOT NULL DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        attack INTEGER NOT NULL,
        defense INTEGER NOT NULL,
        speed INTEGER NOT NULL,
        hp INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS user_cards (
        user_id INTEGER NOT NULL,
        card_id INTEGER NOT NULL,
        experience INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, card_id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (card_id) REFERENCES cards (id)
      );`,
    ];

    return await this.client.batch(statements);
  }

  async getCharacters() {
    return await this.client.execute('SELECT * FROM cards');
  }

  async registerUser(username: string, password: string) {
    const q = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const args = [username, password];
    return await this.client.execute({ sql: q, args: args });
  }

  async getUserByUsername(username: string) {
    const q = 'SELECT * FROM users WHERE username = ?';
    const args = [username];
    return await this.client.execute({ sql: q, args: args });
  }

  // Add more methods for interacting with your database as needed
}
