import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { bikini } from "../helpers/bikini";

const Gyms = () => {
  const [gyms, setGyms] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios.get("/gyms").then((res) => {
      setGyms(res.data.gyms);
    });
    if (location?.state?.bikini) {
      const { type, message } = location.state.bikini;
      bikini(type, message);
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1> All Gyms</h1>
      <div>
        <a href="/new">add gym</a>
      </div>
      <ul>
        {gyms?.length ? (
          gyms.map((gym, idx) => (
            <div className="card mb-3" key={idx}>
              <div className="row">
                <div className="col-md-4">
                  <img src={gym.image} alt="" className="img-fluid" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{gym.title}</h5>
                    <p className="card-text">{gym.description}</p>
                    <p className="card-text">
                      <small className="text-muted">{gym.location}</small>
                    </p>
                    <a href={`/gym/${gym._id}`} className="btn btn-primary">
                      VIEW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>no data</h1>
        )}
      </ul>
    </>
  );
};

export default Gyms;
