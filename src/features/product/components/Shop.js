import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductsByFiltersAsync,
  fetchRatingAsync,
  selectAllProducts,
  selectBrands,
  selectCategories,
  selectProductListStatus,
  selectProductLoaded,
  selectTotalItems,
} from "../../product/productSlice";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { BsFillGridFill } from "react-icons/bs";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";
import { HashLoader } from "react-spinners";
import { Grid } from "react-loader-spinner";
import Pagination from "../../common/Pagination";
import ProductGrid from "./ProductGrid";
import { FaListUl, FaRegStar, FaStar } from "react-icons/fa";
import {
  addToCartAsync,
  selectAddToCartError,
  selectAddToCartStatus,
  selectItems,
} from "../../cart/cartSlice";
import { useAlert } from "react-alert";
import { AnimatePresence, motion } from "framer-motion";

const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  {
    name: "Price: Low to High",
    sort: "discountPrice",
    order: "asc",
    current: false,
  },
  {
    name: "Price: High to Low",
    sort: "discountPrice",
    order: "desc",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Shop() {
  const dispatch = useDispatch();
  const productResult = useSelector(selectAllProducts);
  const products = productResult.results;
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const productLoaded = useSelector(selectProductLoaded);
  const status = useSelector(selectProductListStatus);
  const [rating, setRating] = useState(0);
  const [isFlexView, setIsFlexView] = useState("grid");
  const items = useSelector(selectItems);
  const alert = useAlert();
  const selectCartStatus = useSelector(selectAddToCartStatus);
  const selectCartError = useSelector(selectAddToCartError);
  const [selectedColor, setSelectedColor] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const minPrice =
    productResult && productResult?.minPrice ? productResult?.minPrice : 3;
  const maxPrice =
    productResult && productResult?.maxPrice
      ? productResult?.maxPrice
      : 2000000;
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      const index = newFilter[section.id].findIndex(
        (el) => el === option.value
      );
      newFilter[section.id].splice(index, 1);
    }

    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(
      fetchProductsByFiltersAsync({
        filter,
        sort,
        pagination,
        admin: false,
        min: priceRange[0],
        max: priceRange[1],
        rating: rating,
      })
    );
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchRatingAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handlePriceRangeChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const handleSubmitPrice = (e) => {
    e.preventDefault();
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    const submitData = {
      filter,
      sort,
      pagination,
      admin: false,
      min: priceRange[0],
      max: priceRange[1],
      rating: rating,
    };

    console.log(submitData);
    dispatch(fetchProductsByFiltersAsync(submitData));
  };

  const handleRating = function (rating) {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    const submitData = {
      filter,
      sort,
      pagination,
      admin: false,
      min: priceRange[0],
      max: priceRange[1],
      rating: rating.solidStars,
    };
    setRating(rating.solidStars);
    dispatch(fetchProductsByFiltersAsync(submitData));
  };

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

  return (
    <>
      {!productLoaded ? (
        <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
          <HashLoader color="blue" size={50} />
        </div>
      ) : (
        <div className="bg-white">
          <div>
            <MobileFilter
              handleFilter={handleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              filters={filters}
              min={minPrice}
              max={maxPrice}
              filter={filter}
              handlePriceRangeChange={handlePriceRangeChange}
              priceRange={priceRange}
              handleSubmitPrice={handleSubmitPrice}
              handleRating={handleRating}
            ></MobileFilter>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Filters
                </h1>

                <div className="flex items-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        Sort
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              {({ active }) => (
                                <p
                                  onClick={(e) => handleSort(e, option)}
                                  className={classNames(
                                    option.current
                                      ? "font-medium text-gray-900"
                                      : "text-gray-500",
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  {option.name}
                                </p>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <button
                    type="button"
                    className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                  >
                    <span className="sr-only">View grid</span>
                    <BsFillGridFill
                      className={`h-5 w-5 ${
                        isFlexView === "grid" ? "text-black" : "text-gray-500"
                      }`}
                      aria-hidden="true"
                      onClick={() => setIsFlexView("grid")}
                    />
                  </button>
                  <button
                    type="button"
                    className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                  >
                    <span className="sr-only">View grid</span>
                    <FaListUl
                      className={`h-5 w-5 ${
                        isFlexView === "list" ? "text-black" : "text-gray-500"
                      }`}
                      aria-hidden="true"
                      onClick={() => setIsFlexView("list")}
                    />
                  </button>
                  <button
                    type="button"
                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <span className="sr-only">Filters</span>
                    <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <section
                aria-labelledby="products-heading"
                className="pb-24 pt-6"
              >
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  <DesktopFilter
                    handleFilter={handleFilter}
                    filters={filters}
                    filter={filter}
                    min={minPrice}
                    max={maxPrice}
                    handlePriceRangeChange={handlePriceRangeChange}
                    priceRange={priceRange}
                    handleSubmitPrice={handleSubmitPrice}
                    handleRating={handleRating}
                  ></DesktopFilter>

                  {/* Product grid */}
                  <div className="lg:col-span-3">
                    <ProductGrid
                      products={products}
                      status={status}
                      handleCart={handleCart}
                      isFlexView={isFlexView === "list"}
                      setModal={setModal}
                    ></ProductGrid>
                  </div>
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
              <Pagination
                page={page}
                setPage={setPage}
                handlePage={handlePage}
                totalItems={totalItems}
              ></Pagination>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

function DesktopFilter({
  handleFilter,
  filters,
  filter,
  priceRange,
  handlePriceRangeChange,
  min,
  max,
  handleSubmitPrice,
  handleRating,
}) {
  const handleMinChange = (e) => {
    e.preventDefault();
    const inputValue = +e.target.value;
    const newMinValue = inputValue < min ? min : inputValue;
    handlePriceRangeChange([newMinValue, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const inputValue = +e.target.value;
    const newMaxValue = inputValue > max ? max : inputValue;
    handlePriceRangeChange([priceRange[0], newMaxValue]);
  };

  const number = max;
  const numberString = number.toString();
  const maxLength = numberString.length;

  return (
    <div className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center relative">
                    <span
                      className={`h-[1px] w-3 bg-black absolute right-4  transition-all duration-300 ${
                        open ? "rotate-0" : "rotate-90"
                      }`}
                    />
                    <span
                      className={`h-[1px] w-3 bg-black absolute right-4 top-0 transition-all duration-300 ${
                        open ? "rotate-180" : "-rotate-180"
                      }`}
                    />
                  </span>
                </Disclosure.Button>
              </h3>
              <Transition
                as={Fragment}
                enter="transition-transform duration-300 ease-in-out"
                enterFrom="scale-y-0 transform origin-top"
                enterTo="scale-y-100 transform origin-top"
                leave="transition-transform duration-300 ease-in-out"
                leaveFrom="scale-y-100 transform origin-top"
                leaveTo="scale-y-0 transform origin-top"
              >
                <Disclosure.Panel
                  className={`pt-6 ${
                    open ? "scale-y-100" : "scale-y-0"
                  } transform transform-origin-top transition-transform duration-300 ease-in-out`}
                >
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={filter[section.id]?.includes(
                            option.value
                          )}
                          onChange={(e) => handleFilter(e, section, option)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}

      <div className="py-6 space-x-2 border-b border-gray-200">
        <h3 className="mb-2">Price</h3>
        <form className="flex items-center space-x-2 justify-start">
          <input
            type="number"
            id="minPrice"
            name="min"
            placeholder="min"
            min={min}
            max={max}
            onChange={handleMinChange}
            className="border border-gray-300 p-2 w-24 rounded-md"
          />
          <span>-</span>
          <input
            type="number"
            id="maxPrice"
            placeholder="max"
            name="max"
            min={min}
            max={max}
            maxLength={maxLength}
            onChange={handleMaxChange}
            className="border border-gray-300 p-2 w-24 rounded-md"
          />
          <button
            className="bg-custom-gradient text-white p-2 rounded-md"
            type="submit"
            onClick={(e) => handleSubmitPrice(e)}
          >
            Apply
          </button>
        </form>
      </div>
      <StarRating handleRating={handleRating} />
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
  min,
  max,
  handlePriceRangeChange,
  priceRange,
  handleSubmitPrice,
  filter,
  handleRating,
}) {
  const handleMinChange = (e) => {
    e.preventDefault();
    const inputValue = +e.target.value;
    const newMinValue = inputValue < min ? min : inputValue;
    handlePriceRangeChange([newMinValue, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    e.preventDefault();
    const inputValue = +e.target.value;
    const newMaxValue = inputValue > max ? max : inputValue;
    handlePriceRangeChange([priceRange[0], newMaxValue]);
  };

  const number = max;
  const numberString = number.toString();
  const maxLength = numberString.length;
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl px-3">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center relative">
                              <span
                                className={`h-[1px] w-3 bg-black absolute right-4  transition-all duration-300 ${
                                  open ? "rotate-0" : "rotate-90"
                                }`}
                              />
                              <span
                                className={`h-[1px] w-3 bg-black absolute right-4 top-0 transition-all duration-300 ${
                                  open ? "rotate-180" : "-rotate-180"
                                }`}
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Transition
                          as={Fragment}
                          enter="transition-transform duration-300 ease-in-out"
                          enterFrom="scale-y-0 transform origin-top"
                          enterTo="scale-y-100 transform origin-top"
                          leave="transition-transform duration-300 ease-in-out"
                          leaveFrom="scale-y-100 transform origin-top"
                          leaveTo="scale-y-0 transform origin-top"
                        >
                          <Disclosure.Panel
                            className={`pt-6 ${
                              open ? "scale-y-100" : "scale-y-0"
                            } transform transform-origin-top transition-transform duration-300 ease-in-out`}
                          >
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={filter[
                                      section.id
                                    ]?.includes(option.value)}
                                    onChange={(e) =>
                                      handleFilter(e, section, option)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-700"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
              <div className="py-6 space-x-2 border-b border-gray-200">
                <h3 className="mb-2">Price</h3>
                <form className="flex items-center space-x-2 justify-start">
                  <input
                    type="number"
                    id="minPrice"
                    name="min"
                    placeholder="min"
                    min={min}
                    max={max}
                    onChange={handleMinChange}
                    className="border border-gray-300 p-2 w-24 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    id="maxPrice"
                    placeholder="max"
                    name="max"
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    onChange={handleMaxChange}
                    className="border border-gray-300 p-2 w-24 rounded-md"
                  />
                  <button
                    className="bg-custom-gradient text-white p-2 rounded-md"
                    type="submit"
                    onClick={(e) => handleSubmitPrice(e)}
                  >
                    Apply
                  </button>
                </form>
              </div>
              <StarRating handleRating={handleRating} />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const StarRating = ({ handleRating }) => {
  const ratings = [
    { solidStars: 4, emptyStars: 1 },
    { solidStars: 3, emptyStars: 2 },
    { solidStars: 2, emptyStars: 3 },
    { solidStars: 1, emptyStars: 4 },
  ];

  return (
    <div className=" border-b border-gray-300 py-6">
      <h1>Rating</h1>
      {ratings.map((rating, index) => (
        <div
          key={index}
          className="flex gap-2 py-2 cursor-pointer"
          onClick={() => handleRating(rating)}
        >
          {[...Array(rating.solidStars)].map((i) => (
            <span key={i} className="text-orange-300">
              <FaStar className="w-6 h-6" />
            </span>
          ))}
          {[...Array(rating.emptyStars)].map((i) => (
            <span key={i}>
              <FaRegStar className="w-6 h-6 text-orange-300" />
            </span>
          ))}
          <h1 className="text-md text-gray-400">{rating.solidStars} & Up</h1>
        </div>
      ))}
    </div>
  );
};

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
