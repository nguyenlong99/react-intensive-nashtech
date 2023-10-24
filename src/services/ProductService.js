import { apiHelper } from "../utilities";

const ProductService = {
	getProducts: async () => {
		const products = await apiHelper.get(
			`${process.env.REACT_APP_SERVER_HOST}/products`
		);
		return products;
	},
	getProductsByCategory: async (category) => {
		const products = await ProductService.getProducts();
		if (category === "All") return products;

		const filteredList = products.filter((item) => item.category === category);
		return filteredList;
	},
};

export default ProductService;
