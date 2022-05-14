const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(err.red.bold);
    process.exit(1);
  }
};

module.exports = connectMongo;
