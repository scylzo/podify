import { RequestHandler } from "express";

import { CreateUser, VerifyEmail } from "@/@types/user";
import User from "@/models/user";
import { generateToken } from "@/utils/helper";
import {
  sendPasswordSuccessMail,
  sendPasswordVerificationLink,
  sendVerificationMail,
} from "@/utils/mail-helper";
import EmailVerificationToken from "@/models/emailVerificationToken";
import PasswordResetToken from "@/models/passwordResetToken";

import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "@/utils/variables";

export const createUser: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: newUser._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: newUser._id.toString() });
  res.status(201).json({ user: { id: newUser._id, name, email } });
};

export const verifyEmail: RequestHandler = async (req: VerifyEmail, res) => {
  const { token, userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });
  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);
  res.json({ message: "Your email is verified." });
};

export const sendVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request !" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request !" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });
  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check you mail." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!" });

  await PasswordResetToken.findOneAndDelete({ owner: user._id });
  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({
    owner: user._id,
    token,
  });
  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  await sendPasswordVerificationLink({
    email: user.email,
    link: resetLink,
  });
  res.json({ message: "Check your registered mail " });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });
  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  sendPasswordSuccessMail(user.name, user.email);
  res.json({ message: "Password resets successfully" });
};
