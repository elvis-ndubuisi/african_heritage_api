const mongoose = require("mongoose");
const colors = require("colors");

const init_mongoDb = async () => {
  mongoose.connection.once("connecting", () => {
    console.log(`\tConnecting to MongoDatabase`.italic.magenta);
  });

  mongoose.connection.on("reconnected", () => {
    console.log("\tReconnected".italic.green);
  });

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\tMongo Connected => ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(`\t${err}`.red.bold);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.log(`\t${err}`.red.bold);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("\tDisconnected from database".italic.yellow);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

module.exports = init_mongoDb;
