import React from "react";
import axios from "axios";
import { bikini } from "../helpers/bikini";

const Navbar = (props) => {
  const onLogoutClick = async () => {
    await axios.get("/logout").then((res) => {
      if (res.status == 200) {
        bikini("success", res.data);
        props.setUser(undefined);
      }
    });
  };

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          YelpGym
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link" aria-current="page" href="/">
              Home
            </a>
            <a className="nav-link" href="/gyms">
              Gyms
            </a>
            <a className="nav-link" href="/new">
              New Gym
            </a>
          </div>
          <div className="navbar-nav ms-auto">
            {props.user ? (
              <a className="nav-link" href="#" onClick={onLogoutClick}>
                Logout
              </a>
            ) : (
              <>
                <a className="nav-link" href="/register">
                  Register
                </a>
                <a className="nav-link" href="/login">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
