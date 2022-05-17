const colors = require("colors");
const connectMongo = require("./config/mdb.config");
const cors = require("cors");
const dotenv = require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const app = express();
const PORT = process.env.port || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes.
app.use("/account", require("./routes/contributor.routes"));
app.use("/api/v1", require("./routes/proverb.routes"));

app.listen(PORT, async () => {
  await connectMongo();
  console.log(colors.yellow.bold(`> Server stated on port: ${PORT}`));
});
