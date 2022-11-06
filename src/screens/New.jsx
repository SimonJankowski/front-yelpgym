import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const New = () => {
  const navigate = useNavigate();
  const onFormSubmit = async (event) => {
    event.preventDefault();
    const gym = {
      title: event.target[0].value,
      location: event.target[1].value,
      image: event.target[2].value,
      price: event.target[3].value,
      description: event.target[4].value,
    };
    console.log(gym);
    await axios
      .post("http://localhost:3001/gyms/new", gym)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${res.data}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="row">
        <h1 className="text-center">Add gym</h1>
        <div className="col-6 offset-3">
          <form onSubmit={onFormSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="title">
                Title
              </label>
              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="location">
                Location
              </label>
              <input
                className="form-control"
                type="text"
                id="location"
                name="location"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="image">
                Image
              </label>
              <input
                className="form-control"
                type="text"
                id="image"
                name="image"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="price">
                Price
              </label>

              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  $
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  placeholder="0"
                  name="price"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="description">
                description
              </label>
              <textarea
                className="form-control"
                type="text"
                id="description"
                name="description"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-success">Submit</button>
            </div>
          </form>
          <a href="/gyms">all gyms</a>
        </div>
      </div>
    </>
  );
};

export default New;
