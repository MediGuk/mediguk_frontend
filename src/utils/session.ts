import { clearAccessToken } from "./auth";
import { useNavigate } from "react-router-dom";

export function handleSessionExpired() {
  const navigate = useNavigate();
  clearAccessToken();

  navigate("/");
}