const { model, Schema } = require("mongoose");

const contributorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for identify"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: { type: String, required: false },
    country: {
      required: [true, "Please provide a country"],
      type: String,
    },
    social_link: {
      required: false,
      type: String,
      default: "",
    },
    profile: { type: String, default: "", required: false },
    token: { type: String },
  },
  { timestamps: true }
);

const Contributor = model("contributor", contributorSchema);
module.exports = Contributor;
