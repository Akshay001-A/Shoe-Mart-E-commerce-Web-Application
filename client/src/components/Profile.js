import "./Profile.css";

import { useState } from "react";

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

  // TOP MESSAGE

  const [showMessage, setShowMessage] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // SAVE PROFILE

  const saveProfile = () => {

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

      }, 3000);

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

      }, 3000);

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

      }, 3000);

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

      }, 3000);

      return;

    }

    // UPDATE USER

    const updatedUser = {

      ...userInfo,

      name,

      email,

      address,

      password,

    };

    localStorage.setItem(

      "userInfo",

      JSON.stringify(updatedUser)

    );

    setMessage(
      "Profile Updated Successfully ✅"
    );

    setShowMessage(true);

    setTimeout(() => {

      setShowMessage(false);

    }, 3000);

    setEditing(false);

  };

  return (

    <>

      {

        showMessage && (

          <div className="top-message">

            {message}

          </div>

        )

      }

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

          {/* VIEW MODE */}

          {!editing ? (

            <div className="profile-view">

              <p>

                <strong>Email:</strong>

                {email}

              </p>

              {!userInfo.isAdmin && (

                <p>

                  <strong>Address:</strong>

                  {address || "No Address"}

                </p>

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

            /* EDIT MODE */

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

                  <label>Address</label>

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

    </>

  );

}

export default Profile;