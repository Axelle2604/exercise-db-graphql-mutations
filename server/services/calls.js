const { Pool } = require('pg');

const pool = new Pool({
  user: 'axelle',
  host: 'localhost',
  database: 'mydb',
  password: 'pswd',
  port: 5432,
});

const getUser = async id => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
  return rows[0];
};

const getUsers = async () => {
  const { rows } = await pool.query(`SELECT * FROM users`);
  return rows;
};

const getProducts = async () => {
  const { rows } = await pool.query(`SELECT * FROM products`);
  return rows;
};

const getOrders = async () => {
  const { rows } = await pool.query(`SELECT * FROM orders`);
  return rows;
};

const getOrdersProducts = async () => {
  const { rows } = await pool.query(`SELECT * FROM orders_products`);
  return rows;
};

const getAddressByUserId = async userId => {
  const { rows } = await pool.query(
    `SELECT * FROM address WHERE userId = ${userId}`
  );
  return rows[0];
};

const getAddressById = async id => {
  const { rows } = await pool.query(`SELECT * FROM address WHERE id = ${id}`);
  return rows[0];
};

const getOrderByUserId = async userId => {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE userId = ${userId}`
  );
  return rows[0];
};

const getProductByOrderId = async orderId => {
  const { rows } = await pool.query(
    `SELECT * FROM products p
     INNER JOIN orders_products op ON p.id = op.product_id 
     WHERE op.order_id = ${orderId}`
  );
  return rows[0];
};

const addUser = async (name, password) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, password) VALUES ('${name}', '${password}') RETURNING *;`
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  }
};

const addUsersWithAddress = async (
  name,
  password,
  number,
  street,
  town,
  postalCode
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'INSERT INTO users (name, password) VALUES($1, $2) RETURNING id',
      [name, password]
    );

    const insertAddress =
      'INSERT INTO address (id, number, street, town, postalCode) VALUES ($1, $2, $3, $4, $5)';
    const insertAddressValue = [rows[0].id, number, street, town, postalCode];
    await client.query(insertAddress, insertAddressValue);
    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const addOrder = async (date, totalHT, userId, productId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'INSERT INTO orders (date, totalHT, userId) VALUES ($1, $2, $3) RETURNING id',
      [date, totalHT, userId]
    );
    const insertOrderProduct =
      'INSERT INTO orders_products (order_id, product_id) VALUES ($1, $2)';
    await Promise.all(
      productId.map(async id => {
        return await client.query(insertOrderProduct, [rows[0].id, id]);
      })
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  getUser,
  getUsers,
  getAddressById,
  getAddressByUserId,
  getOrderByUserId,
  getProductByOrderId,
  addUser,
  getProducts,
  getOrders,
  addUsersWithAddress,
  addOrder,
  getOrdersProducts,
};
