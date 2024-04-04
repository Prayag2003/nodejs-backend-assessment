const pool = require("../db/conn.js");

const getCourses = (req, res) => {
    const { category, level, popularity, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construct SQL query based on provided parameters
    let query = "SELECT * FROM courses WHERE 1=1";
    if (category) {
        query += ` AND category = '${category}'`;
    }
    if (level) {
        query += ` AND level = '${level}'`;
    }
    if (popularity) {
        query += ` AND popularity >= ${popularity}`;
    }

    // Add pagination
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching courses:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getCourses,
};
