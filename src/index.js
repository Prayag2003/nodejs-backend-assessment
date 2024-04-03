require("dotenv").config();
const { pool, connectDB } = require("./db/conn.js");
const app = require("./app.js")

// NOTE: listening to any errors from app
app.on("error", (error) => {
    console.log("ERR: ", error);
    process.exit(1)
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`App running on port ${process.env.PORT}.`);
        });

    })
    .catch((err) => {
        console.log("MongoDB failed to connect ...", err);
    })