import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});
//dxcsdcsdc
// http://127.0.0.1:8000/
//https://colegiologica.onrender.com/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error de API:", error);
    return Promise.reject(error);
  }
);

export default api;
