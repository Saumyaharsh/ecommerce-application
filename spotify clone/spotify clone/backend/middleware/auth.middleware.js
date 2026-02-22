import { clerkClient } from "@clerk/express";
export const protectroutes = async (req, res, next) => {
  const userid = req.auth.userId;
  if (!userid) {
    return res.status(401).json({ error: Unauthorized });
  }
  next();
};

export const getadmin = async (req, res, next) => {
  try {
    const currentuser = await clerkClient.users.getUser(req.auth.userId);
    const isadmin =
      process.env.ADMIN_EMAIL === currentuser.primaryEmailAddress?.emailAddress;
    if (!isadmin) {
      return res.status(401).json({ error: "User is not admin" });
    }
    next();
  } catch (e) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};
