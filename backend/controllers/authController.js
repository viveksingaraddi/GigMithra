import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, phone, password, location, userType, companyName } = req.body;

    if (!name || !phone || !password || !location || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ phone, userType });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      location,
      userType,
      companyName: userType === "authoriser" ? companyName || name : null
    });

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sign up" });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password, userType } = req.body;

    const user = await User.findOne({ phone, userType });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log in" });
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};