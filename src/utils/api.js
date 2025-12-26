import axios from "axios";

const api = axios.create({
  baseURL: "https://mypdflab-backend-production.up.railway.app/api", // make sure this matches your backend route
});

export default api;
