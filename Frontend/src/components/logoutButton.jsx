import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/authSlice.js";
import axios from "axios";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URI

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/auth/logout`); 
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="
        group mt-auto mb-4 flex items-center justify-center
        p-3 rounded-full transition-all duration-200
        hover:bg-white/10  focus:bg-white/10  cursor-pointer
      "
    >
      <i
        className="
          fas fa-sign-out-alt text-white text-xl
          transition-transform duration-200
          group-hover:scale-110 group-focus:scale-110
        "
      />
    </button>
  );
}
