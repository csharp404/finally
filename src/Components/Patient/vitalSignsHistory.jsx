import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { t } from "i18next"; // Ensure translation function is imported

export default function VitalSignsHistory() {
  const { id } = useParams();
  const [vitalSignsHistory, setVitalSignsHistory] = useState([]);

  // Fetch vital signs history on component mount
  useEffect(() => {
    const fetchVitalSignsHistory = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7127/api/Generic/VitalSigns?id=${id}`
        );
        setVitalSignsHistory(response.data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching vital signs history:", error);
        
      }
    };

    fetchVitalSignsHistory();
  }, [id]); // Re-run the effect when `id` changes

  // Check if the history is loaded and contains data
  if (!vitalSignsHistory.length) {
    return <div>{t("There is no vital signs history to display")}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3>{t("Medical History")}</h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t("Date")}</th>
                    <th>{t("Temperature")} (°C)</th>
                    <th>{t("Blood Pressure")} (mmHg)</th>
                    <th>{t("Heart Rate")} (bpm)</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {vitalSignsHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.dateRecorded}</td>
                      <td>{entry.temperature}</td>
                      <td>{entry.bloodPressure}</td>
                      <td>{entry.heartRate}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <h5>{t("Statistics")}</h5>
                <p>
                  <strong>{t("Average Temperature:")}</strong> {vitalSignsHistory[0].temperatureAVG} °C
                </p>
                <p>
                  <strong>{t("Average Heart Rate:")}</strong> {vitalSignsHistory[0].heartRateAVG} bpm
                </p>
                <p>
                  <strong>{t("Average Respiratory Rate:")}</strong> {vitalSignsHistory[0].breathsAVG} breaths/min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
