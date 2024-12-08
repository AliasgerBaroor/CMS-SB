require("dotenv").config();
const express = require('express');
const cors = require('cors');

const notificationClient = require("./redisClient")

const app = express();

app.use(express.json());




const PORT = process.env.SERVERPORT || 8003

app.listen(PORT, () => console.log("Server listening on port: http://localhost:" + PORT))