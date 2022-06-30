const { model, Schema } = require("mongoose");

const adageSchema = new Schema(
  {
    adage: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      min: [10, "Adage too small, Must exceed 10 characters"],
      max: [80, "Adage too long, must not exceed 80 characters"],
      trim: true,
    },
    translations: {
      type: Map,
      of: String,
      trim: true,
      lowercase: true,
    },
    interpretation: {
      type: String,
      trim: true,
      lowercase: true,
    },
    tags: [String],
    uniqueTo: {
      type: String,
      lowercase: true,
      trim: true,
    },
    country: { type: String, trim: true, lowercase: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "contributor",
    },
  },
  { timestamps: true }
);

const Adage = model("adage", adageSchema);
module.exports = Adage;
