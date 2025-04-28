import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();

    if (error.response) {
      if (error.response.status === 403) navigate("/403");
      else if (error.response.status === 500) navigate("/500");
      else navigate("/error", { state: { message: error.message } });
    }
    return Promise.reject(error);
  }
);

export default api;
