// For Add Item to Cart
export const addCart = (product) => {
	return {
		type: "ADDITEM",
		payload: product,
	};
};

// For Delete Item to Cart
export const delCart = (product) => {
	return {
		type: "DELITEM",
		payload: product,
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
