import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children, checkInProgress }) => {
  const navigate = useNavigate();
  const location = useLocation();
  if (!user?.username && !checkInProgress) {
    navigate("/login", { state: { bikini: { type: "error", message: "you have to be logged in to add new gym" }, from: location } });
  }
  return children;
};

export default ProtectedRoute;
