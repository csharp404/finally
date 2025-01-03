import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpinnerLoading from "../GeneralBlock/Spinner";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useTranslation } from 'react-i18next';

export default function Card() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://localhost:7127/api/User/users/3");
        console.log(response.data.doctorsCard);
        setDoctors(response.data.doctorsCard || []);
        setToastMessage({ type: "success", message: t("Staff Data Loaded Successfully!") });
      } catch (error) {
        setError(t("Failed To Load Staff Data"));
        setToastMessage({ type: "error", message: t("Failed to Load Staff Data.") });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctors]);

  if (loading) {
    return <SpinnerLoading message={t("Loading Staff Data, Please Hold On...")} />;
  }

  if (error) {
    return <ToastMessage type="error" message={error} />;
  }

  return (
    <>
      {toastMessage && <ToastMessage type={toastMessage.type} message={toastMessage.message} />}

      <div className="d-flex flex-wrap">
        {doctors.length > 0 ? (
          doctors.map((ele) => (
            <div className="card m-4" style={{ width: "18rem" }} key={ele.id}>
              <img
                className="card-img-top m-1"
                src={ele.imgpath || "/default-image.png"} // Fallback for missing image
                alt="Doctor illustration"
              />
              <div className="card-body">
                <h5 className="card-title">{ele.name || "Unknown Name"}</h5>
                <p className="card-text">{ele.description || t("No description available.")}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/details-staff/${ele.id}`)}
                >
                  {t("Details")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>{t("No Staff Data Found")}</div>
        )}
      </div>
    </>
  );
}