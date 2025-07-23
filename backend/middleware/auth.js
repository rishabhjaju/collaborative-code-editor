import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token failed" });
  }
};

export const verifySocket = (socket, next) => {
  try { 
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (e) {
    next(e);
  }
};
