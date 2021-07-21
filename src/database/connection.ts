import { Pool } from 'pg';

const createConnection = async () => {
  const client = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  return client;
};

export { createConnection };
