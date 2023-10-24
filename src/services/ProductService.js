import { apiHelper } from "../utilities";

const ProductService = {
	getProducts: async () => {
		const products = await apiHelper.get(
			`${process.env.REACT_APP_SERVER_HOST}/products`
		);
		return products;
	},
};

export default ProductService;
