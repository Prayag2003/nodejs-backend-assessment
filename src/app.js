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
const courseRouter = require("./routes/course.routes.js")
const superadminRouter = require("./routes/superadmin.routes.js")

app.use("/api/v1/", userRouter)
app.use("/api/v1/", courseRouter)
app.use("/api/v1/", superadminRouter)

module.exports = app