import React, { useState, Fragment, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductsByFiltersAsync,
  fetchRatingAsync,
  selectAllProducts,
  selectProductListStatus,
  selectProductLoaded,
  selectTotalItems,
} from "../productSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import styles from "../../../styles/productList.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { FaAutoprefixer, FaRegFrownOpen } from "react-icons/fa";
import {
  addToCartAsync,
  selectAddToCart,
  selectAddToCartError,
  selectAddToCartStatus,
  selectItems,
} from "../../cart/cartSlice";
import { useAlert } from "react-alert";
import { ScaleLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import ProductGrid from "./ProductGrid";
import Sliders from "./Sliders";

export default function HomeProductList() {
  const dispatch = useDispatch();
  const productResult = useSelector(selectAllProducts);
  const products = productResult.results || [];
  const totalItems = useSelector(selectTotalItems);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [modal, setModal] = useState("");
  const [page, setPage] = useState(1);
  const status = useSelector(selectProductListStatus);
  const [isFlexView, setIsFlexView] = useState("grid");
  const productLoaded = useSelector(selectProductLoaded);
  const items = useSelector(selectItems);
  const alert = useAlert();
  const selectCartStatus = useSelector(selectAddToCartStatus);
  const selectCartError = useSelector(selectAddToCartError);

  useEffect(() => {
    let canCallScrollEvent = true;
    if (uniqueProducts.length && uniqueProducts.length >= totalItems) {
      setIsLoading(false);
      canCallScrollEvent = false;
    }

    const handleScroll = () => {
      if (!canCallScrollEvent) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight + 1 >= scrollHeight - 400) {
        canCallScrollEvent = false;
        if (productData.length !== totalItems + 10) {
          setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
            canCallScrollEvent = true;
          }, 1000);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [productData, totalItems]);

  useEffect(() => {
    const pagination = { _page: page, _limit: 10 };
    dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }));
    dispatch(fetchRatingAsync());
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    if (status === "idle") {
      setProductData((prev) => {
        return [...prev, ...products];
      });
    }
    if (uniqueProducts.length && uniqueProducts.length >= totalItems) {
      setIsLoading(false);
    }
    if (status === "loading") {
      setIsLoading(true);
    }
  }, [status, products, totalItems]);

  useEffect(() => {
    let uniqueIds = new Set();
    let uniqueProductsArray = productData.filter((product) => {
      if (!uniqueIds.has(product._id)) {
        uniqueIds.add(product._id);
        return true;
      }
      return false;
    });

    setUniqueProducts(uniqueProductsArray);
  }, [productData, totalItems]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleCart = (product) => {
    if (!Array.isArray(items)) {
      console.error("Items is not an array:", items);
      return;
    }

    if (product.stock <= 0) {
      alert.error("Product is out of stock");
      return;
    }

    const itemIndex = items.findIndex(
      (item) => item.product?.id === product?._id
    );
    if (itemIndex >= 0) {
      alert.error("Item Already added");
      return;
    }
    if (
      product.subCategory &&
      product.subCategory.length > 0 &&
      selectedSubCategory === ""
    ) {
      alert.error(`Please select a ${product.subTitle}`);
      return;
    }
    if (product.colors && product.colors.length > 0 && selectedColor === "") {
      alert.error(`Please select a color`);
      return;
    }

    const newItem = {
      product: product?._id,
      quantity: 1,
      subCategory: selectedSubCategory,
      color: selectedColor,
    };
    dispatch(addToCartAsync(newItem));
    if (selectCartStatus === "idle") {
      alert.success("Item Added to cart");
    } else if (selectCartError) {
      alert.error("server error");
    }
    setModal(false);
  };

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="bg-white">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Product grid */}
              <div className={`${"lg:col-span-6"}`}>
                {uniqueProducts.length > 0 ? (
                  <>
                    <Sliders />
                    {productLoaded && (
                      <ProductGrid
                        products={uniqueProducts}
                        status={status}
                        handleCart={handleCart}
                        isFlexView={isFlexView === "list"}
                        setModal={setModal}
                      ></ProductGrid>
                    )}

                    {uniqueProducts.length &&
                      uniqueProducts.length >= totalItems && (
                        <div className="text-3xl font-bold text-center mt-4">
                          You Have seen all products
                        </div>
                      )}

                    {isLoading && <SkeletonCard />}
                    {isLoading && (
                      <ScaleLoader
                        className="mx-auto w-10 mt-6"
                        color="#1e3a8a"
                      />
                    )}
                    <motion.button
                      className={`${
                        isVisible ? "block" : "hidden"
                      } fixed bottom-4 right-6 p-2 bg-custom-gradient text-white rounded-full hover:bg-blue-*00 transition-all duration-300 ease-in-out text-3xl`}
                      onClick={scrollToTop}
                      whileTap={{ scale: 0.8 }}
                    >
                      <FaAutoprefixer />
                    </motion.button>
                  </>
                ) : null}
              </div>
              {/* Product grid end */}
            </div>
          </section>

          <AnimatePresence>
            {modal && (
              <Modal
                setModal={setModal}
                modal={modal}
                subCat={selectedSubCategory}
                setSubCat={setSelectedSubCategory}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                handleCart={handleCart}
              />
            )}
          </AnimatePresence>
          {/* section of product and filters ends */}
          {/* {!searchFilter && (
              <Pagination
                page={page}
                setPage={setPage}
                handlePage={handlePage}
                totalItems={totalItems}
              ></Pagination>
            )} */}
        </main>
      </div>
    </>
  );
}

const Modal = ({
  modal,
  setModal,
  subCat,
  setSubCat,
  selectedColor,
  setSelectedColor,
  handleCart,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-40"
        onClick={() => setModal(false)}
      />
      <motion.div
        key="modalContent"
        className="sm:w-[50%] sm:h-[30vh] sm:-translate-x-1/2 sm:-translate-y-1/2 fixed sm:top-1/2 sm:left-1/2 bottom-0 left-0 top-auto w-full bg-white py-5 px-5 rounded-lg z-50 h-1/2 transition-all"
        initial={
          window.innerWidth < 1024
            ? { bottom: "-100%" }
            : { scale: 0.5, opacity: 0, transform: "translate(-50%, -50%)" }
        }
        animate={
          window.innerWidth < 1024
            ? { bottom: "0%" }
            : { scale: 1, opacity: 1, transform: "translate(-50%, -50%)" }
        }
        exit={
          window.innerWidth < 1024
            ? { bottom: "-100%" }
            : { scale: 0.5, opacity: 0, transform: "translate(-50%, -50%)" }
        }
        transition={{ duration: 0.5, type: "spring" }}
      >
        {modal.colors && (
          <div>
            <b>Please Select a color: </b>
            <div className="flex gap-4">
              {modal.colors.map((color) => (
                <div className="relative" key={color}>
                  <div
                    className={`w-10 h-10 rounded-full my-2 cursor-pointer z-10`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                  {selectedColor === color && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 -left-1 w-12 h-12 rounded-full bg-transparent"
                      style={{ outline: `3px solid ${color}` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {modal.subCategory && (
          <div>
            <h1 className="font-bold mb-3">
              Please select a {modal.subTitle}:{" "}
            </h1>
            <div className="flex flex-wrap gap-2">
              {modal.subCategory.map((sub) => (
                <div
                  key={sub.id}
                  className={`flex items-center cursor-pointer px-12 py-3 text-1xl rounded-lg border border-gray-400 uppercase justify-center duration-300 transition`}
                  style={
                    subCat === sub.label
                      ? {
                          boxShadow:
                            "inset 0 0 15px #1D4ED8, 0 3px 5px #1D4ED8",
                          textShadow: "0 0 0.15em #1da9cc",
                        }
                      : {} // Empty object for no styles
                  }
                  onClick={() => setSubCat(sub.label)}
                >
                  {sub.label}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          className="absolute left-[0.7rem] bottom-[0.7rem] w-[calc(100%-1.25rem)] bg-custom-gradient text-white py-2 rounded-lg hover:bg-blue-900 transition-all duration-300"
          onClick={() => handleCart(modal)}
        >
          Add to cart
        </button>
      </motion.div>
    </>
  );
};

const SkeletonCard = () => {
  const cardsInRow = 5;
  return (
    <div className="mt-4">
      <div className={` ${styles.root}`}>
        {Array.from({ length: cardsInRow }, (_, index) => (
          <div>
            <Skeleton height={200} />
            <Skeleton count={2} />
            <div>
              <Skeleton height={40} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
