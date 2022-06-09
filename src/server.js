const adageRoute = require("./routes/api.route");
const authRoute = require("./routes/auth.route");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const contRoute = require("./routes/contributor.route");
const createErr = require("http-errors");
const express = require("express");
const genRandomAdage = require("./helpers/gen_randomAdage");
const helmet = require("helmet");
const initAdage = require("./helpers/init_adage");
const initMongo = require("./helpers/init_mongoDb");
const redisClient = require("./helpers/redis_client");
const morgan = require("morgan");
const { cacheAdageOfTheDay, postAdageOnTwitter } = require("./helpers/jobs");
require("dotenv").config();

const app = express();
const PORT = process.env.port || 5000;

// Jobs
cacheAdageOfTheDay(genRandomAdage);
postAdageOnTwitter();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes.
app.use("/", adageRoute);
app.use("/", authRoute);
app.use("/", contRoute);

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
  console.log("****************************************".green);
  await redisClient.connect();
  await initMongo();
  console.log(colors.cyan.underline(`\tserver ready`));
  console.log("****************************************".green);
  await initAdage(genRandomAdage);
});
