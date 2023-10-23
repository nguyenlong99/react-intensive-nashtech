import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services";

const Register = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const onSubmit = (data) => {
		(async () => {
			try {
				const body = {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					password: data.password,
				};
				const users = await UserService.getUsers();
				const isEmailExisted = users.some((item) => item.email === data.email);
				if (isEmailExisted)
					return toast("Email is existed. Please input new email!", {
						type: "error",
					});
				await UserService.createUser(body);
				toast.dismiss();
				toast("Register successfully", { type: "success" });
				navigate("/login");
			} catch (e) {
				toast("Something went wrong", { type: "error" });
			}
		})();
	};
	const onError = (error) => {
		console.log("ERROR:::", error);
	};

	return (
		<>
			<div className="container my-3 py-3">
				<h1 className="text-center">Register</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<Form onSubmit={handleSubmit(onSubmit, onError)}>
							<Form.Group controlId="firstName">
								<Form.Label>First name</Form.Label>
								<Form.Control
									placeholder="Enter First Name"
									{...register("firstName", {
										required: "First Name is required",
									})}
								/>
								{errors.firstName && (
									<Form.Text className="text-danger">
										{errors.firstName.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group controlId="lastName">
								<Form.Label>Last name</Form.Label>
								<Form.Control
									placeholder="Enter Last Name"
									{...register("lastName", {
										required: "Last Name is required",
									})}
								/>
								{errors.lastName && (
									<Form.Text className="text-danger">
										{errors.lastName.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group controlId="email">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter Email"
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
							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter Password"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Password must be 8 characters or more",
										},
									})}
								/>
								{errors.password && (
									<Form.Text className="text-danger">
										{errors.password.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group controlId="confirmPassword">
								<Form.Label>Confirm password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter Confirm Password"
									{...register("confirmPassword", {
										required: "Confirm Password is required",
										minLength: {
											value: 8,
											message: "Confirm Password must be 8 characters or more",
										},
										validate: (value) => {
											if (watch("password") !== value) {
												return "Confirm password does not match password";
											}
										},
									})}
								/>
								{errors.confirmPassword && (
									<Form.Text className="text-danger">
										{errors.confirmPassword.message}
									</Form.Text>
								)}
							</Form.Group>

							<Button variant="primary" type="submit" className="mt-2">
								Submit
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
