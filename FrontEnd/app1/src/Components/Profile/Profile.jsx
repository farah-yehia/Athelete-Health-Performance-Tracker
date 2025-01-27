
import React, { useState, useContext, useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { currentUserContext } from "../../App";
import { getCookie, updateCookie } from "../Cookie/Cookie";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";
import { Back_Origin } from "../../Front_ENV";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    oldpassword: "",
    newpassword: "",
    name: "",
    username: "",
    role: "",
  });
  const navigate = useNavigate();
  const { showMessage, currentUser, setLoading, setCurrentUser } =
    useContext(currentUserContext);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name,
        username: currentUser.username,
        oldpassword: "",
        newpassword: "",
        role: currentUser.role,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  const verifyResetToken = async () => {
    const token = currentUser?.token || getCookie("token");

    if (!token) {
      showMessage("Token is missing. Please log in again.", true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Back_Origin}/verifyResetToken/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // Ensure proper Bearer format
        },
        body: JSON.stringify({ role: currentUser.role }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        showMessage("Token is valid", false);
      } else {
        showMessage(data.error || "Token validation failed.", true);
      }
    } catch (error) {
      showMessage("Error verifying token. Try again later.", true);
    } finally {
      setLoading(false);
    }
  };

  const submitEditHandler = async () => {
    setLoading(true);
    try {
      const endpoint =
        currentUser.role === "admin"
          ? `${Back_Origin}/updateUserAdmin/${currentUser.id}`
          : `${Back_Origin}/updateUser/${currentUser.id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: getCookie("token"),
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
          role: currentUser.role,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        // Display success toast
        showMessage(data.message || "Profile updated successfully.", false);

        // Update the local state and cookies with new user data
        const updatedUser = data.data; // Ensure backend sends updated user
        if (updatedUser) {
          setCurrentUser(updatedUser);
          setProfileData({
            name: updatedUser.name,
            username: updatedUser.username,
          });
        }

        setIsEditing(false); // Exit edit mode
      } else {
        throw new Error(data.error || "Failed to update profile.");
      }
    } catch (error) {
      showMessage(error.message || "Unexpected error occurred.", true);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    const token = `Bearer ${getCookie("token")}`;

    if (!token) {
      showMessage("Token is missing. Please log in again.", true);
      return;
    }

    if (!profileData.oldpassword || !profileData.newpassword) {
      showMessage("Please fill in all required fields", true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${Back_Origin}/resetPassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          oldpassword: profileData.oldpassword,
          newpassword: profileData.newpassword,
          role: currentUser.role,
        }),
      });

      const data = await response.json();
      if (!data.error) {
        showMessage("Password changed successfully", false);
        setProfileData({ ...profileData, oldpassword: "", newpassword: "" });
      } else {
        showMessage(data.error, true);
      }
    } catch (error) {
      showMessage("Error changing password. Try again later.", true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="profile-section">
      <MDBContainer className="profile-container">
        <MDBRow className="profile-row">
          <MDBCol lg="4" className="text-center">
            <MDBCard>
              <MDBCardBody className="profile-card-body">
                <MDBCardImage
                  src={`https://ui-avatars.com/api/?background=b4182d&color=e0e0e0&rounded=true&name=${currentUser.name}`}
                  alt="avatar"
                  className="rounded-circle mb-3 profile-avatar"
                />
                <p className="profile-role">{currentUser.role}</p>
                <button
                  className={`btn ${
                    isEditing ? "ProfileSaveButton" : "ProfileEditButton"
                  }`}
                  onClick={isEditing ? toggleEditMode : toggleEditMode}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <strong>Name:</strong>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <TextField
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        fullWidth
                      />
                    ) : (
                      <div>{profileData.name}</div>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <strong>Username:</strong>
                  </MDBCol>
                  <MDBCol sm="9">
                    {isEditing ? (
                      <TextField
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        fullWidth
                      />
                    ) : (
                      <div>{profileData.username}</div>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                {isEditing && (
                  <>
                    <MDBRow>
                      <MDBCol sm="3">
                        <strong>Old Password:</strong>
                      </MDBCol>
                      <MDBCol sm="9">
                        <TextField
                          name="oldpassword"
                          type="password"
                          value={profileData.oldpassword}
                          onChange={handleChange}
                          fullWidth
                        />
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <strong>New Password:</strong>
                      </MDBCol>
                      <MDBCol sm="9">
                        <TextField
                          name="newpassword"
                          type="password"
                          value={profileData.newpassword}
                          onChange={handleChange}
                          fullWidth
                        />
                      </MDBCol>
                    </MDBRow>
                  </>
                )}
                <button
                  className="btn ProfileSaveButton"
                  onClick={changePassword}
                  disabled={
                    !profileData.oldpassword || !profileData.newpassword
                  }
                >
                  Change Password
                </button>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default Profile;