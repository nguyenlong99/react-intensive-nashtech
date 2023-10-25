export const initCart = (products) => {
	return {
		type: "INIT",
		payload: products,
	};
};

export const loginUser = (user) => {
	return {
		type: "LOGIN",
		payload: user,
	};
};
export const logoutUser = (user) => {
	return {
		type: "LOGOUT",
		payload: user,
	};
};
