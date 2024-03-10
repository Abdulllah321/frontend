import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import Modal from "../common/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  deleteItemFromWishlistAsync,
  fetchWishlistItemsByUserIdAsync,
  selectWishListItems,
  selectWishlistLoaded,
  selectWishlistStatus,
} from "./wishListSlice";
import {
  addToCartAsync,
  selectAddToCartError,
  selectAddToCartStatus,
} from "../cart/cartSlice";

export default function WishList() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishListItems) || [];
  const status = useSelector(selectWishlistStatus);
  const wishlistLoaded = useSelector(selectWishlistLoaded);
  const [openModal, setOpenModal] = useState(null);
  const [modal, setModal] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    toast.info("Page loaded");
  }, []);

  useEffect(() => {
    dispatch(fetchWishlistItemsByUserIdAsync())
  }, [dispatch]);

  const handleRemove = (item) => {
    dispatch(deleteItemFromWishlistAsync(item.id))
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -100, scale: 0.95 },
  };

  const handleCart = (product) => {
    if (!Array.isArray(items)) {
      console.error("Items is not an array:", items);
      toast.error("Error: Items is not an array");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const itemIndex = items.findIndex(
      (item) => item.product?.id === product?._id
    );
    if (itemIndex >= 0) {
      toast.error("Item already added to cart");
      return;
    }

    if (
      product.subCategory &&
      product.subCategory.length > 0 &&
      selectedSubCategory === ""
    ) {
      toast.error(`Please select a ${product.subTitle}`);
      return;
    }

    if (product.colors && product.colors.length > 0 && selectedColor === "") {
      toast.error(`Please select a color`);
      return;
    }

    const newItem = {
      product: product?._id,
      quantity: 1,
      subCategory: selectedSubCategory,
      color: selectedColor,
    };

    dispatch(addToCartAsync(newItem))
      .then(() => toast.success("Item added to cart successfully"))
      .catch(() => toast.error("Failed to add item to cart"));

    setModal(false);
  };

  return (
    <AnimatePresence>
      {!items.length && wishlistLoaded && <Navigate to="/" replace={true} />}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={itemVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
              Wishlist
            </h1>
            <div className="flow-root">
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
              ) : null}
              <ul className="-my-6 divide-y divide-gray-200">
                {items.map((item, index) => (
                  <AnimatePresence key={item.id}>
                    <motion.li
                      className="flex py-6"
                      variants={itemVariants}
                      custom={index}
                      transition={{ delay: index * 0.1 }}
                      initial="initial"
                      exit="exit"
                    >
                      <div className="h-36 w-36 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                        <img
                          src={item.product?.thumbnail}
                          alt={item.product?.title}
                          className="h-full w-full object-cover object-center"
                        />
                        {item.product.stock <= 0 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full font-bold text-lg flex items-center justify-center bg-black/50 text-white">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link
                                to={`/product-detail/` + item.product?.id}
                                className="hover:text-blue-700"
                              >
                                {item.product?.title}
                              </Link>
                            </h3>
                            <p className="text-lg font-semibold text-blue-800">
                              Rs. {item.discountPrice}
                            </p>
                          </div>
                          <div className="mt-1 flex justify-between text-sm text-gray-500">
                            <p>
                              <span className="font-bold text-black">
                                Category:&nbsp;
                              </span>
                              {item.product?.category}
                            </p>
                            <p>
                              <span className="font-bold text-black">
                                Brand:&nbsp;
                              </span>
                              {item.product?.brand}
                            </p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-bold text-black">
                                Description:&nbsp;
                              </span>
                              {item.product?.description}
                            </p>
                            <button
                              onClick={() => setOpenModal(item.id)}
                              type="button"
                              className="ml-2 font-medium text-blue-800 hover:text-blue-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (
                              (item.product?.subCategory &&
                                item.product.subCategory.length) ||
                              (item.product?.color &&
                                item.product?.color.length)
                            ) {
                              setModal(item.product);
                            } else {
                              handleCart(item.product);
                            }
                          }}
                          className="mt-4 flex items-center justify-center rounded-md border border-transparent bg-custom-gradient px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-80"
                        >
                          Add to Cart
                        </button>
                        <Modal
                          title={`Delete ${item.product?.title}`}
                          message="Are you sure you want to delete this Wishlist item?"
                          dangerOption="Delete"
                          cancelOption="Cancel"
                          dangerAction={() => handleRemove(item)}
                          cancelAction={() => setOpenModal(null)}
                          showModal={openModal === item.id}
                        />
                      </div>
                    </motion.li>
                    {modal && (
                      <ModalCart
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
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="mt-6">
              <Link
                to="/shop"
                className="flex items-center justify-center rounded-md border border-transparent bg-custom-gradient px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-80"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const ModalCart = ({
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
                      : {}
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

