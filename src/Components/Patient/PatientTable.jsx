import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import EditPatient from "../GeneralBlock/EditPatient";
import { jwtDecode } from "jwt-decode";

export default function PatientList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger re-fetch and re-render

  // Separate state for each search box
  const [searchId, setSearchId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");

  let token;
  const tokenn = localStorage.getItem("token");
  if (!tokenn) return null;

  try {
    const x = jwtDecode(tokenn);
    token = x.role;
    console.log(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("https://localhost:7127/api/Patient/Get");
        const data = await response.json();
        console.log(data.patients);
        setPatients(data.patients || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatients();
  }, [refreshKey]); // Re-fetch patients whenever refreshKey changes

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `https://localhost:7127/api/Patient/Delete/${selectedItem.id}`
      );
      if (response.status === 200) {
        setPatients(
          patients.filter((patient) => patient.id !== selectedItem.id)
        );
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Filter logic based on all search fields
  const filteredPatients = patients.filter((patient) => {
    console.log(patient);
    console.log(searchId);

    const matchesId = searchId
      ? patient.code.toLowerCase().includes(searchId)
      : true;
    const matchesPhone = searchPhone
      ? patient.phoneNumber.toLowerCase().includes(searchPhone.toLowerCase())
      : true;
    const matchesName = searchName
      ? patient.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchesId && matchesPhone && matchesName;
  });
  return (
    <>
      <div
        className="container d-flex flex-row gap-3"
        style={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px", // Optional: to limit the width for larger screens
          width: "100%", // Ensures it takes up full width on smaller screens
          margin: "0 auto", // Centers the container on larger screens
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          aria-label="Search by ID"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search by Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          aria-label="Search by Phone"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          aria-label="Search by Name"
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">{t("Id")}</th>

            <th scope="col">{t("Name")}</th>
            <th scope="col">{t("Admission Date")}</th>
            <th scope="col">{t("Department")}</th>
            <th scope="col">{t("PCD Name")}</th>
            <th scope="col">{t("Age")}</th>
            <th scope="col">{t("Phone")}</th>
            <th scope="col">{t("Gender")}</th>
            <th scope="col">{t("Address")}</th>
            <th scope="col">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr
              key={patient.id}
              className="table-light"
              style={{ cursor: "pointer" }}
            >
              <td>{patient.code}</td>

              <td>{patient.name}</td>
              <td>{new Date(patient.admissionDate).toLocaleString()}</td>
              <td>{patient.department}</td>
              <td>{patient.pcd}</td>
              <td>{patient.age}</td>
              <td>{patient.phoneNumber}</td>
              <td>{patient.gender === "Male" ? t("Male") : t("Female")}</td>
              <td>{patient.address}</td>
              <td>
                <div className="dropdown">
                  {(token == "ManagementStaff" || token == "Admin") && (
                    <EditPatient
                      id={patient.id}
                      onUpdate={() => setRefreshKey((prev) => prev + 1)}
                    />
                  )}
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id={`dropdownMenuButton-${patient.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {t("Actions")}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby={`dropdownMenuButton-${patient.id}`}
                  >
                    {(token == "ManagementStaff" || token == "Admin") && (
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDeleteClick(patient)}
                        >
                          {t("Delete")}
                        </button>
                      </li>
                    )}

                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/all-prescription/${patient.id}`}
                        >
                          {t("All Prescription")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "Nurse" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-vital-signs/${patient.id}`}
                        >
                          {t("issue vital signs")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Nurse" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/history-vital-signs/${patient.id}`}
                        >
                          {t("History vital signs")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Pharmacist" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/prescription/${patient.id}`}
                        >
                          {t("Prescription")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "Doctor" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-prescription/${patient.id}`}
                        >
                          {t("Issue Prescription")}
                        </NavLink>
                      </li>
                    )}

                    {(token == "Doctor" || token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-diagnosis/${patient.id}`}
                        >
                          {t("Issue Diagnosis")}
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to={`/diagnosis/${patient.id}`}
                      >
                        {t("get Diagnosis")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to={`/all-diagnosis/${patient.id}`}
                      >
                        {t("get all Diagnosis")}
                      </NavLink>
                    </li>
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/all-sick-leaves/${patient.id}`}
                        >
                          {t("get all sickleaves")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/sick-leave/${patient.id}`}
                        >
                          {t("get sickleave")}
                        </NavLink>
                      </li>
                    )}
                    {(token == "ManagementStaff" ||
                      token == "Doctor" ||
                      token == "Admin") && (
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/create-sick-leave/${patient.id}`}
                        >
                          {t("issue sickleave")}
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("CONFIRM DELETION")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleDeleteCancel}
                ></button>
              </div>
              <div className="modal-body">
                {t("Are you sure you want to delete this record?")}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDeleteCancel}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
