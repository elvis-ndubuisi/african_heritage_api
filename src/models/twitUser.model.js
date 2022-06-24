const { model, Schema } = require("mongoose");

const twitUserSchema = new Schema({
  username: { type: String, required: true },
  access: String,
  refresh: String,
});

const TwitUser = model("TwitUser", twitUserSchema);

module.exports = TwitUser;
