import { logout } from "../Redux/AuthSlice";
import {jwtDecode} from "jwt-decode";

let expirationCheckInterval = null;

const tokenExpirationMiddleware = (store, navigate) => (next) => (action) => {
  if (action.type === "auth/logout") {
    clearInterval(expirationCheckInterval); // Clear the interval on logout
    return next(action);
  }

  const token = store.getState().auth.token;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const issuedTime = decodedToken.iat * 1000; // Issued time in milliseconds
      const expirationTime = issuedTime + 900000; // Add 15 minutes (900000ms)

      if (!expirationCheckInterval) {
        expirationCheckInterval = setInterval(() => {
          const currentTime = Date.now();
          if (expirationTime <= currentTime) {
            console.log("Token expired. Logging out...");
            store.dispatch(logout());
            clearInterval(expirationCheckInterval);
            navigate("/login"); // Use navigate for redirection
          }
        }, 1000); // Check every second
      }

      if (expirationTime <= Date.now()) {
        console.log("Token already expired. Logging out...");
        store.dispatch(logout());
        clearInterval(expirationCheckInterval);
        navigate("/login"); // Use navigate for redirection
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return next(action);
};

export default tokenExpirationMiddleware;