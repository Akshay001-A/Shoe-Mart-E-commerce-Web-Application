import { useState } from "react";

import axios from "axios";

import "./Login.css";

function Login({ setShowRegister }) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  const loginUser = async (e) => {

    e.preventDefault();

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

    try {

      const { data } =
        await axios.post(

          "http://localhost:5000/api/auth/login",

          {

            email,

            password,

          }

        );

      localStorage.setItem(

        "userInfo",

        JSON.stringify(data)

      );

      setMessage(
        "Login Successful ✅"
      );

      setShowMessage(true);

      setTimeout(() => {

        window.location.reload();

      }, 1500);

    } catch (error) {

      setMessage(
        "Invalid Email or Password"
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
        onSubmit={loginUser}
      >

        <h1>
          Welcome Back 🔥
        </h1>

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

          Login

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
            setShowRegister(true)
          }

        >

          Create New Account

        </p>

      </form>

    </div>

  );

}

export default Login;