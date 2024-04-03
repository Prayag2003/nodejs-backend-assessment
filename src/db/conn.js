const { Pool } = require("pg");
require("dotenv").config();
let pool;

const connectDB = async () => {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            }
        });
    }
    catch (error) {
        console.log("Connection to Neon DB failed...");
        process.exit(1)
    }
}

connectDB()

module.exports = {
    pool,
    connectDB,
};