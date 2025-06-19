const { migrate } = require('postgres-migrations');
const { Client } = require('pg');
require('dotenv').config({ path: './server/.env' });

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function runMigrations() {
  await client.connect();
  try {
    await migrate({ client }, './server/migrations');
    console.log('✅ Migrations ran successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigrations();
