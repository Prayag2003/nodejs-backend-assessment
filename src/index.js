const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
require("dotenv").config();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/users", db.getUsers);
app.get("/user", db.getUserById);
app.post("/create-user", db.createUser);
app.put("/update-user", db.updateUser);
app.delete("/delete-user", db.deleteUser);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}.`);
});
