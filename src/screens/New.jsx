import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import { bikini } from "../helpers/bikini";
import axios from "axios";
import * as Validators from "../helpers/validators";
import ValidationDiv from "../Components/ValidationDiv";
import { FileField } from "../Components/FileField";
const cloudName = process.env.REACT_APP_CLOUD_NAME;

const New = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.bikini) {
      const { type, message } = location.state.bikini;
      bikini(type, message);
    }
  }, []);

  const onFormSubmit = async (values) => {
    const formData = new FormData();
    const images = [];
    for (let i = 0; i < values.files.length; i++) {
      let file = values.files[i];
      formData.append("file", file);
      formData.append("cloud_name", cloudName);
      formData.append("upload_preset", "nccdxvpu");
      await axios.post("https://api.cloudinary.com/v1_1/dj4wwgoki/auto/upload", formData, { withCredentials: false }).then((res) => {
        console.log(res.data);
        images.push({ url: res.data.url, filename: res.data.public_id });
      });
    }
    console.log(images);
    const payload = { gym: { ...values.gym, images: images } };
    await axios
      .post("/gyms/new", payload)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${res.data}`, {
            replace: true,
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

  const FileField = ({ name, ...props }) => (
    <Field name={name}>
      {({ input: { value, onChange, ...input } }) => (
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images
          </label>
          <input
            {...input}
            type="file"
            onChange={({ target }) => onChange(target.files)} // instead of the default target.value
            multiple
            id="images"
            {...props}
            className="form-control"
          />
        </div>
      )}
    </Field>
  );

  const NewGymForm = () => {
    return (
      <Form
        onSubmit={onFormSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <FileField name="files" />
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
      <div class="row">
        <h1 class="text-center">New Gym</h1>
        <div class="col-md-6 offset-md-3">
          <div class="card shadow">
            <div class="card-body">
              <NewGymForm />
              <a href="/gyms">all gyms</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default New;
