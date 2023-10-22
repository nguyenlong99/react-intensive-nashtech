const authHelper = {
	userLoggedIn: () => {
		const loggedInUser = localStorage.getItem("logged_in_user");
		if (!loggedInUser || loggedInUser.length == 0) {
			return null;
		}
		return JSON.parse(loggedInUser);
	},
};
export default authHelper;
