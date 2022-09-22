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
    };
    console.log(gym);
    await axios
      .post("http://localhost:3001/gyms/new", gym)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${res.data._id}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <h1>Add gym</h1>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </div>
        <button>Submit</button>
      </form>
      <a href="/gyms">all gyms</a>
    </>
  );
};

export default New;
