import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@apollo/client";
 import { LOGIN_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";

const Login = (props) => {
    let isLogged = Auth.loggedIn()
    
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation( LOGIN_USER );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      email: "",
      password: "",
    });
  };

  return (
    <main>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          className="form-input"
          placeholder="Your email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="******"
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
        />
        <button
         
          style={{ cursor: "pointer" }}
          type="submit"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

export default Login;
