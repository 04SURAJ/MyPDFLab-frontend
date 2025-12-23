import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/pdf", // make sure this matches your backend route
});

export default api;
