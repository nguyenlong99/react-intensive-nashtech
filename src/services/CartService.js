import { apiHelper } from "../utilities";

const CartService = {
	getCartPerUser: async (userId) => {
		const cart = await apiHelper.get(
			`${process.env.REACT_APP_SERVER_HOST}/carts?userId=${userId}`
		);
		return cart[0];
	},
	addProduct: async (userId, productId, quantity) => {
		const cart = await CartService.getCartPerUser(userId);
		if (!cart)
			return await apiHelper.post(
				`${process.env.REACT_APP_SERVER_HOST}/carts`,
				{
					userId: userId,
					products: [{ productId: productId, quantity: quantity }],
				}
			);
		else {
			const product = cart.products.find(
				(item) => item.productId === productId
			);

			if (product) {
				return await CartService.patchProductIncreaseQuantity(
					cart.id,
					cart.products,
					productId,
					product.quantity
				);
			}

			return await CartService.patchProductsList(
				cart.id,
				cart.products,
				productId
			);
		}
	},
	patchProductIncreaseQuantity: async (
		cartId,
		products,
		productId,
		prevQuantity
	) => {
		const newProducts = products.map((item) => {
			if (item.productId === productId)
				return {
					productId,
					quantity: prevQuantity + 1,
				};
			return item;
		});
		const cart = await apiHelper.patch(
			`${process.env.REACT_APP_SERVER_HOST}/carts/${cartId}`,
			{
				products: [...newProducts],
			}
		);
		return cart;
	},
	patchProductsList: async (cartId, products, productId) => {
		const cart = await apiHelper.patch(
			`${process.env.REACT_APP_SERVER_HOST}/carts/${cartId}`,
			{
				products: [...products, { productId, quantity: 1 }],
			}
		);
		return cart;
	},
	patchProductDecreaseQuantity: async (cartId, products, productId) => {
		const newProducts = [];
		products.forEach((item) => {
			if (item.productId === productId) {
				const newQty = item.quantity - 1;
				if (newQty === 0) return;
				return newProducts.push({
					productId,
					quantity: newQty,
				});
			}
			return newProducts.push(item);
		});
		const cart = await apiHelper.patch(
			`${process.env.REACT_APP_SERVER_HOST}/carts/${cartId}`,
			{
				products: [...newProducts],
			}
		);
		return cart;
	},
	removeProduct: async (userId, productId) => {
		const cart = await CartService.getCartPerUser(userId);

		const product = cart.products.find((item) => item.productId === productId);

		return await CartService.patchProductDecreaseQuantity(
			cart.id,
			cart.products,
			productId,
			product.quantity
		);
	},
	removeAllProducts: async (userId) => {
		const cart = await CartService.getCartPerUser(userId);

		await apiHelper.patch(
			`${process.env.REACT_APP_SERVER_HOST}/carts/${cart.id}`,
			{
				products: [],
			}
		);
	},
};

export default CartService;
