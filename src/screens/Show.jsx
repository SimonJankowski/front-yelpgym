import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import * as Validators from "../helpers/validators";
import { bikini } from "../helpers/bikini";

const Show = () => {
  const [gym, setGym] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getGym();
    if (location?.state?.bikini) {
      const { type, message } = location.state.bikini;
      bikini(type, message);
    }
  }, []);

  function getGym() {
    axios.get(`http://localhost:3001/gyms/${gymid}`).then((res) => {
      setGym(res.data.gym);
    });
  }

  const onDeleteClick = () => {
    axios
      .get(`http://localhost:3001/gyms/${gymid}/delete`)
      .then((res) => {
        if (res.status == 200) {
          navigate("/gyms", {
            state: {
              bikini: {
                type: "success",
                message: "succesfully deleted the gym"
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

  const onReviewSubmit = async (values) => {
    const payload = { review: { ...values.review } };
    await axios
      .post(`http://localhost:3001/gyms/${gymid}/reviews`, payload)
      .then((res) => {
        if (res.status == 200) {
          bikini("success", res.data ?? "review added successfully");
        }
      })
      .catch((error) => {
        bikini("error", error.response.data ?? "something went wrong");
      });
    getGym();
  };

  const onReviewDelete = async (id) => {
    await axios
      .get(`http://localhost:3001/gyms/${gymid}/reviews/${id}`)
      .then((res) => {
        if (res.status == 200) {
          bikini("success", res.data ?? "review deleted");
        }
      })
      .catch((error) => {
        bikini("error", error.response.data ?? "something went wrong");
      });
    getGym();
  };

  const ReviewForm = () => (
    <>
      <h2>Leave a review</h2>
      <Form
        onSubmit={onReviewSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit} className="mb-3">
            <Field name="review[rating]" defaultValue={3}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="rating">
                    Rating
                  </label>
                  <input {...input} name="rating" className="form-range" id="rating" type="range" min="1" max="5" />
                </div>
              )}
            </Field>
            <Field name="review[body]" validate={Validators.required}>
              {({ input, meta }) => (
                <div className="mb-3">
                  <label className="form-label" htmlFor="body">
                    Review
                  </label>
                  <textarea {...input} name="body" className="form-control" id="body" cols="30" rows="3" />
                </div>
              )}
            </Field>
            <div>
              <button className="btn btn-success" disabled={invalid}>
                Add review
              </button>
            </div>
          </form>
        )}
      />
    </>
  );

  const ReviewList = () => {
    return gym.reviews.map((review) => {
      return (
        <div className="mb-3 card" key={review._id}>
          <div className="card-body">
            <h5 className="card-title">Rating: {review.rating}</h5>
            <p className="card-text">Review: {review.body}</p>
            <button onClick={() => onReviewDelete(review._id)} className="btn btn-sm btn-danger">
              Delete
            </button>
          </div>
        </div>
      );
    });
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
        theme="light"
      />
      {gym != undefined ? (
        <>
          <div className="row">
            <div className="col-6">
              <div className="card mb-3">
                <img src={gym.image} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{gym.title}</h5>
                  <p className="card-text">{gym.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item text-muted">{gym.location}</li>
                  <li className="list-group-item">${gym.price} / month </li>
                </ul>
                <div className="card-body">
                  <a className="card-link btn btn-info" href={`/gym/${gymid}/edit`}>
                    edit
                  </a>
                  <button className="ms-1 btn btn-danger" onClick={onDeleteClick}>
                    Delete
                  </button>
                </div>
                <div className="card-footer text-muted">2 days ago</div>
              </div>
            </div>
            <div className="col-6">
              <ReviewForm />
              {gym?.reviews?.length ? <ReviewList /> : null}
            </div>
          </div>
        </>
      ) : (
        <h1>Sorry, this gym doesn´t exist</h1>
      )}
    </>
  );
};

export default Show;
