const colors = require("colors");
const connectMongo = require("./config/mdb.config");
const dotenv = require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const app = express();
const PORT = process.env.port || 8000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
  await connectMongo();
  console.log(colors.yellow.bold(`> Server stated on port: ${PORT}`));
});
