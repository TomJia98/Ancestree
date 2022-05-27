import React from "react";
import Auth from "../../utils/auth";

function Header() {
  const isLogged = Auth.loggedIn();

  const logout = () => {
    Auth.logout();
    window.location.href = "/";
  };
  return (
    <header>
      <h1>AncesTree</h1>
      {isLogged ? (
        <>
          <button onClick={logout}>Log Out</button>
        </>
      ) : (
        <>
          <p>the other option</p>
        </>
      )}
    </header>
  );
}

export default Header;
