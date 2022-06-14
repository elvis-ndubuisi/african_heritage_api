const adageRoute = require("./routes/adage.route");
const authRoute = require("./routes/auth.route");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const contRoute = require("./routes/contributor.route");
const cors = require("cors");
const corsConfig = require("./config/cors.config");
const createErr = require("http-errors");
const express = require("express");
const genRandomAdage = require("./helpers/gen_randomAdage");
const helmet = require("helmet");
const initAdage = require("./helpers/init_adage");
const initMongo = require("./helpers/init_mongoDb");
const jobs = require("./helpers/jobs");
const redisClient = require("./helpers/redis_client");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.port || 5000;

// Jobs
jobs.cacheAdageOfTheDay(genRandomAdage);
jobs.postAdageOnTwitter();

// Dependencies
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes.
app.use("/account", cors(corsConfig.contributorCORS), authRoute);
app.use("/cnt/profile", cors(corsConfig.contributorCORS), contRoute);
app.use("/", cors(corsConfig.apiCORS), adageRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "African Adage API",
    owner: "Elvis Victor",
  });
});

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

// Initialize Server.
app.listen(PORT, async () => {
  console.log("****************************************".green);
  await redisClient.connect();
  await initMongo();
  console.log(colors.cyan.underline.bold(`\tserver ready`));
  console.log("****************************************".green);
  // await initAdage(genRandomAdage);
});
