export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_UR}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};
