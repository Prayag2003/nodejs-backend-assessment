const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const getUsers = (request, response) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = request.query.id;
    pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const { name, email } = request.body;
    // Descritpion for this syntax below
    pool.query(
        `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
        [name, email],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
};

const updateUser = (request, response) => {
    const id = request.query.id;
    const { name, email } = request.body;

    pool.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
};

const deleteUser = (request, response) => {
    const id = request.query.id;

    pool.query(`DELETE FROM users WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};