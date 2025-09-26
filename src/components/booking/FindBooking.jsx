import React, { useState } from "react"
import moment from "moment"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("")
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const emptyBookingInfo = {
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: ""
  }

  const [bookingInfo, setBookingInfo] = useState(emptyBookingInfo)

  // Handle input change
  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value)
  }

  // Fetch booking details
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const data = await getBookingByConfirmationCode(confirmationCode)
      setBookingInfo(data)
      setError(null)
    } catch (error) {
      setBookingInfo(emptyBookingInfo)
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message)
      } else {
        setError(error.message)
      }
    }

    setTimeout(() => setIsLoading(false), 1500)
  }

  // Cancel booking
  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId)
      setIsDeleted(true)
      setSuccessMessage("Booking has been cancelled successfully!")
      setBookingInfo(emptyBookingInfo)
      setConfirmationCode("")
      setError(null)
    } catch (error) {
      setError(error.message)
    }

    setTimeout(() => {
      setSuccessMessage("")
      setIsDeleted(false)
    }, 2000)
  }

  return (
    <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
      <h2 className="text-center mb-4">Find My Booking</h2>

      {/* Search Form */}
      <form onSubmit={handleFormSubmit} className="col-md-6">
        <div className="input-group mb-3">
          <input
            className="form-control"
            type="text"
            id="confirmationCode"
            name="confirmationCode"
            value={confirmationCode}
            onChange={handleInputChange}
            placeholder="Enter the booking confirmation code"
          />
          <button type="submit" className="btn btn-hotel input-group-text">
            Find booking
          </button>
        </div>
      </form>

      {/* Loading state */}
      {isLoading && <div>Finding your booking...</div>}

      {/* Error message */}
      {!isLoading && error && <div className="text-danger">Error: {error}</div>}

      {/* Booking info */}
      {!isLoading && !error && bookingInfo.bookingConfirmationCode && (
        <div className="col-md-6 mt-4 mb-5">
          <h3>Booking Information</h3>
          <p className="text-success">
            Confirmation Code: {bookingInfo.bookingConfirmationCode}
          </p>
          <p>Room Number: {bookingInfo.room.id || bookingInfo.roomNumber}</p>
          <p>Room Type: {bookingInfo.room.roomType}</p>

          <p>
            Check-in Date:{" "}
            {bookingInfo.checkInDate
              ? moment(bookingInfo.checkInDate).format("MMM Do, YYYY")
              : "N/A"}
          </p>

          <p>
            Check-out Date:{" "}
            {bookingInfo.checkOutDate
              ? moment(bookingInfo.checkOutDate).format("MMM Do, YYYY")
              : "N/A"}
          </p>

          <p>Full Name: {bookingInfo.guestName}</p>
          <p>Email Address: {bookingInfo.guestEmail}</p>
          <p>Adults: {bookingInfo.numOfAdults}</p>
          <p>Children: {bookingInfo.numOfChildren}</p>
          <p>Total Guests: {bookingInfo.totalNumOfGuests}</p>

          {!isDeleted && (
            <button
              onClick={() => handleBookingCancellation(bookingInfo.id)}
              className="btn btn-danger">
              Cancel Booking
            </button>
          )}
        </div>
      )}

      {/* Delete success message */}
      {isDeleted && (
        <div className="alert alert-success mt-3 fade show">
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default FindBooking
