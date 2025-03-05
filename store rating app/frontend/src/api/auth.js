import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// 🔹 User Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// 🔹 User Signup
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Signup failed";
  }
};



// 🔹 Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};
