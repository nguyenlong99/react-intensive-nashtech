import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import OrderService from "../services/OrderService";
import { initCart } from "../redux/action";

const EmptyCart = () => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-12 py-5 bg-light text-center">
					<h4 className="p-3 display-5">No item in Cart</h4>
					<Link to="/" className="btn btn-outline-dark mx-4">
						<i className="fa fa-arrow-left"></i> Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
};

const ShowCheckout = (props) => {
	const { state } = props;
	const stateUser = useSelector((state) => state.handleUser);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ values: stateUser });
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [productsInCart, setProductsInCart] = useState([]);

	let subtotal = 0;
	let shipping = 30.0;
	let totalItems = 0;
	productsInCart.map((item) => {
		return (subtotal += item.price * item.qty);
	});

	productsInCart.map((item) => {
		return (totalItems += item.qty);
	});
	const onSubmit = (data) => {
		(async () => {
			try {
				await OrderService.createOrder(stateUser.email, data);
				navigate("/");
				dispatch(initCart([]));
				toast.success("Checkout successfully");
			} catch (e) {
				console.error(e);
				toast("Something went wrong", { type: "error" });
			}
		})();
	};
	const onError = (error) => {
		console.log("ERROR:::", error);
	};

	useEffect(() => {
		if (!stateUser) return navigate("/login");

		(async () => {
			const userByEmail = await UserService.getUserByEmail(stateUser.email);
			const cartPerUser = await CartService.getCartPerUser(userByEmail.id);
			const productsInfoWithQuantity = await Promise.all(
				cartPerUser.products.map(async (item) => {
					return {
						...(await ProductService.getProductById(item.productId)),
						qty: item.quantity,
					};
				})
			);
			setProductsInCart(productsInfoWithQuantity);
		})();
	}, [state]);
	return (
		<>
			<div className="container py-5">
				<div className="row my-4">
					<div className="col-md-5 col-lg-4 order-md-last">
						<div className="card mb-4">
							<div className="card-header py-3 bg-light">
								<h5 className="mb-0">Order Summary</h5>
							</div>
							<div className="card-body">
								<ul className="list-group list-group-flush">
									<li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
										Products ({totalItems})<span>${Math.round(subtotal)}</span>
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
							</div>
						</div>
					</div>
					<div className="col-md-7 col-lg-8">
						<div className="card mb-4">
							<div className="card-header py-3">
								<h4 className="mb-0">Billing address</h4>
							</div>
							<div className="card-body">
								<Form
									className="needs-validation"
									onSubmit={handleSubmit(onSubmit, onError)}
								>
									<div className="row g-3">
										<div className="col-sm-6 my-1">
											<Form.Group controlId="firstName">
												<Form.Label>First Name</Form.Label>
												<Form.Control
													placeholder="Enter first name"
													{...register("firstName", {
														required: "First name is required",
													})}
												/>
												{errors.firstName && (
													<Form.Text className="text-danger">
														{errors.firstName.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-sm-6 my-1">
											<Form.Group controlId="lastName">
												<Form.Label>First Name</Form.Label>
												<Form.Control
													placeholder="Enter last name"
													{...register("lastName", {
														required: "First name is required",
													})}
												/>
												{errors.lastName && (
													<Form.Text className="text-danger">
														{errors.lastName.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-12 my-1">
											<Form.Group controlId="email">
												<Form.Label>Email</Form.Label>
												<Form.Control
													type="email"
													placeholder="ex: you@example.com"
													{...register("email", {
														required: "Email is required",
													})}
												/>
												{errors.email && (
													<Form.Text className="text-danger">
														{errors.email.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-12 my-1">
											<Form.Group controlId="mobilePhone">
												<Form.Label>Mobile phone</Form.Label>
												<Form.Control
													placeholder="Enter mobile phone"
													{...register("mobilePhone", {
														required: "Mobile phone is required",
													})}
												/>
												{errors.mobilePhone && (
													<Form.Text className="text-danger">
														{errors.mobilePhone.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-12 my-1">
											<Form.Group controlId="address">
												<Form.Label>Address</Form.Label>
												<Form.Control
													placeholder="Enter address"
													{...register("address", {
														required: "Address is required",
													})}
												/>
												{errors.address && (
													<Form.Text className="text-danger">
														{errors.address.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>
									</div>

									<hr className="my-4" />

									<h4 className="mb-3">Payment</h4>

									<div className="row gy-3">
										<div className="col-md-6">
											<Form.Group controlId="nameOnCard">
												<Form.Label>Name on card</Form.Label>
												<Form.Control
													placeholder="Enter name on card"
													{...register("nameOnCard", {
														required: "Name on card is required",
													})}
												/>
												{errors.nameOnCard && (
													<Form.Text className="text-danger">
														{errors.nameOnCard.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-md-6">
											<Form.Group controlId="creditCardNumber">
												<Form.Label>Credit card number</Form.Label>
												<Form.Control
													placeholder="Enter Credit card number"
													{...register("creditCardNumber", {
														required: "Credit card number is required",
													})}
												/>
												{errors.creditCardNumber && (
													<Form.Text className="text-danger">
														{errors.creditCardNumber.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-md-3">
											<Form.Group controlId="expiration">
												<Form.Label>Expiration</Form.Label>
												<Form.Control
													placeholder="Enter Expiration"
													{...register("expiration", {
														required: "Expiration is required",
													})}
												/>
												{errors.expiration && (
													<Form.Text className="text-danger">
														{errors.expiration.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>

										<div className="col-md-3">
											<Form.Group controlId="cvvNumber">
												<Form.Label>CVV</Form.Label>
												<Form.Control
													placeholder="Enter CVV"
													{...register("cvvNumber", {
														required: "CVV is required",
													})}
												/>
												{errors.cvvNumber && (
													<Form.Text className="text-danger">
														{errors.cvvNumber.message}
													</Form.Text>
												)}
											</Form.Group>
										</div>
									</div>

									<hr className="my-4" />

									<Button variant="primary" type="submit" className="w-100 ">
										Submit
									</Button>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
const Checkout = () => {
	const state = useSelector((state) => state.handleCart);

	return (
		<>
			<div className="container my-3 py-3">
				<h1 className="text-center">Checkout</h1>
				<hr />
				{state.length ? <ShowCheckout state={state} /> : <EmptyCart />}
			</div>
		</>
	);
};

export default Checkout;
