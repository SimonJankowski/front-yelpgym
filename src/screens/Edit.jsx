import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import axios from "axios";
import * as Validators from "../helpers/validators";
import ValidationDiv from "../Components/ValidationDiv";

const Edit = () => {
  const [gymR, setGym] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/gyms/${gymid}`).then((res) => {
      setGym(res.data.gym);
    });
  }, []);

  const onFormSubmit = async (values) => {
    const gym = { gym: { ...values.gym } };
    await axios
      .post(`http://localhost:3001/gyms/${gymid}/update`, gym)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${gymid}`);
        }
      })
      .catch((error) => {
        const mainError = JSON.parse(JSON.stringify(error));
        const response = JSON.parse(JSON.stringify(error.response));
        navigate("/error", { state: { ...mainError, ...response } });
      });
  };

  return (
    <>
      <div className="row">
        <h1 className="text-center">Edit gym</h1>
        <div className="col-6 offset-3">
          <Form
            onSubmit={onFormSubmit}
            initialValues={{ gym: { ...gymR, _id: undefined, reviews: undefined, __v: undefined } }}
            render={({ handleSubmit, invalid, pristine }) => (
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
                <Field name="gym[price]" validate={Validators.required}>
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
                          type="number"
                          id="price"
                          name="price"
                          placeholder="0"
                        />
                      </div>
                      <ValidationDiv meta={meta} />
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
                  <button disabled={invalid || pristine} type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </form>
            )}
          />
          <a href={`/gym/${gymid}`}>back to Gym</a>
        </div>
      </div>
    </>
  );
};

export default Edit;
