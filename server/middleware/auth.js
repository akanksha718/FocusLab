const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
