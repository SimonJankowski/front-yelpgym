import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import axios from "axios";
import * as Validators from "../helpers/validators";
import ValidationDiv from "../Components/ValidationDiv";

const New = () => {
  const navigate = useNavigate();
  const onFormSubmit = async (values) => {
    const payload = { gym: { ...values.gym } };
    await axios
      .post("/gyms/new", payload)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${res.data}`, {
            state: {
              bikini: {
                type: "success",
                message: "succesfully added the gym"
              }
            }
          });
        }
      })
      .catch((error) => {
        const mainError = JSON.parse(JSON.stringify(error));
        const response = JSON.parse(JSON.stringify(error.response));
        navigate("/error", { state: { ...mainError, ...response } });
      });
  };

  const NewGymForm = () => {
    return (
      <Form
        onSubmit={onFormSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Field name="gym[title]" validate={Validators.required}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="Name">
                    Name
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="text"
                    id="Name"
                    name="Name"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <Field name="gym[location]" validate={Validators.required}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="location">
                    Location
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="text"
                    id="location"
                    name="location"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <Field name="gym[image]" validate={Validators.required}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="image">
                    image
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="text"
                    id="image"
                    name="image"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <Field
              name="gym[price]"
              validate={Validators.composeValidators(Validators.required, Validators.mustBeNumber, Validators.minValue(0))}
            >
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="price">
                    Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      $
                    </span>
                    <input
                      {...input}
                      className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                      type="text"
                      id="price"
                      name="price"
                      placeholder="0"
                    />
                    <ValidationDiv meta={meta} />
                  </div>
                </div>
              )}
            </Field>
            <Field name="gym[description]" validate={Validators.required}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="text"
                    id="description"
                    name="description"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <div className="mb-3">
              <button disabled={invalid} type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </form>
        )}
      />
    );
  };

  return (
    <>
      <div className="row">
        <h1 className="text-center">Add gym</h1>
        <div className="col-6 offset-3">
          <NewGymForm />
          <a href="/gyms">all gyms</a>
        </div>
      </div>
    </>
  );
};

export default New;
