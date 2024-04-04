const { pool, connectDB } = require('../db/conn.js');

const enrollUserInCourse = async (req, res) => {
    const userId = parseInt(req.body.id, 10);
    const courseId = parseInt(req.body.courseId, 10)
    try {
        const query = 'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id';
        const values = [userId, courseId];
        const result = await pool.query(query, values);
        const enrollmentId = result.rows[0].id;
        res.status(200).json({ success: true, enrollmentId });
    } catch (error) {
        console.error('Error enrolling user in course:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const getEnrolledCoursesForUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const query = `
            SELECT c.title, c.category, c.level
            FROM courses c
            INNER JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = $1
        `;
        const values = [userId];
        const result = await pool.query(query, values);
        const enrolledCourses = result.rows;
        res.status(200).json({ success: true, enrolledCourses });
    } catch (error) {
        console.error('Error getting enrolled courses for user:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    enrollUserInCourse,
    getEnrolledCoursesForUser,
};