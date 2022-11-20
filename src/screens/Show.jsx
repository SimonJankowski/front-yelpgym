import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import axios from "axios";
import * as Validators from "../helpers/validators";

const Show = () => {
  const [gym, setGym] = useState(undefined);
  const { gymid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getGym();
  }, []);

  function getGym() {
    axios.get(`http://localhost:3001/gyms/${gymid}`).then((res) => {
      setGym(res.data.gym);
      console.log(res.data.gym);
    });
  }

  const onDeleteClick = () => {
    axios.get(`http://localhost:3001/gyms/${gymid}/delete`).then((res) => {
      if (res.status == 200) {
        navigate("/gyms");
      }
    });
  };

  const onReviewSubmit = async (values) => {
    const payload = { review: { ...values.review } };
    await axios.post(`http://localhost:3001/gyms/${gymid}/reviews`, payload);
    getGym();
  };

  const onReviewDelete = async (id) => {
    await axios.get(`http://localhost:3001/gyms/${gymid}/reviews/${id}`);
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
        <div className="mb-3 card">
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
      {gym != undefined ? (
        <>
          <div className="row">
            <div className="col-6">
              <div class="card mb-3">
                <img src={gym.image} class="card-img-top" alt="..." />
                <div class="card-body">
                  <h5 class="card-title">{gym.title}</h5>
                  <p class="card-text">{gym.description}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item text-muted">{gym.location}</li>
                  <li class="list-group-item">${gym.price} / month </li>
                </ul>
                <div class="card-body">
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
