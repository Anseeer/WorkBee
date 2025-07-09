const otpMap = new Map<string, { otp: string; expiresAt: number }>();

export const saveOtp = (email: string, otp: string, ttl = 600000) => {
  const expiresAt = Date.now() + ttl; 
  otpMap.set(email, { otp, expiresAt });
};

export const getOtp = (email: string) => {
  return otpMap.get(email);
};

export const deleteOtp = (email: string) => {
  otpMap.delete(email);
};
