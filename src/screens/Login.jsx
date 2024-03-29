import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import * as Validators from "../helpers/validators";
import { bikini } from "../helpers/bikini";
import loginPic from "../assets/loginPic.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.from ?? "/gyms";
  useEffect(() => {
    if (location?.state?.bikini) {
      const { type, message } = location.state.bikini;
      bikini(type, message);
    }
  }, []);

  const onSubmit = async (values) => {
    const payload = { ...values };
    await axios
      .post("/login", payload)
      .then((res) => {
        if (res.status == 200) {
          navigate(path, {
            replace: true,
            state: {
              bikini: {
                type: "success",
                message: "Welcome back"
              }
            }
          });
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          bikini("error", "Wrong credentials, try again");
        } else {
          const mainError = JSON.parse(JSON.stringify(error));
          const response = JSON.parse(JSON.stringify(error.response));
          navigate("/error", { state: { ...mainError, ...response } });
        }
      });
  };

  const LoginForm = () => {
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={(e) => handleSubmit(e)}>
            <Field name="username" validate={Validators.composeValidators(Validators.required)}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "") : ""}`}
                    type="text"
                    id="username"
                    name="username"
                    autofocus
                  />
                </div>
              )}
            </Field>
            <Field name="password" validate={Validators.composeValidators(Validators.required)}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    {...input}
                    className={`form-control ${meta.touched ? (meta.error ? "is-invalid" : "") : ""}`}
                    type="password"
                    id="password"
                    name="password"
                  />
                </div>
              )}
            </Field>
            <div className="mb-3">
              <button disabled={invalid} type="submit" className="btn btn-success w-100">
                Login
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
                <h5 class="card-title">Login</h5>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
