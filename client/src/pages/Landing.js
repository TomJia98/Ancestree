import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";

const Landing = () => {
  return (
    <main id="landing">
      <h2>Welcome to AncesTree</h2>
      <p>The collaboratively expandable ancestory viewer</p>
      {Auth.loggedIn() ? (
        <>
          <Link to="/main" className="link">
            View your Tree
          </Link>
        </>
      ) : (
        <>
          <p>
            New here?
            <br></br>
            <Link to="/signup" className="link">
              signup
            </Link>
          </p>
          <h3>
            have a linking code?
            <br></br>
            <br></br>
            <Link to="/linking" className="link">
              click here
            </Link>
          </h3>
        </>
      )}
      <br></br>
    </main>
  );
};

export default Landing;
