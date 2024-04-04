const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');

const app = express()
app.use(morgan("dev"))

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const userRouter = require("./routes/user.routes.js")
const courseRouter = require("./routes/course.routes.js")
const superadminRouter = require("./routes/superadmin.routes.js")
const enrollmentRouter = require("./routes/enrollment.routes.js")

app.use("/api/v1/", userRouter)
app.use("/api/v1/", courseRouter)
app.use("/api/v1/", superadminRouter)
app.use("/api/v1/", enrollmentRouter)

module.exports = app