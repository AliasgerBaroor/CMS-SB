require('dotenv').config();
const express = require('express');
const cors = require("cors")
const routes = require("./config/routes")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(cors())
app.use(routes)


app.listen(process.env.SERVERPORT, () => console.log('listening on port http://localhost:' + process.env.SERVERPORT));
