import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import RoomCard from "./RoomCard";
import { Col, Container, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";

const Room = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((res) => {
        setData(res);
        setFilteredData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch rooms");
        setIsLoading(false);
      });
  }, []);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / roomsPerPage);

  const renderRooms = () => {
    if (!filteredData || filteredData.length === 0) {
      return <p className="text-center">No rooms available.</p>;
    }
    const startIndex = (currentPage - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    return filteredData.slice(startIndex, endIndex).map((room) => (
      <Col key={room.id} md={4} className="mb-4">
        <RoomCard room={room} />
      </Col>
    ));
  };

  if (isLoading) return <p>Loading rooms...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <Container>
      <Row className="mb-3 mt-3">
        <Col md={6}>
          <RoomFilter data={data} setFilteredData={setFilteredData} />
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-end">
          <RoomPaginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>

      <Row>{renderRooms()}</Row>

      {filteredData.length > roomsPerPage && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <RoomPaginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Room;
