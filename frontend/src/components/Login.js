import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", form);
      login(data.token);
      navigate("/");
    } catch (e) {
      alert(e.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Login</h2>
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <div className="text-center mt-2">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            type="button"
            className="ml-2 text-indigo-600 hover:underline font-medium"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
