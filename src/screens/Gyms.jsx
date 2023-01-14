import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { bikini } from "../helpers/bikini";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = "pk.eyJ1Ijoic2ltb25qYXkiLCJhIjoiY2t1czZvMGJjMWpoNjJwcXJtNDJqZmp1biJ9.9MMga3s7vQYPW9v67AEATg";

const Gyms = () => {
  const [gyms, setGyms] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const location = useLocation();

  useEffect(() => {
    axios.get("/gyms").then((res) => {
      setGyms(res.data.gyms);
    });
    if (location?.state?.bikini) {
      const { type, message } = location.state.bikini;
      bikini(type, message);
    }
  }, []);

  useEffect(() => {
    if (map.current || !gyms.length) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-103.5917, 40.6699],
      zoom: 3
    });
  });
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("load", () => {
      map.current.resize();
      map.current.addSource("gyms", {
        type: "geojson",
        data: { features: gyms },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "gyms",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#51bbd6", 5, "#f1f075", 15, "#f28cb1"],
          "circle-radius": ["step", ["get", "point_count"], 20, 5, 30, 15, 40]
        }
      });

      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "gyms",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "gyms",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });
      map.current.on("click", "clusters", (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        });
        const clusterId = features[0].properties.cluster_id;
        map.current.getSource("gyms").getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
      });
      map.current.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const text = e.features[0].properties.popUpMarkup;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(`${text}`).addTo(map.current);
      });

      map.current.on("mouseenter", "clusters", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });
  });

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
      <div ref={mapContainer} className="clustermap-container" />
      <ul className="gymList">
        <h1> All Gyms</h1>
        {gyms?.length ? (
          gyms.map((gym, idx) => (
            <div className="card mb-3" key={idx}>
              {console.log(gym)}
              <div className="row">
                <div className="col-md-4">
                  <img src={gym.images[0].url} alt="" className="img-fluid" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{gym.title}</h5>
                    <p className="card-text">{gym.description}</p>
                    <p className="card-text">
                      <small className="text-muted">{gym.location}</small>
                    </p>
                    <a href={`/gym/${gym._id}`} className="btn btn-primary">
                      VIEW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>no data</h1>
        )}
      </ul>
    </>
  );
};

export default Gyms;
