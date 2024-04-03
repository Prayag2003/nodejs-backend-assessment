const express = require("express");
const bodyParser = require("body-parser");

const app = express()

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const userRouter = require("./routes/user.routes.js")

app.use("/api/v1/", userRouter)

module.exports = app