import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",// Here it will be false in dev mode http
  });
  return token;
};
// https->in production  http->in dev
