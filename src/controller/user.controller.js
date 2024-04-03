const { pool, connectDB } = require("../db/conn.js");
console.log(pool);
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUsers = (req, res) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(results.rows);
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field?.trim() === "" || field === undefined)) {
        console.log("All fields are required");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const emailExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id";
    pool.query(query, [name, email, hashedPassword], (error, results) => {
        if (error) {
            console.error("Error registering user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({ message: "User registered successfully", userId: results.rows[0].id });
    });
};

const getUserProfile = (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    pool.query("SELECT id, name, email FROM users WHERE id = $1", [userId], (error, results) => {
        if (error) {
            console.error("Error fetching user profile:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const userProfile = results.rows[0];
        res.status(200).json(userProfile);
    });
};

const updateUserProfile = (req, res) => {
    const userId = req.query.id;
    const { name, email } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, userId], (error, results) => {
        if (error) {
            console.error("Error updating user profile:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile updated successfully" });
    });
};


const deleteUser = (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    pool.query("DELETE FROM users WHERE id = $1", [userId], (error, results) => {
        if (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
};

module.exports = {
    getUsers,
    registerUser,
    getUserProfile,
    updateUserProfile,
    deleteUser
};