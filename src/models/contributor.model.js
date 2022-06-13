const bcrypt = require("bcryptjs");
const { model, Schema } = require("mongoose");

const contributorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      max: 18,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

contributorSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

contributorSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

const Contributor = model("contributor", contributorSchema);
module.exports = Contributor;
