import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import styles from "../../../styles/productList.module.css";
import { useSelector } from "react-redux";
import { selectRating } from "../productSlice";
import { Grid } from "react-loader-spinner";
import { motion } from "framer-motion";
import React from "react";

const ProductGrid = ({
  status,
  products,
  isFlexView,
  handleCart,
  setModal,
}) => {
  const rating = useSelector(selectRating);

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
                      className={
                        isFlexView
                          ? `!h-full w-1/2 md:w-[35%] min-[30%] flex items-center justify-between` +
                            styles.imgBox
                          : styles.imgBox
                      }
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
                            <div>
                              {isFlexView && (
                                <div>
                                  {product.stock <= 0 && (
                                    <div>
                                      <p className="text-sm text-red-400 font-bold text-right">
                                        (out of stock)
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
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
                          {/* ({formattedAverage >= 1 ? formattedAverage : 0}) */}
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
                    {!isFlexView && (
                      <div
                        className={`w-full flex items-center ${
                          product.stock <= 0
                            ? "justify-between"
                            : "justify-end items-center"
                        }`}
                      >
                        {product.stock <= 0 && (
                          <div>
                            <p className="text-sm text-red-400">out of stock</p>
                          </div>
                        )}
                      </div>
                    )}
                    {isFlexView && (
                      <div>
                        {product.stock <= 0 && (
                          <div>
                            <p className="text-sm text-red-400 font-bold text-right">
                              (out of stock)
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
                      <button
                        className="bg-custom-gradient text-white px-3 py-2 rounded-md hover:bg-blue-900 transition-colors duration-300 w-full mx-auto mt-3 bottom-0 relative"
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
