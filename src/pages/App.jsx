import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import {
	Home,
	Product,
	Products,
	AboutPage,
	ContactPage,
	Cart,
	Login,
	Register,
	Checkout,
	PageNotFound,
	ManageProfile,
	Root,
} from "./";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <PageNotFound />,
		children: [
			{
				path: "",
				element: <Home />,
			},
			{
				path: "products",
				element: <Products />,
			},
			{
				path: "products/:id",
				element: <Product />,
			},
			{
				path: "about",
				element: <AboutPage />,
			},
			{
				path: "contact",
				element: <ContactPage />,
			},
			{
				path: "cart",
				element: <Cart />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "checkout",
				element: <Checkout />,
			},
			{
				path: "manage-profile",
				element: <ManageProfile />,
			},
		],
	},
]);

const App = () => {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />;
			<ToastContainer />
		</Provider>
	);
};

export default App;
