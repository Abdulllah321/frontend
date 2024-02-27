import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRatingAsync,
  deleteRatingAsync,
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
  selectRating,
  selectSingleProductLoaded,
  updateRatingAsync,
  fetchRatingAsync,
  selectRatingById,
  fetchRatingByIdAsync,
} from "../productSlice";
import { Link, useParams } from "react-router-dom";
import {
  addToCartAsync,
  selectAddToCartError,
  selectAddToCartStatus,
  selectItems,
} from "../../cart/cartSlice";
import { discountedPrice } from "../../../app/constants";
import { useAlert } from "react-alert";
import { Grid } from "react-loader-spinner";
import { selectUserInfo } from "../../user/userSlice";
import Modal from "../../common/Modal";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { uploadCloudinary } from "../../../upload";
import { ReactSortable } from "react-sortablejs";
import { MdDelete } from "react-icons/md";
import { BounceLoader, HashLoader } from "react-spinners";
import { LuUpload } from "react-icons/lu";
import ProductImages from "./ProductImages";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const status = useSelector(selectProductListStatus);
  const addToCartError = useSelector(selectAddToCartError);
  const addToCartStatus = useSelector(selectAddToCartStatus);
  const [hover, setHover] = useState();
  const [rating, setRating] = useState();
  const [open, setOpen] = useState(true);
  const userInfo = useSelector(selectUserInfo);
  const [openModal, setOpenModal] = useState(null);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const singleProductLoaded = useSelector(selectSingleProductLoaded);

  const [randomBackgroundColors, setRandomBackgroundColors] = useState([]);

  useEffect(() => {
    // Define a mapping of colors for each letter
    const letterColors = {
      a: "#8484B7", // Vivid Tangerine
      b: "#C70039", // Imperial Red
      c: "#FFC300", // Vivid Gamboge
      d: "#FF5733", // Same as a (Vivid Tangerine)
      e: "#FFD700", // Gold
      f: "#7FFF00", // Chartreuse
      g: "#40E0D0", // Turquoise
      h: "#6495ED", // Cornflower Blue
      i: "#9370DB", // Medium Purple
      j: "#BA55D3", // Medium Orchid
      k: "#FF69B4", // Hot Pink
      l: "#FF1493", // Deep Pink
      m: "#800080", // Purple
      n: "#00CED1", // Dark Turquoise
      o: "#32CD32", // Lime Green
      p: "#008000", // Green
      q: "#8B4513", // Saddle Brown
      r: "#B22222", // Fire Brick
      s: "#FF8C00", // Dark Orange
      t: "#FF4500", // Orange Red
      u: "#CD853F", // Peru
      v: "#DAA520", // Goldenrod
      w: "#2E8B57", // Sea Green
      x: "#20B2AA", // Light Sea Green
      y: "#1E90FF", // Dodger Blue
      z: "#4169E1", // Royal Blue
    };

    // Store the mapping in state
    setRandomBackgroundColors(letterColors);
  }, []);

  const getColorBasedOnFirstLetter = (letter) => {
    const lowerCaseLetter = letter.toLowerCase();
    return randomBackgroundColors[lowerCaseLetter] || "#000000"; // Default color if letter not found
  };

  const getFirstLetter = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "";
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // TODO: we will get single review every time
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [combinedImages, setCombinedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [allImagesUpdate, setAllImagesUpdate] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [combinedImagesUpdate, setCombinedImagesUpdate] = useState([]);
  const [uploadedImagesUpdate, setUploadedImagesUpdate] = useState([]);
  const [tempArrayUpdate, setTempArrayUpdate] = useState([]);

  const AllRating = useSelector(selectRatingById);
  console.log(AllRating);
  const selectedProductReviews = Array.isArray(AllRating)
    ? AllRating.filter((rate) => rate.productId === product?.id)
    : [];

  const handleCart = (e) => {
    e.preventDefault();

    if (!Array.isArray(items)) {
      console.error("Items is not an array:", items);
      return;
    }

    if (product.stock <= 0) {
      alert.error("Product is out of stock");
      return;
    }

    const itemIndex = items.findIndex(
      (item) => item.product?.id === product?.id
    );
    if (itemIndex >= 0) {
      alert.error("Item Already added");
      return;
    }

    const newItem = {
      product: product?.id,
      quantity: 1,
      subCategory: selectedSubCategory,
      color: selectedColor,
    };
    dispatch(addToCartAsync(newItem));
    if (addToCartStatus === "idle") {
      alert.success("Item added to Cart");
    }
    if (addToCartError) {
      alert.error("an error occured");
    }
    // }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params?.id));
    dispatch(fetchRatingByIdAsync(params?.id));
    dispatch(fetchRatingAsync());

    const extractedUrls = allImages.map((image) => image.url);
    setCombinedImages([...extractedUrls]);

    const NewUrlsUpdate = allImagesUpdate.map((image) => image.url);
    const oldUrlsUpdate = tempArrayUpdate.map((image) => image);

    const updatedCombinedImages = [...oldUrlsUpdate, ...NewUrlsUpdate];

    setCombinedImagesUpdate(updatedCombinedImages);
  }, [dispatch, params?.id, allImages, allImagesUpdate, tempArrayUpdate]);

  const handleMouseEnter = (getCurrentIndex) => {
    setHover(getCurrentIndex);
  };

  const handleClick = (getCurrentIndex) => {
    setRating(getCurrentIndex);
  };

  const handleMouseLeave = () => {
    setHover(rating);
  };

  const handleRating = async (e) => {
    e.preventDefault();
    const messageElement = e.target.elements.message;

    if (!userInfo || !rating || !userInfo.email || !userInfo.name) {
      alert.error("Please log in and provide a rating");
      return;
    }

    if (!messageElement || !messageElement.value.trim()) {
      alert.error("Please enter a review message");
      return;
    }

    const ratingData = {
      productId: product?.id,
      userId: userInfo?.id,
      username: userInfo.name, // Use the username here instead of userID
      rating: rating,
      images: combinedImages,
      userImg: userInfo.imageUrl,
      message: messageElement.value.trim(), // Trim any leading/trailing whitespace
    };

    try {
      await dispatch(createRatingAsync(ratingData));
      alert.success("Rating submitted successfully!");
      setRating(null);
      messageElement.value = "";
    } catch (error) {
      alert.error("Rating had following error" + error);
    }
  };

  const userReviewedProduct = selectedProductReviews.some(
    (review) => review.userId === userInfo?.id
  );

  const handleRatingUpdate = async (e, review) => {
    try {
      const updatedRating = {
        id: review?.id,
        rating: rating,
        images: combinedImagesUpdate,
        message: message,
      };

      await dispatch(updateRatingAsync(updatedRating));
      setOpen(null);
      alert.success("Rating Successfully Updated");
    } catch (error) {
      alert.error("failed to update" + error);
      console.error(error);
    }
  };

  const StarIcons = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${filled ? "text-yellow-600" : "text-gray-600"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      {/* SVG path for a star icon */}
      {filled ? (
        <FaStar className={`w-5 h-5 text-yellow-600 `} />
      ) : (
        <FaRegStar className={`w-5 h-5 text-yellow-600 `} />
      )}
    </svg>
  );

  const handleDelete = async (e, id) => {
    try {
      await dispatch(deleteRatingAsync(id));
      alert.success("Rating Successfully Deleted");
    } catch (error) {
      alert.error("failed to Delete: " + error);
    }
  };

  const handleEdit = (review) => {
    setMessage(review.message);
    setRating(review.rating);
    setOpen(review?.id);
    setTempArrayUpdate(review.images);
  };

  const maxLength = 300;

  function calculateAverageRating(ratings) {
    // Check if the ratings array is empty
    if (ratings.length === 0) {
      return 0; // Return 0 if there are no ratings
    }

    // Calculate the sum of all ratings
    const sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);

    // Calculate the average rating
    const averageRating = sumOfRatings / ratings.length;

    return averageRating;
  }

  const mappedRating = selectedProductReviews.map((rate) => rate.rating);
  const userRatings = mappedRating;
  const average = calculateAverageRating(userRatings);

  const formattedAverage = average.toFixed(1);

  async function uploadImages(e) {
    const images = e.target.files;
    if (!images || images.length === 0) {
      alert.error("No images selected. Please try again.");
      return;
    }

    setLoading(true);
    try {
      let tempArr = []; // Temporary array to store data

      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        tempArr.push(data);
      }

      // Concatenate the uploaded images with previously uploaded ones
      const updatedImages = [...uploadedImages, ...tempArr];
      setUploadedImages(updatedImages);
      setLoading(false);

      setAllImages(updatedImages); // Update allImages state
    } catch (error) {
      alert.error(`Error uploading images: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setCombinedImages([]);
    };
  }, []);

  const updateImagesOrder = (newOrder) => {
    setCombinedImages([...newOrder]);
  };

  const handleMouseEnterImages = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeaveImages = () => {
    setHoveredIndex(null);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = combinedImages.filter((_, i) => i !== index);
    setCombinedImages(updatedImages);
  };

  // Upload images from update rating functoinality

  async function uploadImagesUpdate(e) {
    const images = e.target.files;
    if (!images || images.length === 0) {
      alert.error("No images selected. Please try again.");
      return;
    }

    setLoadingUpdate(true);
    try {
      let tempArr = []; // Temporary array to store data

      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        tempArr.push(data);
      }

      // Concatenate the uploaded images with previously uploaded ones
      const updatedImages = [...uploadedImagesUpdate, ...tempArr];
      setUploadedImagesUpdate(updatedImages);

      // Combine uploaded images with existing ones without duplicates
      const uniqueImages = Array.from(
        new Set([...uploadedImagesUpdate, ...tempArr])
      );

      setLoadingUpdate(false);

      setAllImagesUpdate(uniqueImages);
    } catch (error) {
      alert.error(`Error uploading images: ${error.message}`);
      setLoadingUpdate(false);
    }
  }

  const handleDeleteImageUpdate = (index) => {
    const updatedImages = combinedImagesUpdate.filter((_, i) => i !== index);
    setCombinedImagesUpdate(updatedImages);
  };
  return (
    <>
      {!singleProductLoaded ? (
        <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
          <HashLoader color="blue" size={50} />
        </div>
      ) : (
        <div className="bg-white">
          {status === "loading" ? (
            <Grid
              height="80"
              width="80"
              color="blue"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              visible={true}
            />
          ) : null}
          {product && (
            <div className="pt-6">
              <nav aria-label="Breadcrumb">
                <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                  {product.breadcrumbs &&
                    product.breadcrumbs.map((breadcrumb) => (
                      <li key={breadcrumb?.id}>
                        <div className="flex items-center">
                          <Link
                            to={"/"}
                            className="mr-2 text-sm font-medium text-gray-900"
                          >
                            {breadcrumb.name}
                          </Link>
                          <svg
                            width={16}
                            height={20}
                            viewBox="0 0 16 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-4 text-gray-300"
                          >
                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                          </svg>
                        </div>
                      </li>
                    ))}
                  <li className="text-sm">
                    <button
                      aria-current="page"
                      className="font-medium text-gray-500 hover:text-gray-600"
                    >
                      {product.title}
                    </button>
                  </li>
                </ol>
              </nav>
              <ProductImages product={product} />
              {/* Product info */}
              <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {product.title}
                  </h1>
                </div>
                {/* Options */}
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-xl line-through tracking-tight text-gray-900">
                    Rs.{product.price}
                  </p>
                  <p className="text-3xl tracking-tight text-gray-900">
                    Rs.{discountedPrice(product)}
                  </p>

                  {/* Reviews */}
                  <div className="mt-6">
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((ratingValue) => {
                          // Calculate the full star and half star ratings
                          const fullStar = Math.floor(average);
                          const hasHalfStar = average - fullStar >= 0.5;
                          // Check if the current ratingValue is less than the full star rating
                          const showFullStar = ratingValue < fullStar;

                          // Check if the current ratingValue is equal to the full star rating and there is a half star
                          const showHalfStar =
                            ratingValue === fullStar && hasHalfStar;

                          return (
                            <React.Fragment key={ratingValue}>
                              {showFullStar ? (
                                <FaStar
                                  className={`w-5 h-5 text-yellow-600 `}
                                />
                              ) : showHalfStar ? (
                                <FaStarHalfAlt
                                  className={`w-5 h-5 text-yellow-600 `}
                                />
                              ) : (
                                <FaRegStar
                                  className={`w-5 h-5 text-yellow-600 `}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                        ({formattedAverage >= 1 ? formattedAverage : 0})
                      </div>
                      <p className="sr-only">{product.rating} out of 5 stars</p>
                    </div>
                  </div>

                  <form className="mt-10">
                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Color
                        </h3>

                        <RadioGroup
                          value={selectedColor}
                          onChange={setSelectedColor}
                          className="mt-4"
                        >
                          <RadioGroup.Label className="sr-only">
                            Choose a color
                          </RadioGroup.Label>
                          <div className="flex items-center space-x-3">
                            {product?.colors &&
                              product?.colors.map((color) => (
                                <RadioGroup.Option
                                  key={color}
                                  value={color}
                                  className={({ active, checked }) =>
                                    classNames(
                                      checked
                                        ? `ring ring-offset-4 ring-[${color}]`
                                        : "",
                                      !active && checked ? "" : "",
                                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none",
                                      checked ? `ring-[${color}]` : ""
                                    )
                                  }
                                  style={{ background: color }}
                                >
                                  <RadioGroup.Label
                                    as="span"
                                    className="sr-only"
                                  >
                                    {color}
                                  </RadioGroup.Label>
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      "h-8 w-8 rounded-full border border-black border-opacity-10"
                                    )}
                                    style={{ background: color }}
                                  />
                                </RadioGroup.Option>
                              ))}
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {product.subCategory && product.subCategory?.length > 0 && (
                      <div className="mt-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {product.subTitle}
                          </h3>
                        </div>

                        <RadioGroup
                          value={selectedSubCategory}
                          onChange={setSelectedSubCategory}
                          className="mt-4"
                        >
                          <RadioGroup.Label className="sr-only">
                            Choose a {[product.subTitle]}
                          </RadioGroup.Label>
                          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                            {product.subCategory &&
                              product.subCategory.map((sub) => (
                                <RadioGroup.Option
                                  key={sub.id}
                                  value={sub.value}
                                  className={({ active }) =>
                                    classNames(
                                      active ? "ring-2 ring-blue-800" : "",
                                      "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm"
                                    )
                                  }
                                >
                                  {({ active, checked }) => (
                                    <>
                                      <RadioGroup.Label as="span">
                                        {sub.label}
                                      </RadioGroup.Label>
                                      <span
                                        className={classNames(
                                          active ? "border" : "border-2",
                                          checked
                                            ? "border-blue-800"
                                            : "border-transparent",
                                          "pointer-events-none absolute -inset-px rounded-md"
                                        )}
                                        aria-hidden="true"
                                      />
                                    </>
                                  )}
                                </RadioGroup.Option>
                              ))}
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    <button
                      onClick={handleCart}
                      type="submit"
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-custom-gradient px-8 py-3 text-base font-medium text-white hover:opacity-90 duration-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                    >
                      Add to Cart
                    </button>
                  </form>
                </div>

                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                  {/* Description and details */}
                  <div>
                    <h3 className="sr-only">Description</h3>
                    <div className="space-y-6">
                      <p
                        className="text-base text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      ></p>
                    </div>
                  </div>

                  {product.highlights.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-sm font-medium text-gray-900">
                        Highlights
                      </h3>

                      <div className="mt-4">
                        <ul className="list-disc space-y-2 pl-4 text-sm">
                          {product.highlights.map((highlight) => (
                            <li key={highlight} className="text-gray-400">
                              <span className="text-gray-600">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="mt-10">
                    <h2 className="text-sm font-medium text-gray-900">
                      Details
                    </h2>

                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                  {!userReviewedProduct && (
                    <form
                      className="lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6"
                      onSubmit={handleRating}
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        {Array.from({ length: 5 }, (_, index) => (
                          <StarIcon
                            key={index}
                            className={`${
                              hover !== undefined &&
                              rating !== undefined &&
                              index + 1 <= Math.max(hover, rating)
                                ? "text-yellow-600"
                                : "text-gray-500"
                            } h-8 w-8 cursor-pointer hover:scale-110 transition-all duration-300`}
                            onMouseEnter={() => handleMouseEnter(index + 1)}
                            onClick={() => handleClick(index + 1)}
                            onMouseLeave={() => handleMouseLeave()}
                          />
                        ))}
                      </div>
                      <textarea
                        name="message"
                        placeholder="Your Message here"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-700"
                      />
                      <div className="sm:col-span-6">
                        <div className="mt-2 flex gap-2 ">
                          <ReactSortable
                            list={combinedImages}
                            setList={updateImagesOrder}
                            className="flex gap-2"
                          >
                            {!!combinedImages.length &&
                              combinedImages.map((image, index) => {
                                return (
                                  <div
                                    className="h-28 relative !cursor-pointer"
                                    key={index}
                                    onMouseEnter={() =>
                                      handleMouseEnterImages(index)
                                    }
                                    onMouseLeave={handleMouseLeaveImages}
                                  >
                                    <img
                                      src={image}
                                      alt={index}
                                      className="h-full w-full object-cover transition duration-300 ease-in-out cursor-pointer"
                                    />
                                    <div
                                      className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 ${
                                        hoveredIndex === index
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    >
                                      <MdDelete
                                        className="text-red-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
                                        onClick={() => handleDeleteImage(index)} // Add this line
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </ReactSortable>

                          {loading && (
                            <div className="w-28 h-28 flex items-center justify-center">
                              <BounceLoader color="#4F46E5" />
                            </div>
                          )}
                          <div className="w-28 h-28 flex items-center justify-center rounded-lg bg-gray-300 cursor-pointer ">
                            <label
                              htmlFor="images"
                              className="flex items-center justify-center rounded-lg bg-gray-300 cursor-pointer gap-2 w-full h-full"
                            >
                              <LuUpload className="w-6 h-6" />
                              Upload
                            </label>
                          </div>
                          <input
                            type="file"
                            multiple={true}
                            id="images"
                            onChange={uploadImages}
                            accept="image/*"
                            hidden
                          />

                          <div className="flex gap-2"></div>
                        </div>
                      </div>{" "}
                      <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-custom-gradient text-white rounded-lg hover:opacity-90 transition-all duration-500 focus:outline-none focus:bg-blue-700"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                  {selectedProductReviews.length > 0 ? (
                    <div>
                      <h2 className="text-2xl font-semibold mt-8 mb-4">
                        Reviews
                      </h2>
                      {selectedProductReviews &&
                        selectedProductReviews.map((review) => (
                          <>
                            <div className="flex justify-between w-full">
                              <div
                                key={review.productId}
                                className="mb-4 border-b pb-2"
                              >
                                <div className="flex mb-3 gap-2">
                                  {review.userImg && review.userImg !== "" ? (
                                    <img
                                      className="h-8 w-8 object-cover ml-2 rounded-full"
                                      src={review.userImg}
                                      alt="Your Company"
                                    />
                                  ) : (
                                    <div
                                      className={`h-8 w-8 rounded-full text-center text-white text-[1.2rem]`}
                                      style={{
                                        background: getColorBasedOnFirstLetter(
                                          getFirstLetter(review.username)
                                        ),
                                      }}
                                    >
                                      {getFirstLetter(review.username)}
                                    </div>
                                  )}
                                  <div className="text-gray-600">
                                    {review.username}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <StarIcons
                                        key={index}
                                        filled={(review.rating ?? 0) > index}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {review &&
                                review.message &&
                                review?.message.length > maxLength &&
                                !isExpanded ? (
                                  <div className="line-clamp-4">
                                    {review.message.substring(0, maxLength)}
                                    <span style={{ display: "inline" }}>
                                      ...
                                      <button
                                        onClick={toggleExpand}
                                        className="text-blue-700"
                                      >
                                        Read more
                                      </button>
                                    </span>
                                  </div>
                                ) : (
                                  <div>{review.message}</div>
                                )}
                                <div className="flex gap-2">
                                  {review &&
                                    review.images &&
                                    review.images.map((revImg) => {
                                      return (
                                        <div className="h-28 w-28 relative rounded-lg overflow-hidden">
                                          <img
                                            src={revImg}
                                            alt="Uploaded"
                                            className="h-full w-full object-cover transition duration-300 ease-in-out"
                                          />
                                        </div>
                                      );
                                    })}{" "}
                                </div>
                              </div>
                              {review.userId === userInfo?.id && (
                                <div className="gap-1 flex flex-col">
                                  <button
                                    className="flex gap-1 text-[1rem] items-center bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-900 transition-colors duration-300"
                                    onClick={(e) => handleEdit(review)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-5 h-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    className="flex gap-1 text-[1rem] items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                                    onClick={() => {
                                      setOpenModal(review?.id);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-5 h-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                  <Modal
                                    title={`Delete Review`}
                                    message="Are you sure you want to remove this review ?"
                                    dangerOption="Delete"
                                    cancelOption="Cancel"
                                    dangerAction={(e) => {
                                      handleDelete(e, review?.id);
                                      // e.preventDefault();
                                    }}
                                    cancelAction={() => setOpenModal(null)}
                                    showModal={openModal === review?.id}
                                  ></Modal>
                                </div>
                              )}
                            </div>

                            {review?.id === open ? (
                              <form className="lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6 my-6">
                                <div className="flex items-center space-x-2 mb-4">
                                  {[0, 1, 2, 3, 4].map((index) => (
                                    <StarIcon
                                      key={index}
                                      className={classNames(
                                        index + 1 <= (hover || rating)
                                          ? "text-yellow-600"
                                          : "text-gray-500",
                                        "h-5 w-5 flex-shrink-0"
                                      )}
                                      onMouseEnter={() =>
                                        handleMouseEnter(index + 1)
                                      }
                                      onClick={() => handleClick(index + 1)}
                                      onMouseLeave={() => handleMouseLeave()}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="sr-only">
                                    {review.rating} out of 5 stars
                                  </p>
                                </div>
                                <textarea
                                  name="message"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Your Message here"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-700"
                                />
                                {/* Images */}
                                <div className={`flex gap-1`}>
                                  {!!combinedImagesUpdate.length &&
                                    combinedImagesUpdate.map((image, index) => {
                                      return (
                                        <div
                                          className="h-28 relative !cursor-pointer"
                                          key={index}
                                          onMouseEnter={() =>
                                            handleMouseEnterImages(index)
                                          }
                                          onMouseLeave={handleMouseLeaveImages}
                                        >
                                          <img
                                            src={image}
                                            alt={index}
                                            className="h-full w-full object-cover transition duration-300 ease-in-out cursor-pointer"
                                          />
                                          <div
                                            className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 ${
                                              hoveredIndex === index
                                                ? "opacity-100"
                                                : "opacity-0"
                                            }`}
                                          >
                                            <MdDelete
                                              className="text-red-500 text-3xl absolute top-1/2 left-1/2 -tranyellow-x-1/2 -tranyellow-y-1/2 "
                                              onClick={() =>
                                                handleDeleteImageUpdate(index)
                                              } // Add this line
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {loadingUpdate && (
                                    <div className="w-28 h-28 flex items-center justify-center">
                                      <BounceLoader color="#4F46E5" />
                                    </div>
                                  )}
                                  <div className="w-28 h-28 flex items-center justify-center rounded-lg bg-gray-300 cursor-pointer ">
                                    <label
                                      htmlFor="images"
                                      className="flex items-center justify-center rounded-lg bg-gray-300 cursor-pointer gap-2 w-full h-full"
                                    >
                                      <LuUpload className="w-6 h-6" />
                                      Upload
                                    </label>
                                  </div>
                                  <input
                                    type="file"
                                    multiple={true}
                                    id="images"
                                    onChange={uploadImagesUpdate}
                                    accept="image/*"
                                    hidden
                                  />{" "}
                                </div>
                                <div className="flex w-full gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpen(null);
                                    }}
                                    className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-4 px-4 py-2 bg-custom-gradient text-white rounded-lg hover:opacity-90 focus:outline-none focus:bg-blue-700"
                                    onClick={(e) => {
                                      handleRatingUpdate(e, review);
                                    }}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </form>
                            ) : null}
                          </>
                        ))}
                    </div>
                  ) : null}{" "}
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
