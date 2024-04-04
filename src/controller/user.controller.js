const { pool, connectDB } = require("../db/conn.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

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
    let isSuperadmin = false;

    // Check if the provided password matches the superadmin password
    if (password === "admin") {
        isSuperadmin = true;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            'INSERT INTO users (name, email, password, is_superadmin) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, isSuperadmin]
        );

        const user = rows[0];

        // Generate access token
        const accessToken = jwt.sign({ _id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });

        // Generate refresh token (optional: store refresh token in the database)
        const refreshToken = jwt.sign({ _id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });

        // Store refresh token in the database
        await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

        // Set cookies (access token and refresh token)
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });

        // Return user data and tokens
        res.status(201).json({ user, accessToken });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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

module.exports = {
    getUsers,
    registerUser,
    getUserProfile,
    updateUserProfile,
};