import nodemailer from "nodemailer";
import path from "path";

import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "@/utils/variables";
import { generateTemplate } from "@/mail/template";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  generateMailTransporter().sendMail({
    subject: "Welcome message",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Welcome to Podify!",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendPasswordVerificationLink = async (options: Options) => {
  const { email, link } = options;

  const message = `We just received a request that you forgot your password. No problem you use the link below and create brand new password.`;

  generateMailTransporter().sendMail({
    subject: "Reset password link",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Forget password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
export const sendPasswordSuccessMail = async (name: string, email: string) => {
  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;

  generateMailTransporter().sendMail({
    subject: "Password reset successfully",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Password reset successfully",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
