import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { initCart, logoutUser } from "../redux/action";
import { useEffect } from "react";
import UserService from "../services/UserService";
import CartService from "../services/CartService";

const Navbar = () => {
	const state = useSelector((state) => state.handleCart);
	const stateUser = useSelector((state) => state.handleUser);
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const handleLogout = () => {
		dispatch(logoutUser(stateUser));
		dispatch(initCart([]));
	};
	const handleManageProfile = () => {
		navigate("/manage-profile");
	};
	useEffect(() => {
		(async () => {
			if (!stateUser) return;
			const userByEmail = await UserService.getUserByEmail(stateUser.email);
			const cartPerUser = await CartService.getCartPerUser(userByEmail.id);

			dispatch(initCart(cartPerUser?.products ?? []));
		})();
	}, []);

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
			<div className="container">
				<NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
					{" "}
					NashTech
				</NavLink>
				<button
					className="navbar-toggler mx-2"
					type="button"
					data-toggle="collapse"
					data-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav m-auto my-2 text-center">
						<li className="nav-item">
							<NavLink className="nav-link" to="/">
								Home{" "}
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/products">
								Products
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/about">
								About
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/contact">
								Contact
							</NavLink>
						</li>
					</ul>
					<div className="buttons text-center d-flex justify-content-center align-items-center">
						{stateUser ? (
							<DropdownButton
								id="dropdown-basic-button"
								title={`Hello, ${stateUser.firstName} ${stateUser.lastName}`}
							>
								<Dropdown.Item onClick={handleManageProfile}>
									Manage profile
								</Dropdown.Item>
								<Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
							</DropdownButton>
						) : (
							<>
								<NavLink to="/login" className="btn btn-outline-dark m-2">
									<i className="fa fa-sign-in-alt mr-1"></i> Login
								</NavLink>
								<NavLink to="/register" className="btn btn-outline-dark m-2">
									<i className="fa fa-user-plus mr-1"></i> Register
								</NavLink>
							</>
						)}

						<NavLink to="/cart" className="btn btn-outline-dark m-2">
							<i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}){" "}
						</NavLink>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
