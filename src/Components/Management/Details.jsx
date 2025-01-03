import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Include the Bootstrap JS

export default function DoctorDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null); // Initialize doctor as null
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // State for toast message

  useEffect(() => {
    axios
      .get(`https://localhost:7127/api/user/user/${id}`)
      .then((response) => {
        console.log(response.data);
        setDoctor(response.data.doctorsCard);
      })
      .catch((error) => {
        console.error(t("Error Loading Staff Data:"), error);
      });
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(false);
    axios
      .delete(`https://localhost:7127/api/user/user-delete/${id}`)
      .then(() => {
        setToastMessage({ message:t( "Successful Deletion"), type: "success" }); // Set toast message
      });

    navigate("/staff");
  };

  // Conditional rendering if doctor is not loaded yet
  if (!doctor) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className="container my-5">
      {toastMessage && (
        <ToastMessage message={toastMessage.message} type={toastMessage.type} />
      )}{" "}
      {/* Render ToastMessage */}
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{t("Staff Details")}</h2>
        </div>
        <div className="card-body">
          <div className="row">
            
              <div className="col-md-6 mb-4">
               <h5 className="fw-bold">{t("Name")}:</h5>
                <p>
                  {doctor.firstName} {doctor.lastName}
                </p>
              </div>
            
            {doctor.hiredate && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Hire Date")}:</h5>
                <p>{doctor.hiredate}</p>
              </div>
            )}
            {doctor.experience && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Experience")}:</h5>
                <p>{doctor.experience}</p>
              </div>
            )}
            {doctor.age && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Age")}:</h5>
                <p>{doctor.age}</p>
              </div>
            )}
            {doctor.phoneNumber && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Phone")}:</h5>
                <p>{doctor.phoneNumber}</p>
              </div>
            )}
            {doctor.gender !== undefined && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Gender")}:</h5>
                <p>{doctor.gender ? "Male" : "Female"}</p>
              </div>
            )}
            {doctor.email && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Email")}:</h5>
                <p>{doctor.email}</p>
              </div>
            )}
            {doctor.departmentName && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Department")}:</h5>
                <p>{doctor.departmentName}</p>
              </div>
            )}
            {doctor.phonenumber && (
              <div className="col-md-6 mb-4">
                <h5 className="fw-bold">{t("Phone")}:</h5>
                <p>{doctor.phonenumber}</p>
              </div>
            )}
          </div>

          <div className="mt-4 d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/update-staff/${id}`)}
            >
              {t("Edit")}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              {t("Delete")}
            </button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">{t("CONFIRM DELETION")}</h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete {doctor.firstName}{" "}
                {`${doctor.lastName}'`}s record?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
