import mongoose from "mongoose";
import Task from "../models/task.model";

export async function createTask(request, user) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return { status: 400, data: { message: "Title is required" } };
    }

    // only take the fields we allow from the client
    const task = await Task.create({
      title: body.title,
      task: body.task || "",
      done: body.done === true,
      user: user._id,
    });

    return { status: 201, data: task };
  } catch (error) {
    console.error("createTask error:", error);
    return { status: 400, data: { message: error.message } };
  }
}

export async function getTasks(user) {
  try {
    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });

    return { status: 200, data: tasks };
  } catch (error) {
    console.error("getTasks error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}

export async function getTask(id, user) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { status: 400, data: { message: "Invalid task id" } };
    }

    const task = await Task.findOne({ _id: id, user: user._id });

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    return { status: 200, data: task };
  } catch (error) {
    console.error("getTask error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}

export async function editTask(request, id, user) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { status: 400, data: { message: "Invalid task id" } };
    }

    const body = await request.json();
    const updates = {};

    // whitelist: only these fields can be changed
    if (typeof body.title === "string") updates.title = body.title;
    if (typeof body.task === "string") updates.task = body.task;
    if (typeof body.done === "boolean") updates.done = body.done;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    return { status: 200, data: task };
  } catch (error) {
    console.error("editTask error:", error);
    return { status: 400, data: { message: error.message } };
  }
}

export async function deleteTask(id, user) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { status: 400, data: { message: "Invalid task id" } };
    }

    const task = await Task.findOneAndDelete({ _id: id, user: user._id });

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    return { status: 200, data: { message: "Deleted successfully" } };
  } catch (error) {
    console.error("deleteTask error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}