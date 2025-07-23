import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-700">Dashboard</h1>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition" onClick={logout}>
            Logout
          </button>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl text-indigo-500 mb-2">📁</span>
            <h2 className="text-xl font-semibold mb-1">Projects</h2>
            <p className="text-gray-500">Manage your collaborative projects.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl text-green-500 mb-2">👥</span>
            <h2 className="text-xl font-semibold mb-1">Team</h2>
            <p className="text-gray-500">Invite and manage team members.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl text-yellow-500 mb-2">⚙️</span>
            <h2 className="text-xl font-semibold mb-1">Settings</h2>
            <p className="text-gray-500">Customize your workspace.</p>
          </div>
        </section>
        <div style={{ padding: 20 }}>
          <button onClick={createRoom}>Create Room</button>
          <ul>
            {rooms.map((r) => (
              <li key={r._id} onClick={() => navigate(`/room/${r.roomId}`)} style={{ cursor: "pointer" }}>
                {r.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
