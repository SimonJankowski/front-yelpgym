import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Edit = () => {
  const [gym, setGym] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/gyms/${gymid}`).then((res) => {
      setGym(res.data.gym);
    });
  }, []);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const gym = {
      title: e.target[0].value,
      location: e.target[1].value,
      image: e.target[2].value,
      price: e.target[3].value,
      description: e.target[4].value,
    };
    console.log(gym);
    await axios
      .post(`http://localhost:3001/gyms/${gymid}/update`, gym)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${gymid}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="row">
        <h1 className="text-center">Edit gym</h1>
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
                defaultValue={gym?.title || ""}
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
                defaultValue={gym?.location || ""}
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
                defaultValue={gym?.image || ""}
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
                  defaultValue={gym?.price || ""}
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
                defaultValue={gym?.description || ""}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-info">Update Gym</button>
            </div>
          </form>
          <a href={`/gym/${gymid}`}>back to Gym</a>
        </div>
      </div>
    </>
  );
};

export default Edit;
