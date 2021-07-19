import { Pool } from 'pg';

const createConnection = async () => {
  const client = new Pool({
    host: 'database',
    user: 'docker',
    password: 'docker',
    database: 'goomer_lista_rango',
  });

  await client.connect();

  return client;
};

export { createConnection };
