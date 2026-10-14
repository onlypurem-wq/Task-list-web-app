import User from "../models/user.model";
import bcrypt from "bcryptjs"; // changed from "bcrypt" (run: npm i bcryptjs)
import generateToken from "../utils/generateToken";
import { cookies } from "next/headers";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

export async function createUser(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!name || !email || !password) {
      return { status: 400, data: { message: "Missing fields" } };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return { status: 409, data: { message: "User already exists" } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await generateToken(newUser._id);

    const userObj = newUser.toObject();
    delete userObj.password;

    return {
      status: 201,
      data: { message: "User created successfully", user: userObj },
    };
  } catch (error) {
    console.error("createUser error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}

export async function loginUser(request) {
  try {
    const body = await request.json();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!email || !password) {
      return { status: 400, data: { message: "Missing fields" } };
    }

    const user = await User.findOne({ email }).select("+password");

    // same response for "no user" and "wrong password"
    if (!user) {
      return { status: 401, data: { message: "Invalid email or password" } };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { status: 401, data: { message: "Invalid email or password" } };
    }

    await generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      status: 200,
      data: { message: "Login successful!", user: userObj },
    };
  } catch (error) {
    console.error("loginUser error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    return { status: 200, data: { message: "Logged out successfully" } };
  } catch (error) {
    console.error("logoutUser error:", error);
    return { status: 500, data: { message: "Something went wrong" } };
  }
}