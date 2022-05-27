import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";

const Landing = () => {
  if (Auth.loggedIn()) console.log(Auth.getProfile());
  return (
    <main>
      {Auth.loggedIn() ? (
        <>
          <Link to="/main">IsLogged</Link>
        </>
      ) : (
        <>
          <p>IsntLogged</p>
        </>
      )}
      <h2>Welcome to AncesTree</h2>
      <Link to="/login">Login</Link>
      <Link to="/signup">signup</Link>
      <h3>
        have a linking code? <Link to="/linking">click here</Link>
      </h3>
    </main>
  );
};

export default Landing;
