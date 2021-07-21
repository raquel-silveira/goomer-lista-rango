import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'develop' ? '.env.example' : '.env',
});
