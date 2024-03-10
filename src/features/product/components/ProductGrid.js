import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import styles from "../../../styles/productList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectRating } from "../productSlice";
import { Grid } from "react-loader-spinner";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  addToWishlistAsync,
  selectAddToWishlistStatus,
  selectWishListItems,
} from "../../wishlist/wishListSlice";
import { toast } from "react-toastify";

const productVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const ProductGrid = ({
  status,
  products,
  isFlexView,
  handleCart,
  setModal,
}) => {
  const rating = useSelector(selectRating);
  const dispatch = useDispatch();
  const [isWishlistActive, setIsWishlistActive] = useState([]);
  const wishlist = useSelector(selectWishListItems);
  const addToWishlistStatus = useSelector(selectAddToWishlistStatus);

  useEffect(() => {
    wishlist.forEach((wish) => {
      setIsWishlistActive((prev) => [...prev, wish.product.id]);
    });
  }, [wishlist, products]);

  const handleWishList = (product) => {
    if (!isWishlistActive.includes(product._id)) {
      dispatch(addToWishlistAsync({ product: product._id }));
      if (addToWishlistStatus === "succeeded") {
        toast.success(product.title + " is added successfully in the wishlist");
      } else {
        toast.error("Failed to add " + product.title + " to the wishlist");
      }
    } else {
      toast.info(product.title + " is already in the wishlist");
    }
  };

  return (
    <div>
      {status === "loading" ? (
        <Grid
          height="80"
          width="80"
          color="blue"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : null}{" "}
      <motion.div
        className={isFlexView ? styles.flexRoot : styles.root}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {products &&
          products?.length > 0 &&
          products?.map((product) => {
            const productRating = rating.find(
              (rating) => rating.productId === product._id
            );

            // Use optional chaining to handle cases where the rating might be undefined
            const averageRating = productRating?.averageRating || 0;
            const fullStar = Math.floor(averageRating);
            const hasHalfStar = averageRating - fullStar >= 0.5;
            return (
              <div key={product._id} className={isFlexView ? styles.flex : ``}>
                <div className={isFlexView ? styles.flexBox : styles.box}>
                  <Link
                    to={"/product-detail/" + product._id}
                    className={isFlexView ? "flex gap-3 w-full" : ""}
                  >
                    <div
                      className={`relative ${
                        isFlexView
                          ? "h-full w-1/2 md:w-[35%] min-w-[30%] flex items-center justify-between"
                          : ""
                      } ${styles.imgBox}  `}
                    >
                      <img
                        src={
                          product.thumbnail
                            ? product.thumbnail
                            : product.images[0]
                        }
                        alt={product.title}
                        className={styles.images}
                      />
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-20">
                          <p className="text-2xl font-bold text-white text-center">
                            out of stock
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={
                        isFlexView
                          ? "flex justify-between w-full"
                          : styles.bottom
                      }
                    >
                      <div
                        className={`${
                          isFlexView ? "flex flex-col gap-1" : "mt-4 w-full"
                        }`}
                      >
                        <h3
                          className={
                            isFlexView
                              ? "text-2xl font-bold top-0 relative"
                              : styles.title
                          }
                        >
                          <Link to={"/product-detail/" + product._id}>
                            {product.title || <Skeleton />}{" "}
                          </Link>
                        </h3>
                        {isFlexView && (
                          <p>
                            <b>Category: </b>
                            <span className="text-gray-500 capitalize">
                              {product.category}
                            </span>
                          </p>
                        )}
                        {isFlexView && (
                          <p>
                            <b>Brands: </b>
                            <span className="text-gray-500 capitalize">
                              {product.brand}
                            </span>
                          </p>
                        )}
                        {isFlexView && (
                          <p className="line-clamp-2">
                            <b>Description: </b>
                            <span className="text-gray-500">
                              {product.description}
                            </span>
                          </p>
                        )}
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((ratingValue) => (
                            <React.Fragment key={ratingValue}>
                              {ratingValue < fullStar ? (
                                <FaStar className="w-5 h-5 text-yellow-600" />
                              ) : hasHalfStar ? (
                                <FaStarHalfAlt className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <FaRegStar className="w-5 h-5 text-yellow-600" />
                              )}
                            </React.Fragment>
                          ))}
                          {averageRating > 0 && (
                            <span className="ml-1 text-gray-600">
                              ({averageRating.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>

                      {!isFlexView && (
                        <div className="mt-4 w-full relative left-0">
                          <p className="text-md font-bold text-gray-900">
                            Rs.
                            {Math.round(
                              product.price *
                                (1 - product.discountPercentage / 100)
                            )}
                          </p>
                          <span className="text-sm text-blue-700 font-bold relative flex gap-2">
                            <p className="text-sm font-bold text-gray-400 line-through">
                              Rs. {product.price}
                            </p>
                            <span className="">
                              -{product.discountPercentage}%
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className={isFlexView ? `w-[20%] md:block hidden` : ``}>
                    {isFlexView && (
                      <div className="mt-4">
                        <p className="text-md font-bold text-gray-900 text-right">
                          $
                          {Math.round(
                            product.price *
                              (1 - product.discountPercentage / 100)
                          )}
                        </p>
                        <span className="text-sm text-blue-700 font-bold relative text-right">
                          <span className=" absolute right-[40%]">
                            -{product.discountPercentage}%
                          </span>
                          <p className="text-sm font-bold text-gray-400 line-through">
                            Rs. {product.price}
                          </p>
                        </span>
                      </div>
                    )}
                    {!isFlexView && (
                      <div className="flex flex-nowrap border-t border-gray-200 mt-3 pt-3">
                        <button
                          className="bg-custom-gradient text-white px-3 rounded-md hover:bg-blue-900 transition-colors duration-300 w-full py-2"
                          onClick={() => {
                            if (product?.subCategory || product?.color) {
                              setModal(product);
                            } else {
                              handleCart(product);
                            }
                          }}
                        >
                          Add to Cart
                        </button>
                        <div
                          className="stage"
                          onClick={() => handleWishList(product)}
                        >
                          <div
                            className={`${
                              isWishlistActive.includes(product._id)
                                ? "heartIcon is-active"
                                : "heartIcon"
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}
                    {isFlexView && (
                      <button
                        className="bg-custom-gradient text-white md:px-3 px-2 md:py-2 py-1 rounded-md hover:bg-blue-900 transition-colors duration-300 mx-auto mt-3 relative w-28 md:w-32"
                        onClick={() => {
                          if (product?.subCategory || product?.color) {
                            setModal(product);
                          } else {
                            handleCart(product);
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={
                    isFlexView
                      ? `w-full flex justify-between md:hidden items-center`
                      : `hidden`
                  }
                >
                  <div>
                    {isFlexView && (
                      <button
                        className="bg-custom-gradient text-white px-3  py-2 rounded-md hover:bg-blue-900 transition-colors duration-300 mx-auto mt-3 w-32"
                        onClick={() => {
                          if (product?.subCategory || product?.color) {
                            setModal(product);
                          } else {
                            handleCart(product);
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                  <div>
                    {isFlexView && (
                      <div className="mt-4">
                        <p className="text-md font-bold text-gray-900 text-right">
                          Rs.
                          {Math.round(
                            product.price *
                              (1 - product.discountPercentage / 100)
                          )}
                        </p>
                        <span className="text-sm text-blue-700 font-bold relative text-right">
                          <span className=" absolute right-[110%]">
                            -{product.discountPercentage}%
                          </span>
                          <p className="text-sm font-bold text-gray-400 line-through">
                            Rs. {product.price}
                          </p>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </motion.div>
    </div>
  );
};

export default ProductGrid;
