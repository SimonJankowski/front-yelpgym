import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import * as Validators from "../helpers/validators";
import ValidationDiv from "../Components/ValidationDiv";
import { bikini } from "../helpers/bikini";
import loginPic from "../assets/loginPic.jpg";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.from ?? "/gyms";
  const onSubmit = async (values) => {
    const payload = { ...values };
    await axios
      .post("/register", payload)
      .then((res) => {
        if (res.status == 200) {
          navigate(path, {
            state: {
              bikini: {
                type: "success",
                message: "Welcome to YelpGym!"
              }
            }
          });
        }
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          bikini("error", error.response.data?.message || error.response.data);
        } else {
          const mainError = JSON.parse(JSON.stringify(error));
          const response = JSON.parse(JSON.stringify(error.response));
          navigate("/error", { state: { ...mainError, ...response } });
        }
      });
  };

  const RegisterForm = () => {
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Field name="username" validate={Validators.composeValidators(Validators.required, Validators.isLong(4))}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="text"
                    id="username"
                    name="username"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <Field name="email" validate={Validators.composeValidators(Validators.required, Validators.isEmail)}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="email"
                    id="email"
                    name="email"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <Field name="password" validate={Validators.composeValidators(Validators.required, Validators.isLong(4))}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "is-valid") : ""}`}
                    type="password"
                    id="password"
                    name="password"
                  />
                  <ValidationDiv meta={meta} />
                </div>
              )}
            </Field>
            <div className="mb-3">
              <button disabled={invalid} type="submit" className="btn btn-success w-100">
                Register
              </button>
            </div>
          </form>
        )}
      />
    );
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div class="container justify-content-center align-items-center mt-1">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
            <div class="card shadow">
              <img src={loginPic} alt="" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title">Register</h5>
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
