import React from "react";

const Navbar = () => {
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
            <a className="nav-link active" aria-current="page" href="/">
              Home
            </a>
            <a className="nav-link" href="/gyms">
              Gyms
            </a>
            <a className="nav-link" href="/new">
              New Gym
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
