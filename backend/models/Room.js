import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  codeHistory: [ 
    {
      code: String,
      language: String,
      updatedAt: Date,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
