import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser, selectUserChecked } from "../authSlice";
import { selectUserInfo } from "../../user/userSlice";

function ProtectedAdmin({ children }) {
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);
  const userChecked = useSelector(selectUserChecked);

  if (!user && !userChecked) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }
  if (user && !userChecked && userInfo.role !== "admin") {
    return <Navigate to="/" replace={true}></Navigate>;
  }
  return children;
}

export default ProtectedAdmin;
