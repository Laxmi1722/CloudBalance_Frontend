import jwtDecode from "jwt-decode";
import { logout } from "../Redux/AuthSlice"


const tokenExpirationMiddleware = (store) => (next) => (action) => {
    const token = store.getState().auth.token;
  
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logout());
        window.location.href = "/login"; 
        return;
      }
    }
  
    return next(action);
  };
  
  export default tokenExpirationMiddleware;