import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorScreen = (props) => {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setError(location.state);
  }, [location]);

  const getErrorText = (error) => {
    if (error?.data?.message) {
      if (typeof error.data === "string") {
        return error.data;
      } else return error?.data?.message;
    } else return null;
  };

  return (
    <div className="row">
      <div className="col-6 offset-3">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">{props.title ?? error.data?.name ?? error.data?._message ?? error.message ?? null}</h4>
          <p>{getErrorText(error)}</p>
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
