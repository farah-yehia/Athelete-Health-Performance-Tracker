import { deleteCookie,getCookie } from "../Cookie/Cookie";
import { Back_Origin } from "../../Front_ENV";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { currentUserContext } from "../../App";

const Logout = async () => {
  const { setIsAuthenticated, showMessage, setCurrentUser, currentUser } =
    useContext(currentUserContext);
  const navigate = useNavigate();

  const token = getCookie("token");
  if (token) {
    try {
      // Determine endpoint based on user role
      const endpoint =
        currentUser?.role === "admin"
          ? `${Back_Origin}/admins/logout`
          : `${Back_Origin}/logout`;

      // Call the logout API
      await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear authentication state and redirect
      deleteCookie("token"); // Remove the token from cookies
      setCurrentUser({});
      setIsAuthenticated(false);
      showMessage("You Logged Out Successfully", false);
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout Error:", error);
      showMessage("An error occurred during logout", true);
    }
  }
};

export default Logout;
