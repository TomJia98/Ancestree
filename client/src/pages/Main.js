import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_PERSON, QUERY_PERSONS } from '../utils/queries';
import Auth from "../utils/auth";
const Main = () => {
const user = Auth.getProfile();
    const {loading, data} = useQuery(


    )
  return (
    <main>
      { Auth.loggedIn() ? (<>



        </>):(<>
            <p>It looks like you are not logged in! please log in or signup <Link to="/login">here</Link></p>
        </>)}
    </main>
  );
};

export default Main;
