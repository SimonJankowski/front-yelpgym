import React from "react";

const ValidationDiv = ({ meta }) => {
  if (meta.touched) {
    if (meta.error) return <div class="invalid-feedback">{meta.error}</div>;
    else return <div class="valid-feedback">Looks good!</div>;
  } else return null;
};

export default ValidationDiv;
