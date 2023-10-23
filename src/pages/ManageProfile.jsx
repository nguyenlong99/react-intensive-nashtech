import { Footer, Navbar } from "../components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHelper } from "../utilities";
import UserService from "../services/UserService";

const ManageProfile = () => {
	const [user, setUser] = useState(authHelper.userLoggedIn());
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		values: user,
	});
	const navigate = useNavigate();

	const checkValidUserLoggedIn = async () => {
		const loggedInUser = authHelper.userLoggedIn();
		const userByEmail = await UserService.getUserByEmail(loggedInUser?.email);
		console.log({ loggedInUser, userByEmail });

		if (!userByEmail || Object.keys(userByEmail).length === 0) {
			navigate("/login");

			return toast("User is not existed, please login again!", {
				type: "error",
			});
		}
		return userByEmail;
	};

	useEffect(() => {
		(async () => {
			const user = await checkValidUserLoggedIn();
			setUser(user);
		})();
	}, []);

	const onSubmit = (data) => {
		(async () => {
			try {
				const validUser = await checkValidUserLoggedIn();
				const updatedUser = await UserService.updateUserInfo({
					id: validUser.id,
					firstName: data.firstName,
					lastName: data.lastName,
					password: data.newPassword,
					email: data.email,
				});

				const userString = JSON.stringify({
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					email: updatedUser.email,
				});
				console.log({ userString, updatedUser });
				localStorage.setItem("logged_in_user", userString);

				toast.dismiss();
				toast("Update user information successfully", { type: "success" });
				navigate("/");
			} catch (e) {
				toast("Something went wrong", { type: "error" });
			}
		})();
	};
	return (
		<>
			<Navbar />
			<div className="container my-3 py-3">
				<h1 className="text-center">Manage profile</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group controlId="firstName" className="mb-3">
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
							<Form.Group controlId="lastName" className="mb-3">
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
							<Form.Group controlId="email" className="mb-3">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									disabled
									placeholder="Enter Email"
									{...register("email")}
								/>
							</Form.Group>
							<Form.Group controlId="oldPassword" className="mb-3">
								<Form.Label>Old Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter Old Password"
									{...register("oldPassword", {
										required: "Old Password is required",
										minLength: {
											value: 8,
											message: "Old Password must be 8 characters or more",
										},
										validate: (value) => {
											console.log({ value, user });
											if (value !== user?.password) {
												return "Old Password is incorrect";
											}
										},
									})}
								/>
								{errors.oldPassword && (
									<Form.Text className="text-danger">
										{errors.oldPassword.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group controlId="newPassword" className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter New Password"
									{...register("newPassword", {
										required: "New Password is required",
										minLength: {
											value: 8,
											message: "New Password must be 8 characters or more",
										},
									})}
								/>
								{errors.newPassword && (
									<Form.Text className="text-danger">
										{errors.newPassword.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group controlId="confirmPassword" className="mb-3">
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
											if (watch("newPassword") !== value) {
												return "Confirm Password does not match New Password";
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
			<Footer />
		</>
	);
};
export default ManageProfile;
