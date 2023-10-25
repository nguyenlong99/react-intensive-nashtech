import { apiHelper } from "../utilities";
import CartService from "./CartService";
import UserService from "./UserService";

const OrderService = {
	createOrder: async (email, orderInfo) => {
		const userByEmail = await UserService.getUserByEmail(email);
		const cartPerUser = await CartService.getCartPerUser(userByEmail.id);
		const createdOrder = await apiHelper.post(
			`${process.env.REACT_APP_SERVER_HOST}/orders`,
			{
				userId: userByEmail.id,
				products: [...cartPerUser.products],
				createdAt: new Date(),
				recipient: {
					firstName: orderInfo.firstName,
					lastName: orderInfo.lastName,
					email: orderInfo.email,
					address: orderInfo.address,
					mobilePhone: orderInfo.mobilePhone,
				},
			}
		);

		await CartService.removeAllProducts(userByEmail.id);

		return createdOrder;
	},
};

export default OrderService;
