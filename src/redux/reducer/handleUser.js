const handleUser = (state, action) => {
	const storedUser = localStorage.getItem("logged_in_user");
	if (storedUser) state = JSON.parse(storedUser);
	else state = null;

	switch (action.type) {
		case "LOGIN":
			localStorage.setItem("logged_in_user", JSON.stringify(action.payload));
			return { ...action.payload };

		case "LOGOUT":
			localStorage.removeItem("logged_in_user");
			return null;

		default:
			return state;
	}
};

export default handleUser;
