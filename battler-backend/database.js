const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://ranbat-zwiebelonkel.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjA4ODA4ODMsImlkIjoiMTc5OWE3ZmQtMDYwYy00MmUzLWI1NmEtZTQ5M2FhMDRlNmUyIiwicmlkIjoiZjlhNWNmYjMtNjI3NC00YmNjLWFjN2MtYzhlNDQzYzNmNjVlIn0.i6a_hgkWuZY7vbhbGXNpwdzRrAN8Y54VyW7yeYIFiOgAfiRW39I1PXH149SjNYCTV6nyjNBagHdp0ryTwAbkAg'
});

async function getCharacters() {
  return await client.execute('SELECT * FROM cards');
}

module.exports = { getCharacters };