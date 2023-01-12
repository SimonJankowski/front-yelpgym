import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import * as Validators from "../helpers/validators";
import { bikini } from "../helpers/bikini";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = "pk.eyJ1Ijoic2ltb25qYXkiLCJhIjoiY2t1czZvMGJjMWpoNjJwcXJtNDJqZmp1biJ9.9MMga3s7vQYPW9v67AEATg";

const Show = ({ user }) => {
  const [gym, setGym] = useState(undefined);
  const mapContainer = useRef(null);
  const map = useRef(null);
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

  useEffect(() => {
    if (map.current || gym == undefined) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [gym.geometry?.coordinates?.[0] ?? 0, gym.geometry?.coordinates?.[1] ?? 0],
      zoom: 9
    });
    new mapboxgl.Marker()
      .setLngLat([gym.geometry?.coordinates?.[0] ?? 0, gym.geometry?.coordinates?.[1] ?? 0])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${gym.title}</h3><p>${gym.location}</p>`))
      .addTo(map.current);
    map.current.addControl(new mapboxgl.NavigationControl());
  }, [gym]);

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
    console.log(values);
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
        render={({ handleSubmit, invalid, form }) => (
          <form onSubmit={handleSubmit} className="mb-3">
            <Field name="review[rating]" className="mb-3" validate={Validators.required}>
              {({ input, meta }) => (
                <fieldset className="starability-basic">
                  <input type="radio" id="no-rate" className="input-no-rate" name="review[rating]" defaultChecked aria-label="No review." />
                  <input {...input} type="radio" id="first-rate1" name="review[rating]" value="1" />
                  <label htmlFor="first-rate1" title="Terrible">
                    1 star
                  </label>
                  <input {...input} type="radio" id="first-rate2" name="review[rating]" value="2" />
                  <label htmlFor="first-rate2" title="Not good">
                    2 stars
                  </label>
                  <input {...input} type="radio" id="first-rate3" name="review[rating]" value="3" />
                  <label htmlFor="first-rate3" title="Average">
                    3 stars
                  </label>
                  <input {...input} type="radio" id="first-rate4" name="review[rating]" value="4" />
                  <label htmlFor="first-rate4" title="Very good">
                    4 stars
                  </label>
                  <input {...input} type="radio" id="first-rate5" name="review[rating]" value="5" />
                  <label htmlFor="first-rate5" title="Amazing">
                    5 stars
                  </label>
                </fieldset>
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
            {review.author?.username ? <h6 className="card-title mb-2 text-muted">{review.author?.username} </h6> : null}
            <p className="starability-result" data-rating={review.rating}>
              Rated: {review.rating} stars
            </p>
            <p className="card-text">Review: {review.body}</p>
            {review.author?._id == user?._id && user._id != undefined ? (
              <button onClick={() => onReviewDelete(review._id)} className="btn btn-sm btn-danger">
                Delete
              </button>
            ) : null}
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
              <div id="gymcarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {gym.images.map((img, idx) => (
                    <div key={idx} className={"carousel-item" + (idx === 0 ? " active" : "")}>
                      <img src={img.url} className="d-block w-100" alt="" />
                    </div>
                  ))}
                </div>
                {gym.images.length > 1 ? (
                  <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#gymcarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#gymcarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                ) : null}
              </div>

              <div className="card mb-3">
                {console.log(gym)}

                <div className="card-body">
                  <h5 className="card-title">{gym.title}</h5>
                  <p className="card-text">{gym.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item text-muted">{gym.location}</li>
                  <li className="list-group-item">Submited by {gym.author.username}</li>
                  <li className="list-group-item">${gym.price} / month </li>
                </ul>
                {user && gym.author?._id === user._id ? (
                  <div className="card-body">
                    <a className="card-link btn btn-info" href={`/gym/${gymid}/edit`}>
                      edit
                    </a>
                    <button className="ms-1 btn btn-danger" onClick={onDeleteClick}>
                      Delete
                    </button>
                  </div>
                ) : null}
                <div className="card-footer text-muted">2 days ago</div>
              </div>
            </div>
            <div className="col-6">
              <div>
                <div ref={mapContainer} className="map-container" />
              </div>
              {user ? <ReviewForm /> : null}
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
