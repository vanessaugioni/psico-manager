import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("user");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}
