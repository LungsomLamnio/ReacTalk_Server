import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.heaer("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acccess Denied. No Token Provided." });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "my_super_secret_code",
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
