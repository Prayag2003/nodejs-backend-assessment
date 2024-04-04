const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const responseTime = require('response-time');
const chalk = require('chalk');

const app = express()

app.use(responseTime());
morgan.token('table', (req, res) => {
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    const responseTime = res.getHeaders()['x-response-time'];
    const remoteAddress = req.ip;

    return `METHOD: ${chalk.green(method)} | URL: ${chalk.blue(url)} | Status: ${chalk.yellow(status.toString())} | Response Time: ${chalk.magenta(responseTime)} | IP: ${chalk.cyan(remoteAddress)}`;
});


app.use(morgan(':table'));

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