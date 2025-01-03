import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; 
import { useTranslation } from 'react-i18next';

export default function WriteVitalSigns() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id } = useParams();

  // Initialize vital signs state
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    breaths: "",
    patientId: id,
  });

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitalSigns((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7127/api/Generic/create-VitalSigns",
        vitalSigns
      );
      console.log("Response:", response.data);
      // Redirect to the vital signs history page upon success
      navigate(`/history-vital-signs/${id}`);
    } catch (error) {
      console.error("Error saving vital signs:", error.response || error);
      alert(t("An error occurred while saving the vital signs."));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>{t("Vital Signs Form")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Temperature Field */}
                <div className="mb-3">
  <label htmlFor="temperature" className="form-label">
    <strong>{t("Temperature")}</strong>({t("°C")}) <small>{("normal range:36.5-37.5")}</small>  
  </label>
  <input
    type="number"
    step="0.1"
    id="temperature"
    name="temperature"
    className="form-control"
    value={vitalSigns.temperature}
    onChange={handleInputChange}
    required
    min="24"
    max="44"
  />
  {vitalSigns.temperature && (vitalSigns.temperature < 24 || vitalSigns.temperature > 44) && (
    <div className="text-danger">
      {t("Temperature must be between 24°C and 44°C.")}
    </div>
  )}
</div>


                {/* Blood Pressure Field */}
                <div className="mb-3">
                  <label htmlFor="bloodPressure" className="form-label">
                    {t("Blood Pressure")} ({t("mmHg")})
                  </label>
                  <input
                    type="text"
                    id="bloodPressure"
                    name="bloodPressure"
                    className="form-control"
                    placeholder="high / low"
                    value={vitalSigns.bloodPressure}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Heart Rate Field */}
                <div className="mb-3">
                  <label htmlFor="heartRate" className="form-label">
                    {t("Heart Rate")} ({t("(BPM)")})
                  </label>
                  <input
                    type="number"
                    id="heartRate"
                    name="heartRate"
                    className="form-control"
                    value={vitalSigns.heartRate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Respiratory Rate Field */}
                <div className="mb-3">
                  <label htmlFor="breaths" className="form-label">
                    {t("Respiratory Rate")} ({t("Breaths/min")})
                  </label>
                  <input
                    type="number"
                    id="breaths"
                    name="breaths"
                    className="form-control"
                    value={vitalSigns.breaths}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 py-2">
                  {t("Save")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
