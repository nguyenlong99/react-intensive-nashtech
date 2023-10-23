import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services";

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const onSubmit = (data) => {
		(async () => {
			try {
				const users = await UserService.getUsers();
				const existedUser = users.find(
					(item) => item.email === data.email && item.password === data.password
				);
				if (!existedUser || Object.keys(existedUser).length === 0)
					return toast("Wrong email or password", {
						type: "error",
					});

				const loggedInUser = {
					firstName: existedUser.firstName,
					lastName: existedUser.lastName,
					email: existedUser.email,
				};

				localStorage.setItem("logged_in_user", JSON.stringify(loggedInUser));

				toast.dismiss();
				toast("Login successfully", { type: "success" });
				navigate("/");
			} catch (e) {
				console.error(e);
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
				<h1 className="text-center">Login</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<Form onSubmit={handleSubmit(onSubmit, onError)}>
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

export default Login;
