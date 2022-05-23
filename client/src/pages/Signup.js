import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@apollo/client";
 import { ADD_USER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";

const Signup = (props) => {
    // let isLogged = Auth.loggedIn()
    
  const [formState, setFormState] = useState({ name: "", email: "", password: "",  birthday: "" });
  const [createUser, { mutError }] = useMutation( ADD_USER );
  if(mutError){
    console.log(mutError)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState)
    try {
      console.log("entering try")
      const response = await createUser({
        variables: { ...formState},
      });
      if (!response.data) {
        throw new Error("something went wrong!");
      }
console.log(response)
      Auth.login(response.data.addUser.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      name: "", email: "", password: "",  birthday: ""
    });
  };

  return (
    <main>
      <h2>Signup</h2>
          <input
          className="form-input"
          placeholder="Your name"
          name="name"
          type="text"
          value={formState.name}
          onChange={handleChange}
        />
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
          <input
          className="form-input"
          placeholder=" Your Birthday"
          name="birthday"
          type="date"
          value={formState.birthday}
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




export default Signup;
