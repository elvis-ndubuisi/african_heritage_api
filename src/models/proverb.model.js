const { model, Schema } = require("mongoose");

const proverbSchema = new Schema(
  {
    quote: {
      type: String,
      required: [true, "Please provide a proverb"],
    },
    quote_native: { type: String },
    lang: { type: String, default: "" },
    added_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "contributor",
    },
    unique_to: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Proverb = model("proverb", proverbSchema);
module.exports = Proverb;
