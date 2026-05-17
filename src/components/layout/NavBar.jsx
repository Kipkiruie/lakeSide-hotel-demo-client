import React, { useState } from "react"
import { NavLink, Link } from "react-router-dom"
import Logout from "../auth/Logout"
import { useAuth } from "../auth/AuthProvider"

const NavBar = () => {
	const [showAccount, setShowAccount] = useState(false)

	const handleAccountClick = () => {
		setShowAccount(!showAccount)
	}

	// ✅ Use Auth Context instead of localStorage
	const { user, isAuthenticated } = useAuth()

	// ✅ Get role from user (decoded token)
	const userRole = user?.roles

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top">
			<div className="container-fluid">
				<Link to={"/"} className="navbar-brand">
					<span className="hotel-color">lakeSide Hotel</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarScroll"
					aria-controls="navbarScroll"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarScroll">
					<ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
						<li className="nav-item">
							<NavLink className="nav-link" to={"/browse-all-rooms"}>
								Browse all rooms
							</NavLink>
						</li>

						{/* ✅ Admin only */}
						{isAuthenticated && userRole === "ROLE_ADMIN" && (
							<li className="nav-item">
								<NavLink className="nav-link" to={"/admin"}>
									Admin
								</NavLink>
							</li>
						)}
					</ul>

					<ul className="d-flex navbar-nav">
						<li className="nav-item">
							<NavLink className="nav-link" to={"/find-booking"}>
								Find my booking
							</NavLink>
						</li>

						<li className="nav-item dropdown">
							<button
								className={`nav-link dropdown-toggle btn btn-link ${showAccount ? "show" : ""}`}
								onClick={handleAccountClick}
								style={{ textDecoration: "none" }}>
								Account
							</button>

							<ul className={`dropdown-menu ${showAccount ? "show" : ""}`}>
								{isAuthenticated ? (
									<Logout />
								) : (
									<li>
										<Link className="dropdown-item" to={"/login"}>
											Login
										</Link>
									</li>
								)}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default NavBar