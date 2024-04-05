import { pool } from "../db/conn.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken._id;

        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [userId],
        };
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid access token");
    }
});