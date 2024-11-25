import "./App.css";
import HomePage from "./Components/HomePage/HomePage";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import  Profile from "./Components/Profile/Profile";
import Teams from "./Components/Teams/Teams";
import { Route,Routes } from "react-router";
import React,{ useState,useEffect } from "react";
import  {getCookie}  from "./Components/Cookie/Cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const currentUserContext = React.createContext()
let messagesList = [];
function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    getCookie("token") ? jwtDecode(getCookie("token")) : {}
  );

  // Utility: Toast Notifications
  const showMessage = (msg, error = false) => {
    if (msg && typeof error === "boolean" && !messagesList.includes(msg)) {
      messagesList.push(msg);
      toast[error ? "error" : "success"](msg, {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          messagesList = messagesList.filter((e) => e !== msg);
        },
      });
    }
  };

  // Utility: Confirmation Toast
  const confirmationToast = (confirmationMsg) => {
    return new Promise((resolve) => {
      toast.info(
        <div>
          <h6 className="mb-3">{confirmationMsg}</h6>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
              style={{
                padding: "5px 15px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
              style={{
                padding: "5px 15px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          className: "toast-confirm",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const token = getCookie("token");
      setCurrentUser(jwtDecode(token));
    }
  }, [isAuthenticated]);
  return (
    <currentUserContext.Provider
      value={{ ...currentUser, setCurrentUser, showMessage,isAuthenticated }}
    >
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
        <main className="main-content">
          <ToastContainer style={{ width: "fit-content" }} />
          {loading ? (
            <Loader />
          ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teams" element={<Teams />} />
          </Routes>)}
        </main>
        {showHeaderAndFooter && <Footer />}
      </div>
    </currentUserContext.Provider>
  );
}

export default App;
