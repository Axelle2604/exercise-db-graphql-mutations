const { Pool } = require('pg');

const pool = new Pool({
  user: 'axelle',
  host: 'localhost',
  database: 'mydb',
  password: 'pswd',
  port: 5432,
});

const tables = ['users', 'address', 'products', 'orders', 'orders_products'];

const dropTables = async () => {
  try {
    await pool.query(`DROP TABLE users;`);
    await pool.query(`DROP TABLE address;`);
    await pool.query(`DROP TABLE products;`);
    await pool.query(`DROP TABLE orders;`);
    await pool.query(`DROP TABLE orders_products;`);
  } catch (e) {
    console.log(e);
  }
};

const createTables = async () => {
  try {
    await pool.query(
      `CREATE TABLE users (id BIGSERIAL, name TEXT, password TEXT);`
    );
    await pool.query(
      `CREATE TABLE address (id BIGSERIAL, number INT, street TEXT, town TEXT, postalCode INT, userId BIGSERIAL);`
    );
    await pool.query(
      `CREATE TABLE products (id BIGSERIAL, title TEXT, description TEXT, price INT, image TEXT);`
    );
    await pool.query(
      `CREATE TABLE orders (id BIGSERIAL, date TEXT, totalHT INT, userId INT);`
    );
    await pool.query(
      `CREATE TABLE orders_products (order_id BIGSERIAL, product_id BIGSERIAL);`
    );
  } catch (e) {
    console.log(e);
  }
};

const insertInto = async () => {
  try {
    await pool.query(
      `INSERT INTO users (id, name, password) VALUES (0, 'Axelle', 'pswd');`
    );
    await pool.query(
      `INSERT INTO address (id, number, street, town, postalCode, userId) VALUES (0, 6, 'rue Eric Tabarly', 'Massy', 91300, 0);`
    );
    await pool.query(
      `INSERT INTO products (id, title, description, price, image) VALUES (0, 'Cellphone', 'A good cellphone.', 150, 'cellphone.png');`
    );
    await pool.query(
      `INSERT INTO products (id, title, description, price, image) VALUES (1, 'Computer', 'A good computer.', 500, 'computer.png');`
    );
    await pool.query(
      `INSERT INTO orders (id, date, totalHT, userId) VALUES (0, '1555407639', 150, 0);`
    );
    await pool.query(
      `INSERT INTO orders_products (order_id, product_id) VALUES (0, 0);`
    );
    pool.end();
  } catch (e) {
    console.log(e);
  }
};

const initDb = async () => {
  await dropTables();
  await createTables();
  await insertInto();
};

initDb();
