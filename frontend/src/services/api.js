// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // Utiliser la même clé partout
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};


export { API_URL, getAuthHeaders };
