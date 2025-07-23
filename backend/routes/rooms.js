import express from "express";
import { v4 as uuid } from "uuid";
import Room from "../models/Room.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// create room
router.post("/", protect, async (req, res) => {
  const { name } = req.body;
  try {
    const room = await Room.create({ roomId: uuid(), name, owner: req.userId });
    res.json(room);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// get user rooms
router.get("/", protect, async (req, res) => {
  const rooms = await Room.find({ $or: [{ owner: req.userId }, { collaborators: req.userId }] });
  res.json(rooms);
});

export default router;
