import { apiHelper } from "../utilities";

const UserService = {
	getUserByEmail: async (email) => {
		const users = await apiHelper.get(
			`${process.env.REACT_APP_SERVER_HOST}/users`
		);
		console.log({ users });
		const userByEmail = users.find((item) => item.email === email);
		return userByEmail;
	},
	updateUserInfo: async (data) => {
		const updatedUser = await apiHelper.put(
			`${process.env.REACT_APP_SERVER_HOST}/users/${data.id}`,
			{
				firstName: data.firstName,
				lastName: data.lastName,
				password: data.password,
				email: data.email,
			}
		);
		return updatedUser;
	},
};

export default UserService;
