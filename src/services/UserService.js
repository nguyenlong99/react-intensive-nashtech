import { apiHelper } from "../utilities";

const UserService = {
	getUsers: async () => {
		const users = await apiHelper.get(
			`${process.env.REACT_APP_SERVER_HOST}/users`
		);
		return users;
	},
	getUserByEmail: async (email) => {
		const users = await UserService.getUsers();
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
	createUser: async (data) => {
		return await apiHelper.post(
			`${process.env.REACT_APP_SERVER_HOST}/users`,
			data
		);
	},
};

export default UserService;
