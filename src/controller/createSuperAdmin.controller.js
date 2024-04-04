const createSuperAdmin = async (req, res) => {
    const userId = req.query.id;

    if (!req.user || !req.user.superAdmin) {
        return res.status(403).json({ message: "Only superadmin users have permission to promote users to superadmin status" });
    }

    try {
        await pool.query('UPDATE users SET is_superadmin = true WHERE id = $1', [userId]);

        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const updatedUser = rows[0];

        res.status(200).json({ message: "User promoted to superadmin status", user: updatedUser });
    } catch (error) {
        console.error('Error promoting user to superadmin status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = createSuperAdmin
