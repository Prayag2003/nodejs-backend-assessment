const { connectDB, pool } = require("../db/conn.js");

const getAllCoursesBySuperadmin = (req, res) => {
    const id = req.query.id;
    if (id !== "1") {
        return res.status(403).json({ message: "Only superadmin users have permission to perform this operation" });
    }

    const { category, level, page, limit } = req.query;
    console.log(category + "  " + level + "  " + page + "  " + limit);
    let query = "SELECT * FROM courses";

    const filterValues = [];
    if (category) {
        query += " WHERE category = $1";
        filterValues.push(category);
    }
    if (level) {
        query += filterValues.length ? " AND" : " WHERE";
        query += " level = $2";
        filterValues.push(level);
    }

    // Adding pagination
    const offset = (page - 1) * limit;
    query += " OFFSET $3 LIMIT $4";
    filterValues.push(offset, limit);

    pool.query(query, filterValues, (error, results) => {
        if (error) {
            console.error("Error fetching all courses by superadmin:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json(results.rows);
    });
};

const createCourseBySuperadmin = (req, res) => {
    const id = req.query.id;
    if (id !== "1") {
        return res.status(403).json({ message: "Only superadmin users have permission to perform this operation" });
    }

    const { title, category, level, description } = req.body;

    pool.query("INSERT INTO courses (title, category, level, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, category, level, description],
        (error, results) => {
            if (error) {
                console.error("Error creating course by superadmin:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.status(201).json(results.rows[0]);
        });
};


const updateCourseBySuperadmin = (req, res) => {
    const id = req.query.id;
    if (id !== "1") {
        return res.status(403).json({ message: "Only superadmin users have permission to perform this operation" });
    }
    const courseId = req.params.id;
    const { title, category, level, description } = req.body;

    pool.query("UPDATE courses SET title = $1, category = $2, level = $3, description = $4 WHERE id = $5 RETURNING *",
        [title, category, level, description, courseId],
        (error, results) => {
            if (error) {
                console.error("Error updating course by superadmin:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(results.rows[0]);
        });
};

const deleteCourseBySuperadmin = (req, res) => {
    if (!req.user || !req.user.isSuperadmin) {
        return res.status(403).json({ message: "Only superadmin users have permission to perform this operation" });
    }
    const courseId = req.params.id;

    pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [courseId], (error, results) => {
        if (error) {
            console.error("Error deleting course by superadmin:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    });
};

module.exports = {
    createCourseBySuperadmin,
    getAllCoursesBySuperadmin,
    updateCourseBySuperadmin,
    deleteCourseBySuperadmin,
};
