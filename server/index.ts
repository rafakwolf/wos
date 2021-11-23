require("dotenv").config({ path: process.env.ENV_FILE });

import express from "express";
import { listUsers } from "./repository";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("server app is running");
});

app.get("/users", (req, res) => {
    listUsers().then(users => res.json(users));
});

const PORT = 3001;

app.listen(PORT, () => {
    console.info(`Server App listening on port ${PORT}`);
});

export = app;