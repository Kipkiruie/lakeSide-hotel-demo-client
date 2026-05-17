import React, { createContext, useState, useContext } from "react"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext({
	user: null,
	isAuthenticated: false,
	handleLogin: (token) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const token = localStorage.getItem("token")
		if (token) {
			try {
				return jwt_decode(token)
			} catch (error) {
				console.error("Invalid token:", error)
				return null
			}
		}
		return null
	})

	const handleLogin = (token) => {
		try {
			const decodedUser = jwt_decode(token)

			localStorage.setItem("userId", decodedUser.sub)
			localStorage.setItem("userRole", decodedUser.roles)
			localStorage.setItem("token", token)

			setUser(decodedUser)
		} catch (error) {
			console.error("Login failed: invalid token", error)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userRole")
		localStorage.removeItem("token")
		setUser(null)
	}

	const isAuthenticated = !!user

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				handleLogin,
				handleLogout
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}