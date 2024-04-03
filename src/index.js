import express from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv"
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}.`);
});
