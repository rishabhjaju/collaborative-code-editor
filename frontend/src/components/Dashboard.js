import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    const { data } = await axios.get("http://localhost:5000/api/rooms", { headers: { Authorization: `Bearer ${token}` } });
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const name = prompt("Room name?");
    if (!name) return;
    const { data } = await axios.post("http://localhost:5000/api/rooms", { name }, { headers: { Authorization: `Bearer ${token}` } });
    navigate(`/room/${data.roomId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>
      <h2>Your Rooms</h2>
      <button onClick={createRoom}>Create Room</button>
      <ul>
        {rooms.map((r) => (
          <li key={r._id} onClick={() => navigate(`/room/${r.roomId}`)} style={{ cursor: "pointer" }}>
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
