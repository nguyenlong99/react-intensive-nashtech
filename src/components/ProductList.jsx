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

const ProductList = () => {
	const [productList, setProductList] = useState([]);
	const [loading, setLoading] = useState(false);
	const stateUser = useSelector((state) => state.handleUser);
	const navigate = useNavigate();

	const dispatch = useDispatch();

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
		let componentMounted = true;

		const getProducts = async () => {
			setLoading(true);
			const products = await ProductService.getProducts();
			if (!componentMounted) return;

			setProductList(products);
			setLoading(false);

			return () => {
				componentMounted = false;
			};
		};

		getProducts();
	}, []);

	const filterProduct = (category) => {
		(async () => {
			const filteredList = await ProductService.getProductsByCategory(category);
			setProductList(filteredList);
		})();
	};

	const ShowProducts = () => {
		return (
			<>
				<div className="buttons text-center py-5">
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
					{productList.map((product) => {
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
										<li className="list-group-item lead">$ {product.price}</li>
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
	return (
		<>
			<div className="container my-3 py-3">
				<div className="row">
					<div className="col-12">
						<h2 className="display-5 text-center">Latest Products</h2>
						<hr />
					</div>
				</div>
				<div className="">{loading ? <Loading /> : <ShowProducts />}</div>
			</div>
		</>
	);
};

export default ProductList;
