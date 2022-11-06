import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Show = () => {
  const [gym, setGym] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/gyms/${gymid}`).then((res) => {
      setGym(res.data.gym);
    });
  }, []);

  const onDeleteClick = () => {
    axios.get(`http://localhost:3001/gyms/${gymid}/delete`).then((res) => {
      if (res.status == 200) {
        navigate("/gyms");
      }
    });
  };

  return (
    <>
      {gym != undefined ? (
        <>
          <div className="row">
            <div className="col-6 offset-3">
              <div class="card mb-3">
                <img src={gym.image} class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">{gym.title}</h5>
                  <p class="card-text">{gym.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item text-muted">{gym.location}</li>
                  <li class="list-group-item">${gym.price} / month </li>
                </ul>
                <div class="card-body">
                  <a
                    className="card-link btn btn-info"
                    href={`/gym/${gymid}/edit`}
                  >
                    edit
                  </a>
                  <button className="btn btn-danger" onClick={onDeleteClick}>
                    Delete
                  </button>
                </div>
                <div className="card-footer text-muted">2 days ago</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1>no gym</h1>
      )}
    </>
  );
};

export default Show;
