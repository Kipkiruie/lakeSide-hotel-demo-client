import React, { useEffect, useState } from "react";
import BookingForm from "../booking/BookingForm";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import { getRoomById } from "../utils/ApiFunctions";
import RoomCarousel from "../common/RoomCarousel";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
  });

  const { roomId } = useParams();

  useEffect(() => {
    // Validate if roomId is provided
    if (!roomId) {
      setError("Invalid room ID. Please go back and try again.");
      setIsLoading(false);
      return;
    }

    console.log("Fetching room with ID:", roomId);

    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call API
        const response = await getRoomById(roomId);

        if (!response || Object.keys(response).length === 0) {
          throw new Error("Room data not found.");
        }

        console.log("Room data received:", response);
        setRoomInfo(response);
      } catch (err) {
        console.error("Error fetching room:", err.message);
        setError(err.message || "Failed to fetch room details.");
      } finally {
        setIsLoading(false);
      }
    };

    // Delay fetch by 1 second to simulate loading
    const timeout = setTimeout(fetchRoomData, 1000);

    return () => clearTimeout(timeout); // Cleanup on component unmount
  }, [roomId]);

  return (
    <div>
      <section className="container">
        <div className="row">
          {/* Room Information Section */}
          <div className="col-md-4 mt-5 mb-5">
            {isLoading ? (
              <p>Loading room information...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : (
              <div className="room-info">
                {/* Room Image */}
                {roomInfo.photo ? (
                  <img
                    src={`data:image/png;base64,${roomInfo.photo}`}
                    alt="Room"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#777",
                    }}
                  >
                    No Image Available
                  </div>
                )}

                {/* Room Details */}
                <table className="table table-bordered mt-3">
                  <tbody>
                    <tr>
                      <th>Room Type:</th>
                      <td>{roomInfo.roomType || "Not specified"}</td>
                    </tr>
                    <tr>
                      <th>Price per night:</th>
                      <td>
                        {roomInfo.roomPrice ? `$${roomInfo.roomPrice}` : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Room Service:</th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> Wifi
                          </li>
                          <li>
                            <FaTv /> Netflix Premium
                          </li>
                          <li>
                            <FaUtensils /> Breakfast
                          </li>
                          <li>
                            <FaWineGlassAlt /> Mini bar refreshment
                          </li>
                          <li>
                            <FaCar /> Car Service
                          </li>
                          <li>
                            <FaParking /> Parking Space
                          </li>
                          <li>
                            <FaTshirt /> Laundry
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Form Section */}
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Room Carousel */}
      <div className="container">
        <RoomCarousel />
      </div>
    </div>
  );
};

export default Checkout;
