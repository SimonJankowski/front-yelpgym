import React, { useEffect, useState } from "react";
import axios from "axios";

const Gyms = () => {
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/gyms").then((res) => {
      setGyms(res.data.gyms);
    });
  }, []);

  return (
    <>
      <h1> All Gyms</h1>
      <div>
        <a href="/new">add gym</a>
      </div>
      <ul>
        {gyms?.length ? (
          gyms.map((gym, idx) => (
            <li>
              <a href={`/gym/${gym._id}`}>{gym.title}</a>
            </li>
          ))
        ) : (
          <h1>no data</h1>
        )}
      </ul>
    </>
  );
};

export default Gyms;
