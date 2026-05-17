import axios from "axios";

/* -------------------- API CONFIGURATION -------------------- */
export const api = axios.create({
  baseURL: "http://localhost:9192", // Backend URL
});

export const getHeader = (isFormData = false) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // JSON header unless FormData
  };
};

/* -------------------- ROOMS -------------------- */
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
  try {
    const response = await api.get("/rooms/room/types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching room types");
  }
}

export async function getAllRooms() {
  try {
    const response = await api.get("/rooms/all-rooms", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching rooms");
  }
}

export async function getRoomById(roomId) {
  try {
    const response = await api.get(`/rooms/room/${roomId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching room: ${error.message}`);
  }
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
  try {
    const response = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  try {
    const response = await api.get(
      `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`,
      { headers: getHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching available rooms: ${error.message}`);
  }
}

/* -------------------- BOOKINGS -------------------- */
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking,
      { headers: getHeader() }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}

export async function getAllBookings() {
  try {
    const response = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
}

export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const response = await api.get(`/bookings/confirmation/${confirmationCode}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error finding booking: ${error.message}`);
    }
  }
}

export async function cancelBooking(bookingId) {
  try {
    const response = await api.delete(`/bookings/booking/${bookingId}/delete`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error cancelling booking: ${error.message}`);
  }
}

export async function getBookingsByUserId(userId) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}

/* -------------------- AUTH -------------------- */
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error: ${error.message}`);
    }
  }
}

export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* -------------------- USERS -------------------- */
export async function getUserProfile(userId) {
  try {
    const response = await api.get(`/users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUser(userId) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}
