export default function VehicleView({
  title,
  handleChange,
  vehicle,
  formErrors,
  setVehicleFile,
}) {
  const chooseProfileImage = async (e) => {
    const file = e.target.files[0]; // get selected file
    if (!file) return;

    setVehicleFile(file);
  };

  return (
    <>
      <h2 className="page-title">{title}</h2>
      <div className="form-container">
        <h3 className="form-title">Vehicle details</h3>

        <form className="vehicle-form">
          <div className="form-row">
            <div className="form-column">
              <input
                name="make"
                type="text"
                placeholder="make"
                value={vehicle.make}
                spellCheck={true}
                onChange={handleChange}
              />
              {formErrors.make && (
                <p style={{ color: "red" }}>{formErrors.make}</p>
              )}
            </div>

            <div className="form-column">
              <input
                name="model"
                type="text"
                placeholder="model"
                value={vehicle.model}
                onChange={handleChange}
              />
              {formErrors.model && (
                <p style={{ color: "red" }}>{formErrors.model}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                name="year"
                type="text"
                placeholder="year"
                value={vehicle.year}
                onChange={handleChange}
              />
              {formErrors.year && (
                <p style={{ color: "red" }}>{formErrors.year}</p>
              )}
            </div>

            <div className="form-column">
              <input
                name="seats"
                type="text"
                placeholder="seats"
                value={vehicle.seats}
                onChange={handleChange}
              />
              {formErrors.seats && (
                <p style={{ color: "red" }}>{formErrors.seats}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                name="priceperday"
                type="text"
                placeholder="price/day"
                value={vehicle.priceperday}
                onChange={handleChange}
              />
              {formErrors.priceperday && (
                <p style={{ color: "red" }}>{formErrors.priceperday}</p>
              )}
            </div>

            <div className="form-column">
              <input
                name="color"
                type="text"
                placeholder="color"
                value={vehicle.color}
                onChange={handleChange}
              />
              {formErrors.color && (
                <p style={{ color: "red" }}>{formErrors.color}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                name="platenumber"
                type="text"
                placeholder="plate number"
                className="full"
                value={vehicle.platenumber}
                onChange={handleChange}
              />
              {formErrors.platenumber && (
                <p style={{ color: "red" }}>{formErrors.platenumber}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                name="mileage"
                type="text"
                placeholder="mileage"
                value={vehicle.mileage}
                onChange={handleChange}
              />
              {formErrors.mileage && (
                <p style={{ color: "red" }}>{formErrors.mileage}</p>
              )}
            </div>

            <div className="form-column">
              <input
                name="category"
                type="text"
                placeholder="category"
                value={vehicle.category}
                onChange={handleChange}
              />
              {formErrors.category && (
                <p style={{ color: "red" }}>{formErrors.category}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                name="features"
                type="text"
                placeholder="Features (e.g., GPS, child seat, etc.)"
                className="full"
                value={vehicle.features}
                onChange={handleChange}
                spellCheck={true}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <input
                type="file"
                accept="image/*"
                onChange={chooseProfileImage}
                className="upload-btn"
              />
              {formErrors?.image && (
                <p style={{ color: "red" }}>{formErrors.image}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
