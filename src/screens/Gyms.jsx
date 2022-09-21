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
      <ul>
        {gyms?.length ? (
          gyms.map((gym, idx) => <li>{gym.title}</li>)
        ) : (
          <h1>no data</h1>
        )}
      </ul>
    </>
  );
};

export default Gyms;
