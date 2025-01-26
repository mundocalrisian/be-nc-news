const { Pool } = require('pg');
const fs = require('fs');
const ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({path: `${__dirname}/../.env.${ENV}`,});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {}

if (ENV === 'production'){
  const aivemSslCaPath = process.env.AIVEM_PEM_PATH
  
  config.connectionString  = process.env.DATABASE_URL;
  config.max = 2;
  config.ssl = {
    require: true,
    rejectUnauthorized: false,
    ca: fs.readFileSync(aivemSslCaPath).toString()
  };
  console.log(config)
}

module.exports = new Pool(config);
