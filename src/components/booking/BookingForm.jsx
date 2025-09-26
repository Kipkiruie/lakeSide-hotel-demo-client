import React, { useEffect, useState } from "react"
import moment from "moment"
import { Form, FormControl, Button } from "react-bootstrap"
import BookingSummary from "./BookingSummary"
import { bookRoom, getRoomById } from "../utils/ApiFunctions"
import { useNavigate, useParams } from "react-router-dom"

const BookingForm = () => {
  const [validated, setValidated] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [roomPrice, setRoomPrice] = useState(0)

  const currentUser = localStorage.getItem("userId") || "" // fallback if null

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: 1,
    numOfChildren: 0,
  })

  const { roomId } = useParams()
  const navigate = useNavigate()

  /** Handle field updates */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBooking((prev) => ({ ...prev, [name]: value }))
    setErrorMessage("")
  }

  /** Fetch room price */
  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId)
      if (response?.roomPrice) {
        setRoomPrice(response.roomPrice)
      }
    } catch (error) {
      console.error("Error fetching room price:", error)
      setErrorMessage("Could not load room details.")
    }
  }

  useEffect(() => {
    if (roomId) getRoomPriceById(roomId)
  }, [roomId])

  /** Calculate payment */
  const calculatePayment = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return 0
    const checkInDate = moment(booking.checkInDate)
    const checkOutDate = moment(booking.checkOutDate)
    const diffInDays = checkOutDate.diff(checkInDate, "days")
    return diffInDays > 0 ? diffInDays * roomPrice : 0
  }

  /** Validate guest count */
  const isGuestCountValid = () => {
    const adults = parseInt(booking.numOfAdults || 0, 10)
    const children = parseInt(booking.numOfChildren || 0, 10)
    return adults >= 1 && adults + children >= 1
  }

  /** Validate check-out */
  const isCheckOutDateValid = () => {
    if (!moment(booking.checkOutDate).isAfter(moment(booking.checkInDate))) {
      setErrorMessage("Check-out date must be after check-in date.")
      return false
    }
    return true
  }

  /** First step validation */
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()) {
      e.stopPropagation()
    } else {
      setIsSubmitted(true)
    }
    setValidated(true)
  }

  /** Final confirmation */
  const handleFormSubmit = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking)
      navigate("/booking-success", { state: { message: confirmationCode } })
    } catch (error) {
      console.error("Booking failed:", error)
      navigate("/booking-success", { state: { error: error.message } })
    }
  }

  return (
    <div className="container mb-5">
      <div className="row">
        {/* Form */}
        <div className="col-md-6">
          <div className="card card-body mt-5">
            <h4 className="card-title">Reserve Room</h4>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Full Name */}
              <Form.Group>
                <Form.Label htmlFor="guestFullName" className="hotel-color">
                  Full Name
                </Form.Label>
                <FormControl
                  required
                  type="text"
                  id="guestFullName"
                  name="guestFullName"
                  value={booking.guestFullName}
                  placeholder="Enter your fullname"
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your full name.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email */}
              <Form.Group>
                <Form.Label htmlFor="guestEmail" className="hotel-color">
                  Email
                </Form.Label>
                <FormControl
                  required
                  type="email"
                  id="guestEmail"
                  name="guestEmail"
                  value={booking.guestEmail}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  disabled
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email address.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Dates */}
              <fieldset>
                <legend>Lodging Period</legend>
                <div className="row">
                  <div className="col-6">
                    <Form.Label htmlFor="checkInDate" className="hotel-color">
                      Check-in Date
                    </Form.Label>
                    <FormControl
                      required
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={booking.checkInDate}
                      min={moment().format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a check-in date.
                    </Form.Control.Feedback>
                  </div>

                  <div className="col-6">
                    <Form.Label htmlFor="checkOutDate" className="hotel-color">
                      Check-out Date
                    </Form.Label>
                    <FormControl
                      required
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={booking.checkOutDate}
                      min={moment().format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a check-out date.
                    </Form.Control.Feedback>
                  </div>
                  {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </div>
              </fieldset>

              {/* Guests */}
              <fieldset>
                <legend>Number of Guests</legend>
                <div className="row">
                  <div className="col-6">
                    <Form.Label htmlFor="numOfAdults" className="hotel-color">
                      Adults
                    </Form.Label>
                    <FormControl
                      required
                      type="number"
                      id="numOfAdults"
                      name="numOfAdults"
                      value={booking.numOfAdults}
                      min={1}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      At least 1 adult is required.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-6">
                    <Form.Label htmlFor="numOfChildren" className="hotel-color">
                      Children
                    </Form.Label>
                    <FormControl
                      type="number"
                      id="numOfChildren"
                      name="numOfChildren"
                      value={booking.numOfChildren}
                      min={0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Submit */}
              <div className="form-group mt-3">
                <Button type="submit" className="btn btn-hotel">
                  Continue
                </Button>
              </div>
            </Form>
          </div>
        </div>

        {/* Summary */}
        <div className="col-md-4">
          {isSubmitted && (
            <BookingSummary
              booking={booking}
              payment={calculatePayment()}
              onConfirm={handleFormSubmit}
              isFormValid={validated}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingForm
