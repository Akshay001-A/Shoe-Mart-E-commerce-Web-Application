import "./Profile.css";

import { useState } from "react";

import axios from "axios";

function Profile({ userInfo }) {

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState(userInfo.name);

  const [email, setEmail] =
    useState(userInfo.email);

  const [password, setPassword] =
    useState("");

  const [address, setAddress] =
    useState(userInfo.address || "");

  // MESSAGE STATE

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  // SAVE PROFILE

  const saveProfile = async () => {

    const nameRegex =
      /^[A-Za-z ]+$/;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // NAME VALIDATION

    if (!nameRegex.test(name)) {

      setMessage(
        "Name should contain only letters and spaces"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    // EMAIL VALIDATION

    if (!emailRegex.test(email)) {

      setMessage(
        "Enter valid email format"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    // PASSWORD VALIDATION

    if (
      password &&
      password.length < 6
    ) {

      setMessage(
        "Password must contain minimum 6 characters"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    // ADDRESS VALIDATION

    if (
      !userInfo.isAdmin &&
      address.length < 10
    ) {

      setMessage(
        "Address should contain minimum 10 characters"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    try {

      const updatedData = {

        name,

        email,

        address,

      };

      if (password) {

        updatedData.password =
          password;

      }

      const { data } =
        await axios.put(

          "http://localhost:5000/api/auth/profile",

          updatedData,

          {

            headers: {

              Authorization:
                `Bearer ${userInfo.token}`,

            },

          }

        );

      localStorage.setItem(

        "userInfo",

        JSON.stringify(data)

      );

      setMessage(
        "Profile Updated Successfully ✅"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

        setEditing(false);

      }, 2000);

    } catch (error) {

      setMessage(
        "Profile Update Failed"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

    }

  };

  return (

    <div className="profile-page">

      <h1 className="profile-title">

        Profile 👤

      </h1>

      <div className="profile-card">

        {/* TOP */}

        <div className="profile-top">

          <div className="profile-avatar">

            {name.charAt(0)}

          </div>

          <div>

            <h2>{name}</h2>

            <span className="role-badge">

              {userInfo.isAdmin

                ? "Admin"

                : "Customer"}

            </span>

          </div>

        </div>

        {/* NORMAL VIEW */}

        {!editing ? (

          <div className="profile-view">

            
            <div className="profile-info-box">

  <span className="info-label">
    Email
  </span>

  <p className="info-value">
    {email}
  </p>

</div>

{!userInfo.isAdmin && (

  <div className="profile-info-box">

    <span className="info-label">
      Delivery Address
    </span>

    <p className="info-value address-text">
      {address || "No Address Added"}
    </p>

  </div>

)}

            <button

              className="edit-btn"

              onClick={() =>

                setEditing(true)

              }

            >

              Edit Profile

            </button>

          </div>

        ) : (

          <div className="profile-form">

            <label>Name</label>

            <input

              type="text"

              value={name}

              onChange={(e) =>

                setName(e.target.value)

              }

            />

            <label>Email</label>

            <input

              type="email"

              value={email}

              onChange={(e) =>

                setEmail(e.target.value)

              }

            />

            <label>

              Change Password

            </label>

            <input

              type="password"

              placeholder="Minimum 6 characters"

              value={password}

              onChange={(e) =>

                setPassword(e.target.value)

              }

            />

            {!userInfo.isAdmin && (

              <>

                <label>

                  Address

                </label>

                <textarea

                  placeholder="Enter delivery address"

                  value={address}

                  onChange={(e) =>

                    setAddress(e.target.value)

                  }

                />

              </>

            )}

            <button

              className="save-btn"

              onClick={saveProfile}

            >

              Save Changes

            </button>

            <button

              className="cancel-btn"

              onClick={() =>

                setEditing(false)

              }

            >

              Cancel

            </button>

          </div>

        )}

        {/* MESSAGE */}

        {

          showMessage && (

            <p className="profile-message">

              {message}

            </p>

          )

        }

        {/* LOGOUT */}

        <button

          className="logout-btn"

          onClick={() => {

            localStorage.removeItem(

              "userInfo"

            );

            window.location.reload();

          }}

        >

          Logout

        </button>

      </div>

    </div>

  );

}

export default Profile;