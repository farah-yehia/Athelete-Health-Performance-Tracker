import { deleteCookie,getCookie } from "../Cookie/Cookie";
import { Back_Origin } from "../../Front_ENV";
import { useNavigation } from "react-router";
import { useContext } from "react";
import { currentUserContext } from "../../App";

const Logout = async() => {
    const{setIsAuthenticated , showMessage , setCurrentUser}=useContext(currentUserContext)
    const navigate=useNavigation();
 const token = getCookie("token");
  if (token) {
    try {
      await axios.post(`${Back_Origin}/admins/logout`); // Adjust endpoint as per your API.
      deleteCookie("token"); // Clear the token cookie.
      setCurrentUser({});
      setIsAuthenticated(false);
      showMessage("You Logged Out Successfully", false);
      navigate("/login");
    } catch (error) {
      showMessage("An error occurred during logout", true);
    }
  }
};

export default Logout;
