import { Router } from "express";

import { validate } from "@/middleware/validor";
import {
  CreateUserSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "@/utils/validationSchema";
import {
  createUser,
  generateForgetPasswordLink,
  grantValid,
  sendVerificationToken,
  updatePassword,
  verifyEmail,
} from "@/controllers/user";
import { isValidPasswordResetToken } from "@/middleware/auth";

const router = Router();

router.post("/create", validate(CreateUserSchema), createUser);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
export default router;
