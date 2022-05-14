const { model, Schema } = require("mongoose");

const proverbSchema = new Schema(
  {
    proverb: {
      type: String,
      require: [true, "Please provide a proverb"],
    },
    lang: {
      type: String,
    },
    added_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "contributor",
    },
    unique_to: {
      type: Array,
      default: [],
    },
    translations: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Proverb = model("proverb", proverbSchema);
module.exports = Proverb;
