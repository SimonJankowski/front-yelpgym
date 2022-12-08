import React from "react";

const ValidationDiv = ({ meta }) => {
  if (meta.touched) {
    if (meta.error) return <div className="invalid-feedback">{meta.error}</div>;
    else return <div className="valid-feedback">Looks good!</div>;
  } else return null;
};

export default ValidationDiv;
