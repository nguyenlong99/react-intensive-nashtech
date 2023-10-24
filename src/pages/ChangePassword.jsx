import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/action";

const ChangePassword = () => {
	const stateUser = useSelector((state) => state.handleUser);
	const [user, setUser] = useState(stateUser);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		values: stateUser,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!stateUser) navigate("/login");

		(async () => {
			const userByEmail = await UserService.getUserByEmail(stateUser?.email);
			setUser(userByEmail);
		})();
	}, [stateUser]);

	const onSubmit = (data) => {
		(async () => {
			try {
				const updatedUser = await UserService.updateUserInfo({
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					password: data.newPassword,
					email: user.email,
				});

				const newInfoUser = {
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					email: updatedUser.email,
				};
				dispatch(loginUser(newInfoUser));

				toast.dismiss();
				toast("Change password successfully", { type: "success" });
				navigate("/");
			} catch (e) {
				toast("Something went wrong", { type: "error" });
			}
		})();
	};

	return (
		<>
			<div className="container my-3 py-3">
				<h1 className="text-center">Change password</h1>
				<hr />
				<div className="row my-4 h-100">
					<div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
						<Form onSubmit={handleSubmit(onSubmit)}>
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
							<Button
								variant="default"
								onClick={() => navigate("/manage-profile")}
								className="mt-2 ml-2"
							>
								Back
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};
export default ChangePassword;
