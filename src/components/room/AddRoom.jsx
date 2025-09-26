import React, { useState, useRef } from "react";
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link } from "react-router-dom";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // ✅ Ref for file input
  const fileInputRef = useRef(null);

  const handleRoomInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "roomPrice") {
      value = value === "" ? "" : value.toString(); // keep as string for FormData
    }

    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewRoom({ ...newRoom, photo: selectedImage });
    setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRoom.roomType || !newRoom.roomPrice || !newRoom.photo) {
      setErrorMessage("Please fill in all fields and select a photo.");
      return;
    }

    try {
      const addedRoom = await addRoom(
        newRoom.photo,
        newRoom.roomType,
        newRoom.roomPrice
      );

      // ✅ Assuming backend returns addedRoom object with `id`
      if (addedRoom && addedRoom.id) {
        setSuccessMessage(`Room "${addedRoom.roomType}" added successfully!`);
        setNewRoom({ photo: null, roomType: "", roomPrice: "" });
        setImagePreview("");
        setErrorMessage("");

        // ✅ Clear the file input manually
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setErrorMessage("Error adding new room.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Error adding room"
      );
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mt-5 mb-2">Add a New Room</h2>

          {successMessage && (
            <div className="alert alert-success fade show">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="alert alert-danger fade show">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="roomType" className="form-label">
                Room Type
              </label>
              <RoomTypeSelector
                handleRoomInputChange={handleRoomInputChange}
                newRoom={newRoom}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label">
                Room Price
              </label>
              <input
                required
                type="number"
                className="form-control"
                id="roomPrice"
                name="roomPrice"
                value={newRoom.roomPrice}
                onChange={handleRoomInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Room Photo
              </label>
              <input
                required
                name="photo"
                id="photo"
                type="file"
                className="form-control"
                onChange={handleImageChange}
                ref={fileInputRef} // ✅ ref added
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview room photo"
                  style={{ maxWidth: "400px", maxHeight: "400px" }}
                  className="mb-3"
                />
              )}
            </div>

            <div className="d-grid gap-2 d-md-flex mt-2">
              <Link to={"/existing-rooms"} className="btn btn-outline-info">
                Existing rooms
              </Link>
              <button type="submit" className="btn btn-outline-primary ml-5">
                Save Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoom;
