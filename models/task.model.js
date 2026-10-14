import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: String,
      default: "",
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// in development, drop the cached model so schema edits take effect
if (process.env.NODE_ENV !== "production" && mongoose.models.Task) {
  delete mongoose.models.Task;
}

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;