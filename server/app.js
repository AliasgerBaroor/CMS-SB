require('dotenv').config();
const express = require('express');
const routes = require("./config/routes")
const cors = require("cors")
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use("/themes", express.static(path.join(__dirname, "themes")));

app.use(cors())
app.use(routes)
app.listen(process.env.PORT, () => console.log('listening on port http://localhost:' + process.env.PORT));
