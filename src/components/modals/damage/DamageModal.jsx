import { useEffect, useState, useContext } from "react";
import "./DamageModal.css";
import axios from "axios";
import ConfirmModal from "../booking/ConfirmModal";
import { ManagerContext } from "../../../context/ManagerContext";

export default function DamageModal({
  show,
  onClose,
  onConfirm,
  setSelectedDamages,
  selectedDamages,
  setIsLastModal,
}) {
  if (!show) return null;

  const [selectedDamage, setSelectedDamage] = useState({
    damagetypeid: "",
    standardcost: "",
    note: "",
  });
  const [damages, setDamages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError, BASE_URL } = useContext(ManagerContext);
  const url = `${BASE_URL}/bookings`;

  useEffect(() => {
    const getDamages = async () => {
      try {
        const response = await axios.get(`${url}/damages`);

        if (response.status === 200) {
          if (response.data !== false) {
            setDamages(response.data);
          } else {
            console.log("Failed to retrieved damages");
          }
        }
      } catch (error) {
        console.error("Error retrieving damages:", error);
      }
    };

    getDamages();
  }, []);

  const handleStandardCostChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setSelectedDamage({ ...selectedDamage, standardcost: parseInt(value) });
    }
  };

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setSelectedDamage({ ...selectedDamage, note: value });
  };

  const handleDamageSave = () => {
    setSelectedDamages((prev) => [...prev, selectedDamage]);
    setSelectedDamage({ damageTypeId: "", standardcost: "", note: "" });
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log(selectedDamages);
  }, [selectedDamages]);

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="page-title">Damage Report</h2>
          <div className="form-container">
            <form className="vehicle-form">
              <div className="form-row">
                <select
                  name="damages"
                  value={selectedDamage}
                  onChange={(e) => setSelectedDamage(damages[e.target.value])}
                >
                  <option value="">Damage type</option>
                  {damages.map((damage, index) => (
                    <option key={index} value={index}>
                      {damage.name}
                    </option>
                  ))}
                </select>

                <input
                  name="standardcost"
                  type="number"
                  placeholder="Charge"
                  value={selectedDamage.standardcost}
                  onChange={handleStandardCostChange} // allow changes
                />
              </div>

              <div className="form-row">
                <textarea
                  name="note"
                  style={{ height: 200 }}
                  type="text"
                  placeholder="Notes"
                  className="full"
                  onChange={handleNoteChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-actions">
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="save" onClick={handleDamageSave}>
              Save
            </button>
            <ConfirmModal
              isOpen={isModalOpen}
              onConfirm={() => {
                setIsModalOpen(false);
                setIsLastModal(true);
                onClose();
              }}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
