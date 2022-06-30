const { model, Schema } = require("mongoose");

const tweetSubscribersSchema = new Schema({
  subscriberId: String,
  subscriberName: { type: String, required: true },
  subscriberUsername: { type: String, required: true },
  access: String,
  refresh: String,
});

const TweetSubscribers = model("TweetSubscribers", tweetSubscribersSchema);

module.exports = TweetSubscribers;
