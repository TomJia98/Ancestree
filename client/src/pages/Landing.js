import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

const Landing = () => {
  return (
    <main>
      <h2>Welcome to AncesTree</h2>
      <Link to="/login">Login</Link>
      <Link to="/signup">signup</Link>
    </main>
  );
};

export default Landing;
