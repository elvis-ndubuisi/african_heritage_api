const authRoute = require("./routes/auth.route");
const colors = require("colors");
const cors = require("cors");
const contRoute = require("./routes/contributor.route");
const createErr = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const initMongo = require("./helpers/init_mongoDb");
const morgan = require("morgan");
require("dotenv").config();
const { verifyAccessToken } = require("./helpers/jwt_auth");

const app = express();
const PORT = process.env.port || 8080;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes.
app.use("/", authRoute);
app.use("/", contRoute);
app.use("/api", verifyAccessToken, (req, res) => {
  console.log(req.payload);
  res.send("index get");
});
// app.use("/", require("./routes/contributor.routes"));
// app.use("/", require("./routes/proverb.routes"));
app.use("*", (req, res, next) => {
  next(createErr.NotFound("This route doesn't exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, async () => {
  console.log("\t--------------------------------".blue);
  await initMongo();
  console.log(colors.green.bold(`\t=> Server stated on port: ${PORT}`));
  console.log("\t--------------------------------".blue);
});
