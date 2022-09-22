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
          <h1>{gym.title}</h1>
          <h2>{gym.location}</h2>
        </>
      ) : (
        <h1>no gym</h1>
      )}
      <footer>
        <a href={`/gym/${gymid}/edit`}>edit</a>{" "}
        <button onClick={onDeleteClick}>Delete</button>
        <br />
        <a href="/gyms">All gyms</a>
        <br />
      </footer>
    </>
  );
};

export default Show;
