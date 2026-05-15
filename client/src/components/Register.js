import { useState } from "react";

import axios from "axios";

import "./Login.css";

function Register({ setShowRegister }) {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  const registerUser = async (e) => {

    e.preventDefault();

    // NAME VALIDATION

    const nameRegex =
      /^[A-Za-z ]+$/;

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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      setMessage(
        "Enter Valid Email"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    // PASSWORD VALIDATION

    if (password.length < 6) {

      setMessage(
        "Password must be at least 6 characters"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

      return;

    }

    try {

      await axios.post(

        "http://localhost:5000/api/auth/register",

        {

          name,

          email,

          password,

        }

      );

      setMessage(
        "Registration Successful ✅"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowRegister(false);

      }, 1500);

    } catch (error) {

      setMessage(
        "User Already Exists"
      );

      setShowMessage(true);

      setTimeout(() => {

        setShowMessage(false);

      }, 2000);

    }

  };

  return (

    <div className="login-page">

      <form

        className="login-form"

        onSubmit={registerUser}

      >

        <h1>
          Join Shoe Mart 👟
        </h1>

        <input

          type="text"

          placeholder="Enter Name"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          required

        />

        <input

          type="email"

          placeholder="Enter Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          required

        />

        <input

          type="password"

          placeholder="Enter Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          required

        />

        <button type="submit">

          Register

        </button>

        {

          showMessage && (

            <p className="success-message">

              {message}

            </p>

          )

        }

        <p

          className="switch-text"

          onClick={() =>
            setShowRegister(false)
          }

        >

          Already have an account? Login

        </p>

      </form>

    </div>

  );

}

export default Register;