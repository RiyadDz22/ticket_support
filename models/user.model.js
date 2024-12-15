const pool = require('../config/db.config');

const createUser = async (username, email, passwordHash) => {
  const query = `
        INSERT INTO Users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING userid, username, email
    `;
  const values = [username, email, passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM Users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
