const { model, Schema } = require("mongoose");

const contributorSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Please provide a name for identify"],
    },
    email: {
      type: String,
      require: [true, "Please provide an email"],
    },
    password: {
      type: String,
      require: [true, "Please provide a password"],
    },
    country: {
      require: [true, "Please provide a country"],
      type: String,
    },
    social_link: {
      require: false,
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Contributor = model("contributor", contributorSchema);
module.exports = Contributor;
