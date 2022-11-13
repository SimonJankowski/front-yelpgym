import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorScreen = (props) => {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    setError(location.state);
  }, [location]);

  return (
    <div className="row">
      <div className="col-6 offset-3">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">
            {props.title ?? error.data?.name ?? error.data?._message ?? error.message ?? null}
          </h4>
          <p>{error?.data?.message ?? null}</p>
          <hr />
        </div>
        <button className="btn btn-warning" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
