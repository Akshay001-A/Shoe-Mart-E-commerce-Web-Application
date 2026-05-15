import { useState } from "react";
import axios from "axios";

import "./Login.css";

function Register({ setShowRegister }) {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const registerUser = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert("Registration Successful");

      setShowRegister(false);

    } catch (error) {

      alert("User Already Exists");

    }

  };

  return (

    <div className="login-page">

      <form
        className="login-form"
        onSubmit={registerUser}
      >

        <h1>Register 📝</h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Register
        </button>

        <p
          className="switch-text"
          onClick={() => setShowRegister(false)}
        >
          Already have an account? Login
        </p>

      </form>

    </div>
  );
}

export default Register;