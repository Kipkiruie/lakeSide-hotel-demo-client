import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { getAllRooms } from "../utils/ApiFunctions";

import RoomCard from "./RoomCard"; // the card that shows each room

const RoomListing = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms from backend on component load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms(); // call backend API
        setRooms(data); // save rooms to state
      } catch (err) {
        setError(err.message); // save any error
      } finally {
        setLoading(false); // stop loading spinner
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;
  if (rooms.length === 0) return <p>No rooms available.</p>;

  return (
    <section className="bg-light p-2 mb-5 mt-5 shadow">
      <Row>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} /> // render each room
        ))}
      </Row>
    </section>
  );
};

export default RoomListing;
