import React, { useEffect } from "react";
import axios from "axios";
import { bikini } from "../helpers/bikini";
import "./LandingPage.css";

const LandingPage = (props) => {
  const onLogoutClick = async () => {
    await axios.get("/logout").then((res) => {
      if (res.status == 200) {
        bikini("success", res.data);
        props.setUser(undefined);
      }
    });
  };
  return (
    <div className="d-flex vh-100 text-center text-white bg-dark" id="virtualBody">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">YelpGym</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a href="#" aria-current="page" className="nav-link active home">
                Home
              </a>
              <a href="/gyms" className="nav-link home">
                Gyms
              </a>
              {!props.user ? (
                <>
                  <a href="/login" aria-current="page" className="nav-link home">
                    Login
                  </a>
                  <a href="/register" aria-current="page" className="nav-link home">
                    Register
                  </a>
                </>
              ) : (
                <a href="#" aria-current="page" onClick={onLogoutClick} className="nav-link home">
                  Logout
                </a>
              )}
            </nav>
          </div>
        </header>
        <main className="px-3">
          <h1>YelpGym</h1>
          <p className="lead">
            Welcome to Yelp-Gym! <br /> Jump right in and check the gyms nearby <br />
            Feel free to share some of your own experience and comment on others!
          </p>
          <a href="/gyms" className="btn btn-lg btn-secondary bg-white">
            View Gyms
          </a>
        </main>
        <footer className="mt-auto text-white-50">@2023</footer>
      </div>
    </div>
  );
};

export default LandingPage;
