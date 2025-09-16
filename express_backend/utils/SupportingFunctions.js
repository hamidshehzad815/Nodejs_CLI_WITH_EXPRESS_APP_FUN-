import crypto from "crypto";
export const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString(hex);
  crypto.createHash('sha256').update
};
