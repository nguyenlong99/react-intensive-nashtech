import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initCart } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import authHelper from "../utilities/authHelper";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import UserService from "../services/UserService";

const EmptyCart = () => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-12 py-5 bg-light text-center">
					<h4 className="p-3 display-5">Your Cart is Empty</h4>
					<Link to="/" className="btn  btn-outline-dark mx-4">
						<i className="fa fa-arrow-left"></i> Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
};

const Cart = () => {
	const state = useSelector((state) => state.handleCart);
	const stateUser = useSelector((state) => state.handleUser);
	const [productsInCart, setProductsInCart] = useState([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({});

	const addItem = (product) => {
		if (!stateUser) {
			navigate("/login");
			toast.info("Please login to add item to cart!");
		}

		(async () => {
			const increaseQuantityProducts = await CartService.addProduct(
				userInfo.id,
				product.id,
				1
			);
			dispatch(initCart(increaseQuantityProducts.products));
		})();
	};
	const removeItem = (product) => {
		if (!stateUser) {
			navigate("/login");
			toast.info("Please login to add item to cart!");
		}

		(async () => {
			const decreaseQuantityProducts = await CartService.removeProduct(
				userInfo.id,
				product.id,
				1
			);
			dispatch(initCart(decreaseQuantityProducts.products));
		})();
	};
	useEffect(() => {
		if (!stateUser) return navigate("/login");

		(async () => {
			const userByEmail = await UserService.getUserByEmail(stateUser.email);
			setUserInfo(userByEmail);
			const cartPerUser = await CartService.getCartPerUser(userByEmail.id);
			const productsInfo = await Promise.all(
				cartPerUser.products.map(async (item) => {
					return {
						...(await ProductService.getProductById(item.productId)),
						qty: item.quantity,
					};
				})
			);
			setProductsInCart(productsInfo);
		})();
	}, [state]);

	useEffect(() => {
		if (!stateUser) navigate("/login");
	}, [stateUser]);

	const ShowCart = () => {
		let subtotal = 0;
		let shipping = 30.0;
		let totalItems = 0;
		productsInCart.map((item) => {
			return (subtotal += item.price * item.qty);
		});

		productsInCart.map((item) => {
			return (totalItems += item.qty);
		});
		const navigate = useNavigate();

		const handleCheckout = () => {
			const loggedInUser = authHelper.userLoggedIn();

			if (loggedInUser) return navigate("/checkout");
			toast.info("You must log in to checkout!");
			navigate("/login");
		};

		return (
			<>
				<section className="h-100 gradient-custom">
					<div className="container py-5">
						<div className="row d-flex justify-content-center my-4">
							<div className="col-md-8">
								<div className="card mb-4">
									<div className="card-header py-3">
										<h5 className="mb-0">Item List</h5>
									</div>
									<div className="card-body">
										{productsInCart.map((item) => {
											return (
												<div key={item.id}>
													<div className="row d-flex align-items-center">
														<div className="col-lg-3 col-md-12">
															<div
																className="bg-image rounded"
																data-mdb-ripple-color="light"
															>
																<img
																	src={item.image}
																	// className="w-100"
																	alt={item.title}
																	width={100}
																	height={75}
																/>
															</div>
														</div>

														<div className="col-lg-5 col-md-6">
															<p>
																<strong>{item.title}</strong>
															</p>
															{/* <p>Color: blue</p>
                              <p>Size: M</p> */}
														</div>

														<div className="col-lg-4 col-md-6">
															<div
																className="d-flex mb-4"
																style={{ maxWidth: "300px" }}
															>
																<button
																	className="btn px-3"
																	onClick={() => {
																		removeItem(item);
																	}}
																>
																	<i className="fas fa-minus"></i>
																</button>

																<p className="mx-5">{item.qty}</p>

																<button
																	className="btn px-3"
																	onClick={() => {
																		addItem(item);
																	}}
																>
																	<i className="fas fa-plus"></i>
																</button>
															</div>

															<p className="text-start text-md-center">
																<strong>
																	<span className="text-muted">{item.qty}</span>{" "}
																	x ${item.price}
																</strong>
															</p>
														</div>
													</div>

													<hr className="my-4" />
												</div>
											);
										})}
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="card mb-4">
									<div className="card-header py-3 bg-light">
										<h5 className="mb-0">Order Summary</h5>
									</div>
									<div className="card-body">
										<ul className="list-group list-group-flush">
											<li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
												Products ({totalItems})
												<span>${Math.round(subtotal)}</span>
											</li>
											<li className="list-group-item d-flex justify-content-between align-items-center px-0">
												Shipping
												<span>${shipping}</span>
											</li>
											<li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
												<div>
													<strong>Total amount</strong>
												</div>
												<span>
													<strong>${Math.round(subtotal + shipping)}</strong>
												</span>
											</li>
										</ul>

										<Button
											onClick={handleCheckout}
											className="btn btn-dark btn-lg btn-block"
										>
											Go to checkout
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</>
		);
	};

	return (
		<>
			<div className="container my-3 py-3">
				<h1 className="text-center">Cart</h1>
				<hr />
				{productsInCart.length > 0 ? <ShowCart /> : <EmptyCart />}
			</div>
		</>
	);
};

export default Cart;
