import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import axios from "axios";
import * as Validators from "../helpers/validators";
import ValidationDiv from "../Components/ValidationDiv";
const cloudName = process.env.REACT_APP_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

const Edit = ({ user, checkInProgress }) => {
  const [gymR, setGymR] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/gyms/${gymid}`).then((res) => {
      setGymR(res.data.gym);
    });
  }, []);

  useEffect(() => {
    if (!checkInProgress && user && gymR && user?._id !== gymR?.author._id) {
      navigate(`/gym/${gymid}`, {
        state: {
          bikini: {
            type: "error",
            message: "only author can edit the gym"
          }
        }
      });
    }
  }, [user]);

  const getTNUrl = (string) => {
    return string.replace("/upload", "/upload/w_200");
  };

  const onFormSubmit = async (values) => {
    console.log(cloudName);
    console.log(cloudName);
    const formData = new FormData();
    const images = [];
    console.log(values);
    for (let i = 0; i < values.files?.length; i++) {
      let file = values.files[i];
      formData.append("file", file);
      formData.append("cloud_name", cloudName);
      formData.append("upload_preset", uploadPreset);
      await axios.post("https://api.cloudinary.com/v1_1/dj4wwgoki/auto/upload", formData, { withCredentials: false }).then((res) => {
        console.log(res.data);
        images.push({ url: res.data.url, filename: res.data.public_id });
      });
    }
    console.log(images);
    const payload = { gym: { ...values.gym, images: [...images] }, deletedImages: values.deletedImages || [] };
    await axios
      .post(`/gyms/${gymid}/update`, payload)
      .then((res) => {
        if (res.status == 200) {
          navigate(`/gym/${gymid}`, {
            state: {
              bikini: {
                type: "success",
                message: "succesfully updated the gym"
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

  return (
    <>
      <div className="row">
        <h1 className="text-center">Edit gym</h1>
        <div className="col-6 offset-3">
          <Form
            onSubmit={onFormSubmit}
            initialValues={{ gym: { ...gymR, _id: undefined, reviews: undefined, __v: undefined } }}
            render={({ handleSubmit, invalid, pristine }) => (
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
                <FileField name="files" />

                {gymR?.images?.map((img, idx) => (
                  <>
                    <img className="img-thumbnail" src={getTNUrl(img.url)} key={img.url} alt="gym" />
                    <Field name="[deletedImages]" component="input" type="checkbox" value={img.filename} />
                  </>
                ))}

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
