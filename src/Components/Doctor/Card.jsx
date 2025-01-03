import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpinnerLoading from "../GeneralBlock/Spinner";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useTranslation } from 'react-i18next';

export default function Card() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]); 
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any errors
  const [toastMessage, setToastMessage] = useState(null); // State to handle toast visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctors data
    axios
      .get("https://localhost:7127/api/User/users/1")
      .then((response) => {
        console.log(response.data.doctorsCard);
        setDoctors(response.data.doctorsCard || []); // Ensure it's always an array
        setTimeout(() => {
          setLoading(false); // Data loaded
          setToastMessage({ type: "success", message: t("Doctor Data Loaded Successfully!") });
        }, 1500);
      })
      .catch(() => {
        setError(t("Failed To Load Doctor Data"));
        setLoading(false); // Set loading to false even if there's an error
        setToastMessage({ type: "error", message: t("Failed To Load Doctor Data.") });
      });
  }, [t,doctors]);

  if (loading) {
    return <SpinnerLoading message= {t("Loading Doctor Data, Please Hold On...")} />;
  }

  if (error) {
    return <ToastMessage type={"error"} message={toastMessage.message} />;
  }

  return (
    <>
      {/* Conditionally render ToastMessage if it exists */}
      {toastMessage && <ToastMessage type={toastMessage.type} message={toastMessage.message} />}

      <div className="d-flex flex-wrap">
        {doctors.length > 0 ? (
          doctors.map((ele) => (
            <div className="card m-4" style={{ width: "18rem" }} key={ele.id}>
              <img
                className="card-img-top m-1"
                src={ele.imgpath}
                alt="Doctor illustration"
              />
              <div className="card-body">
                <h5 className="card-title">{ele.name}</h5>
                <p className="card-text">{ele.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/details-doctor/${ele.id}`)}
                >
                  {t("Details")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>{t ("No Doctor Data Found")}</div> 
        )}
      </div>
    </>
  );
}
