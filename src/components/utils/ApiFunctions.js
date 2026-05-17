import axios from "axios";

/* -------------------- API CONFIGURATION -------------------- */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Production backend (Render)
});

/* -------------------- HEADERS -------------------- */
export const getHeader = (isFormData = false) => {
  const token = localStorage.getItem("token");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
};

/* ==================== ROOMS ==================== */
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  const response = await api.post("/rooms/add/new-room", formData, {
    headers: getHeader(true),
  });

  return response.data;
}

export async function getRoomTypes() {
  const response = await api.get("/rooms/room/types");
  return response.data;
}

export async function getAllRooms() {
  const response = await api.get("/rooms/all-rooms", {
    headers: getHeader(),
  });

  return response.data;
}

export async function getRoomById(roomId) {
  const response = await api.get(`/rooms/room/${roomId}`, {
    headers: getHeader(),
  });

  return response.data;
}

export async function updateRoom(roomId, roomData) {
  const formData = new FormData();

  if (roomData.roomType) formData.append("roomType", roomData.roomType);
  if (roomData.roomPrice) formData.append("roomPrice", roomData.roomPrice);
  if (roomData.photo) formData.append("photo", roomData.photo);

  const response = await api.put(`/rooms/update/${roomId}`, formData, {
    headers: getHeader(true),
  });

  return response.data;
}

export async function deleteRoom(roomId) {
  const response = await api.delete(`/rooms/delete/room/${roomId}`, {
    headers: getHeader(),
  });

  return response.data;
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const response = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`,
    { headers: getHeader() }
  );

  return response.data;
}

/* ==================== BOOKINGS ==================== */
export async function bookRoom(roomId, booking) {
  const response = await api.post(
    `/bookings/room/${roomId}/booking`,
    booking,
    { headers: getHeader() }
  );

  return response.data;
}

export async function getAllBookings() {
  const response = await api.get("/bookings/all-bookings", {
    headers: getHeader(),
  });

  return response.data;
}

export async function getBookingByConfirmationCode(confirmationCode) {
  const response = await api.get(
    `/bookings/confirmation/${confirmationCode}`,
    { headers: getHeader() }
  );

  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await api.delete(
    `/bookings/booking/${bookingId}/delete`,
    { headers: getHeader() }
  );

  return response.data;
}

export async function getBookingsByUserId(userId) {
  const response = await api.get(`/bookings/user/${userId}/bookings`, {
    headers: getHeader(),
  });

  return response.data;
}

/* ==================== AUTH ==================== */
export async function registerUser(registration) {
  const response = await api.post("/auth/register-user", registration);

  return response.data;
}

export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

/* ==================== USERS ==================== */
export async function getUserProfile(userId) {
  const response = await api.get(`/users/profile/${userId}`, {
    headers: getHeader(),
  });

  return response.data;
}

export async function getUser(userId) {
  const response = await api.get(`/users/${userId}`, {
    headers: getHeader(),
  });

  return response.data;
}

export async function deleteUser(userId) {
  const response = await api.delete(`/users/delete/${userId}`, {
    headers: getHeader(),
  });

  return response.data;
}