import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authHelper } from "../utilities";
import UserService from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/action";
import { Link } from "react-router-dom";

const ManageProfile = () => {
	const [user, setUser] = useState(authHelper.userLoggedIn());
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		values: user,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const stateUser = useSelector((state) => state.handleUser);

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
					firstName: data.firstName,
					lastName: data.lastName,
					password: user.password,
					email: data.email,
				});

				const newInfoUser = {
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					email: updatedUser.email,
				};
				dispatch(loginUser(newInfoUser));

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

							<div className="d-block">
								<Link to="/change-password">Change password</Link>
							</div>
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
export default ManageProfile;
