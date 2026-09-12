import mongoose from "mongoose";

const jdSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
  },
  { timestamps: true }
);

const JD = mongoose.model("JD", jdSchema);

export default JD;