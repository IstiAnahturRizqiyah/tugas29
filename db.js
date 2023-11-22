const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: '200061',
  database: 'data_contacts',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
