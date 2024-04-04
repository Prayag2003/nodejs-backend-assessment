const jwt = require('jsonwebtoken');
const { pool, connectDB } = require("../db/conn.js")

const authMiddleware = async (req, res, next) => {
    const accessToken = req.headers.authorization ? req.header("Authorization")?.replace("Bearer ", "") : null

    if (!accessToken) {
        return res.status(401).json({ message: 'Authentication failed: No accessToken provided' });
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [decodedToken._id],
        };
        console.log(query);
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            throw new ApiError(401, "Invalid access token");
        }

        // Set the user object in the request
        req.user = result.rows[0];
        console.log(req.user)
        next();
    } catch (error) {
        console.error('Authentication failed:', error.message);
        return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
};

module.exports = authMiddleware;
