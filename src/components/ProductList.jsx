import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initCart } from "../redux/action";
import ProductService from "../services/ProductService";
import { toast } from "react-toastify";
import CartService from "../services/CartService";
import UserService from "../services/UserService";
import { useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useCallback } from "react";

const Loading = () => {
	return (
		<div className="d-flex row">
			<div className="col-12 py-5 text-center">
				<Skeleton height={40} width={560} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
			<div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
				<Skeleton height={592} />
			</div>
		</div>
	);
};

const ShowProducts = (props) => {
	const { productList, setProductList, filterProduct } = props;
	const stateUser = useSelector((state) => state.handleUser);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchValue, setSearchValue] = useState("");
	const timerRef = useRef(null);

	const addProduct = (product) => {
		if (!stateUser) {
			navigate("/login");
			toast.info("Please login to add item to cart!");
		}

		(async () => {
			const userByEmail = await UserService.getUserByEmail(stateUser?.email);

			const productsInCart = await CartService.addProduct(
				userByEmail.id,
				product.id,
				1
			);
			dispatch(initCart(productsInCart.products));
		})();
	};

	useEffect(() => {
		(async () => {
			const products = await ProductService.getProducts();
			if (!searchValue) return setProductList(products);
			timerRef.current = setTimeout(() => {
				const searchedProducts = [];
				products.forEach((item) => {
					if (item.title.toLowerCase().includes(searchValue?.toLowerCase()))
						return searchedProducts.push(item);
				});
				console.log({ searchedProducts, searchValue });
				setProductList(searchedProducts);
			}, 500);
		})();

		return () => clearTimeout(timerRef.current);
	}, [searchValue]);

	return (
		<>
			<div className="d-flex justify-content-center w-100">
				<InputGroup className="mb-3 w-50">
					<InputGroup.Text id="basic-addon1">Search:</InputGroup.Text>
					<Form.Control
						placeholder="enter product name"
						aria-label="productName"
						aria-describedby="basic-addon1"
						onChange={(e) => {
							setSearchValue(e.target.value);
						}}
						value={searchValue}
					/>
				</InputGroup>
			</div>
			<div className="buttons text-center py-2">
				<button
					className="btn btn-outline-dark btn-sm m-2"
					onClick={() => filterProduct("All")}
				>
					All
				</button>
				<button
					className="btn btn-outline-dark btn-sm m-2"
					onClick={() => filterProduct("men's clothing")}
				>
					Men's Clothing
				</button>
				<button
					className="btn btn-outline-dark btn-sm m-2"
					onClick={() => filterProduct("women's clothing")}
				>
					Women's Clothing
				</button>
				<button
					className="btn btn-outline-dark btn-sm m-2"
					onClick={() => filterProduct("jewelery")}
				>
					Jewelery
				</button>
				<button
					className="btn btn-outline-dark btn-sm m-2"
					onClick={() => filterProduct("electronics")}
				>
					Electronics
				</button>
			</div>

			<div className="d-flex row">
				{productList.length === 0
					? null
					: productList.map((product) => {
							return (
								<div
									id={product.id}
									key={product.id}
									className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
								>
									<div className="card text-center h-100" key={product.id}>
										<img
											className="card-img-top p-3"
											src={product.image}
											alt="Card"
											height={300}
										/>
										<div className="card-body">
											<h5 className="card-title">
												<Link to={"/products/" + product.id}>
													{product.title.substring(0, 12)}...
												</Link>
											</h5>
											<p className="card-text">
												{product.description.substring(0, 90)}...
											</p>
										</div>
										<ul className="list-group list-group-flush">
											<li className="list-group-item lead">
												$ {product.price}
											</li>
										</ul>
										<div className="card-body">
											<Link
												to={"/products/" + product.id}
												className="btn btn-dark m-1"
											>
												Buy Now
											</Link>
											<button
												className="btn btn-dark m-1"
												onClick={() => addProduct(product)}
											>
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							);
					  })}
			</div>
		</>
	);
};

const ProductList = () => {
	const [loading, setLoading] = useState(false);
	const [productList, setProductList] = useState([]);

	useEffect(() => {
		let componentMounted = true;

		const getProducts = async () => {
			setLoading(true);
			const products = await ProductService.getProducts();
			console.log({ products });
			if (!componentMounted) return;

			setProductList(products);
			setLoading(false);

			return () => {
				componentMounted = false;
			};
		};

		getProducts();
	}, []);

	const filterProduct = useCallback((category) => {
		(async () => {
			const filteredList = await ProductService.getProductsByCategory(category);
			setProductList(filteredList);
		})();
	}, []);

	return (
		<>
			<div className="container my-3 py-3">
				<div className="row">
					<div className="col-12">
						<h2 className="display-5 text-center">Latest Products</h2>
						<hr />
					</div>
				</div>
				<div className="">
					{loading ? (
						<Loading />
					) : (
						<ShowProducts
							productList={productList}
							setProductList={setProductList}
							filterProduct={filterProduct}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ProductList;
