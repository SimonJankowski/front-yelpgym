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
      <h1>Edit Gym</h1>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={gym?.title || ""}
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={gym?.location || ""}
          />
        </div>
        <button>Update Gym</button>
      </form>
      <a href="/gyms">all gyms</a>
    </>
  );
};

export default Edit;
