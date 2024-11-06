import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileInfo = ({ userData }) => {
    const [userInfo, setUserInfo] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState("https://via.placeholder.com/120");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        setUserInfo({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        });
        setProfilePhoto(userData.profilePhoto);
    }, [userData]);

    const toggleEdit = async () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            const response = await axios.post("/api/users/updateuser", {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email
            });
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserInfo({ ...userInfo, [id]: value });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfilePhoto(e.target.result);
            reader.readAsDataURL(file);

            // Upload photo to the server
            const formData = new FormData();
            formData.append("photo", file);

            try {
                const response = await axios.post("/api/users/uploadphoto", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.status === 201) {
                    console.log("Image uploaded successfully");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswords({ ...passwords, [id]: value });
    };

    const saveNewPassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post("/api/users/changepassword", {
                oldPassword: passwords.oldPassword,
                password: passwords.newPassword,
            });
            toast.success(response.data);
            setShowChangePassword(false);
        } catch (error) {
            const errorMessage = error.response?.data || "An error occurred";
            console.log(error.response);
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            {/* Profile Info Section */}
            <div className="profile-info">
                <form className="profile-form">
                    {/* Profile Photo */}
                    <div className="profile-photo">
                        <div className="photo-overlay">
                            <img src={profilePhoto} alt="Profile Photo" className="profile-image" />
                            <div className="upload-icon" onClick={() => document.getElementById('uploadPhoto').click()}>
                                <i className="bx bxs-image-add"></i>
                                <input
                                    type="file"
                                    id="uploadPhoto"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handlePhotoUpload}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="form-fields">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={userInfo.firstName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={userInfo.lastName}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={userInfo.email}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="form-actions">
                        <button type="button" className={isEditing ? "save-btn" : "edit-btn"} onClick={toggleEdit}>
                            {isEditing ? "Save" : "Edit"}
                        </button>
                        <button type="button" className="change-password-btn" onClick={() => setShowChangePassword(true)}>
                            Change Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Section */}
            {showChangePassword && (
                <div className="change-password">
                    <form className="password-form">
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password:</label>
                            <input
                                type="password"
                                id="oldPassword"
                                value={passwords.oldPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="save-btn" onClick={saveNewPassword}>
                                Save Password
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default ProfileInfo;
