import { Footer, Navbar } from "../components";
import { Outlet } from "react-router-dom";

const Root = () => {
	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
};
export default Root;
