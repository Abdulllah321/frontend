import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  fetchSubCategoriesAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  selectSubCategories,
  updateProductAsync,
} from "../../product/productSlice";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { useAlert } from "react-alert";
import { LuUpload } from "react-icons/lu";
import { uploadCloudinary } from "../../../upload";
import { BounceLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";
import { MdDelete } from "react-icons/md";
import { FaTimes } from "react-icons/fa"; // Assuming FaXmark is a typo, and you meant FaTimes
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);

  const [openModal, setOpenModal] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [combinedImages, setCombinedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUploader, setFileUploader] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [highlight, setHighlight] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [formattedDescription, setFormattedDescription] = useState("");

  const handleCancel = () => {
    dispatch(clearSelectedProduct());
  };
  const alert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
    dispatch(fetchSubCategoriesAsync());
  }, [params.id, dispatch]);

  useEffect(() => {
    const productImages = selectedProduct ? selectedProduct.images : [];
    const extractedUrls = allImages.map((image) => image.url);

    if (selectedProduct) {
      setCombinedImages(productImages, [...extractedUrls]);
    } else {
      setCombinedImages([...extractedUrls]);
    }

    if (selectedProduct?.thumbnail) {
      setImageUrl(selectedProduct.thumbnail);
      setFileUploader(false);
    }
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setFormattedDescription(selectedProduct.description);
      setEditorState(selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("stock", selectedProduct.stock);
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
      setValue("subTitle", selectedProduct.subTitle);
      setParentCategory(selectedProduct.category);
      const subCategoryIds = selectedProduct.subCategory.map((sub) => sub);
      setSelectedSubCategories(subCategoryIds);
      setColors(selectedProduct.colors);
      setHighlights(selectedProduct.highlights);
      setKeywords(selectedProduct.keywords);
    }
  }, [allImages, selectedProduct, setValue, params.id]);

  const handleDelete = () => {
    navigate("/admin");
    const product = { ...selectedProduct };
    product.deleted = true;
    alert.success(`${selectedProduct.title} Successfully Deleted`);
    dispatch(updateProductAsync(product));

    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: For a smooth scroll effect
    });
  };

  const product = { ...selectedProduct };
  const handleRestore = () => {
    navigate("/admin");
    product.deleted = false;
    alert.success(`${selectedProduct.title} Successfully Restored`);
    dispatch(updateProductAsync(product));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  async function uploadImages(e) {
    const images = e.target.files;
    if (e.target.files.length > 0) {
      e.preventDefault();
      setLoading(true);
      try {
        let tempArr = [];

        for (let i = 0; i < images.length; i++) {
          const data = await uploadCloudinary(images[i]);
          tempArr.push(data);
        }

        const updatedImages = [...uploadedImages, ...tempArr];
        setUploadedImages(updatedImages);

        setLoading(false);

        setAllImages(updatedImages); // Update allImages state
      } catch (error) {
        alert.error(`Error uploading images: ${error.message}`);
        setLoading(false);
      }
    } else {
      alert.error("No images selected. Please try again.");
    }
  }

  useEffect(() => {
    return () => {
      setCombinedImages([]);
      setImageUrl("");
    };
  }, []);

  const updateImagesOrder = (newOrder) => {
    setCombinedImages([...newOrder]);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = combinedImages.filter((_, i) => i !== index);
    setCombinedImages(updatedImages);

    // Update selectedProduct.images with modified images
    const updatedProductImages = selectedProduct.images.filter(
      (_, i) => i !== index
    );
    const updatedProduct = { ...selectedProduct, images: updatedProductImages };

    // Dispatch action to update the product in the backend
    dispatch(updateProductAsync(updatedProduct))
      .then(() => {
        alert.success("Image Deleted Successfully");
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  async function uploadThumbnail(e) {
    const image = e.target.files[0];

    if (image) {
      e.preventDefault();
      setThumbnailLoading(true);

      try {
        const data = await uploadCloudinary(image);
        setThumbnailLoading(false);
        setImageUrl(data.url);
        setFileUploader(false);
      } catch (error) {
        alert.error(`Error uploading image: ${error.message}`);
        setThumbnailLoading(false);
      }
    } else {
      alert.error("No image selected. Please try again.");
    }
  }

  const handleDeleteThumbnail = () => {
    setImageUrl("");
    setFileUploader(true);
  };

  const handleMouseEnterThumbnail = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveThumbnail = () => {
    setIsHovered(false);
  };

  const handleCheckboxClick = (sub) => {
    const updatedSelection = [...selectedSubCategories];
    const index = updatedSelection.findIndex(
      (selectedSub) => selectedSub.id === sub.id
    );

    if (index === -1) {
      updatedSelection.push({
        id: sub.id,
        value: sub.value,
        label: sub.label,
      });
    } else {
      updatedSelection.splice(index, 1);
    }
    setSelectedSubCategories(updatedSelection);
  };

  const handleAddColor = () => {
    setColors([...colors, "#054bd6"]);
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const addHighlight = () => {
    if (highlight.trim() !== "") {
      setHighlights([...highlights, highlight]);
      setHighlight("");
    }
  };

  const removeHighlight = (index) => {
    const updatedHighlights = [...highlights];
    updatedHighlights.splice(index, 1);
    setHighlights(updatedHighlights);
  };
  const addKeyword = () => {
    if (keyword.trim() !== "") {
      setKeywords([...keywords, keyword]);
      setKeyword("");
    }
  };
  const removeKeyword = (index) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };

  const handleEditorChange = (value) => {
    setEditorState(value);
    setFormattedDescription(value);
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          const product = { ...data };
          product.images = combinedImages;
          product.description = formattedDescription;
          product.thumbnail = imageUrl;
          product.rating = 0;
          product.price = +product.price;
          product.subCategory = selectedSubCategories.map((sub) => sub);
          product.colors = colors;
          product.stock = +product.stock;
          product.highlights = highlights;
          product.keywords = keywords;
          product.discountPercentage = +product.discountPercentage;

          if (params.id) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAsync(product));
            alert.success("Product Updated");
            setCombinedImages([]);
            setImageUrl("");
            navigate("/admin");
            reset();
          } else {
            dispatch(createProductAsync(product));
            alert.success("Product Created");
            navigate("/admin");
            reset();
            setCombinedImages([]);
            setImageUrl("");
          }
        })}
      >
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              {selectedProduct
                ? `Edit Product ${selectedProduct.title}`
                : `Add Product`}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {selectedProduct && selectedProduct.deleted && (
                <h2 className="text-red-500 sm:col-span-6">
                  This product is deleted
                </h2>
              )}
              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-800 px-2 ">
                    <input
                      type="text"
                      {...register("title", {
                        required: "name is required",
                      })}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <ReactQuill
                    value={editorState}
                    onChange={handleEditorChange}
                    theme="snow"
                    className="rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about the product.
                </p>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2">
                  <select
                    {...register("brand", {
                      required: "brand is required",
                    })}
                  >
                    <option value="">--choose brand--</option>
                    {brands.map((brand) => (
                      <option value={brand.value} key={brands.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    {...register("category", {
                      required: "category is required",
                    })}
                    onChange={(e) => setParentCategory(e.target.value)}
                  >
                    <option value="">--choose category--</option>
                    {categories.map((cat) => (
                      <option value={cat.value} key={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className={`col-span-full ${
                  subCategories.some(
                    (sub) => sub.parentCategory === parentCategory
                  )
                    ? ""
                    : "hidden"
                }`}
              >
                <label
                  htmlFor="subCategory"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sub Category
                </label>
                {selectedSubCategories.length > 0 && (
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-800 px-2 mt-4">
                    <input
                      type="text"
                      placeholder="Title for subcategory"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      {...register("subTitle", {
                        required: "SubCategory Title is required",
                      })}
                    />
                  </div>
                )}

                <div className="mt-2 flex gap-2">
                  {subCategories
                    .filter((sub) => sub.parentCategory === parentCategory)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className={`flex items-center cursor-pointer px-12 py-3 text-1xl rounded-lg border border-gray-400 uppercase justify-center duration-300 transition`}
                        style={
                          selectedSubCategories.some(
                            (subCategory) => subCategory.id === sub.id
                          )
                            ? {
                                boxShadow:
                                  "inset 0 0 15px #1D4ED8, 0 3px 5px #1D4ED8",
                                textShadow: "0 0 0.15em #1da9cc",
                              }
                            : {} // Empty object for no styles
                        }
                        onClick={() => handleCheckboxClick(sub)}
                      >
                        {sub.label}
                      </div>
                    ))}
                </div>
              </div>
              <div className="my-4 col-span-full">
                <button
                  className="bg-blue-800 text-white px-3 py-1 rounded mr-2"
                  onClick={handleAddColor}
                  type="button"
                >
                  Add Color
                </button>
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center w-full gap-2">
                    <input
                      type="color"
                      value={color ? color : "#054bd6"}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      id="colorStyle"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => handleRemoveColor(index)}
                      type="button"
                      className=" bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="col-span-full">
                {thumbnailLoading && (
                  <div className="w-28 h-28 flex items-center justify-center">
                    <BounceLoader color="#4F46E5" />
                  </div>
                )}
                <input
                  type="file"
                  id="thumbnail"
                  onChange={uploadThumbnail}
                  accept="image/*"
                  hidden
                />
                {/* {errors.images && <p className="text-red-500">{errors.images.message}</p>} */}
                {!thumbnailLoading && fileUploader && (
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer ">
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center text-center justify-center rounded-lg bg-gray-300 cursor-pointer gap-2 w-full h-full p-4"
                    >
                      <LuUpload className="w-6 h-6" />
                      Upload thumbnail
                    </label>
                  </div>
                )}
                {imageUrl && (
                  <div
                    className="h-28 w-28 relative"
                    onMouseEnter={handleMouseEnterThumbnail}
                    onMouseLeave={handleMouseLeaveThumbnail}
                  >
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="h-full w-full object-cover transition duration-300 ease-in-out rounded-lg"
                    />
                    <div
                      className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <MdDelete
                        className="text-red-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={handleDeleteThumbnail}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-800 px-2 ">
                    <input
                      type="number"
                      {...register("price", {
                        required: "price is required",
                        min: 1,
                        max: 10000,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-800 px-2 ">
                    <input
                      type="number"
                      {...register("discountPercentage", {
                        required: "discountPercentage is required",
                        min: 0,
                        max: 100,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-800 px-2 ">
                    <input
                      type="number"
                      {...register("stock", {
                        required: "stock is required",
                        min: 0,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-full">
                <div className="mt-2 flex gap-2 flex-wrap">
                  <ReactSortable
                    list={combinedImages}
                    setList={updateImagesOrder}
                    className="flex gap-2 flex-wrap"
                  >
                    {!!combinedImages.length &&
                      combinedImages.map((image, index) => {
                        return (
                          <div
                            className="h-28 relative !cursor-pointer"
                            key={index}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
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
              <div className="mt-8 p-4 border border-gray-300 rounded-md col-span-full">
                {highlights.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Highlights:</h2>
                    <ul>
                      {highlights.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="mr-2">{item}</span>
                          <button
                            onClick={() => removeHighlight(index)}
                            className="text-red-500 hover:text-red-600 focus:outline-none"
                            type="button"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Enter a highlight"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-900 transition duration-300"
                >
                  Add Highlight
                </button>
              </div>
              <div className="col-span-full flex flex-col gap-4 items-start transition duration-300">
                <h2 className="text-lg font-semibold mb-2">Keywords:</h2>
                {keywords.length > 0 && (
                  <div>
                    <ul className="flex flex-wrap gap-2">
                      {keywords.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center bg-gray-100 p-2 rounded"
                        >
                          <span className="mr-2">{item}</span>
                          <button
                            onClick={() => removeKeyword(index)}
                            className="text-red-500 hover:text-red-700"
                            type="button"
                          >
                            <FaTimes />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter a keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 w-72 px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    disabled={keywords.includes(keyword)}
                    className={`bg-green-500 text-white py-2 rounded-r-full hover:bg-green-600 transition duration-300 px-4 ${
                      keywords.includes(keyword)
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Add Keyword
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Extra{" "}
          </h2>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                By Email
              </legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-900"
                    >
                      Comments
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-gray-900"
                    >
                      Candidates
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-900"
                    >
                      Offers
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        {/* </div> */}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            to={"/admin"}
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancel}
          >
            Cancel
          </Link>

          {selectedProduct && !selectedProduct.deleted && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(true);
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Delete
            </button>
          )}
          {selectedProduct && selectedProduct.deleted && (
            <button
              onClick={handleRestore}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Restore
            </button>
          )}

          <button
            type="submit"
            className="rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            Save
          </button>
        </div>
      </form>

      {selectedProduct && !selectedProduct.deleted && (
        <Modal
          title={`Delete ${selectedProduct.title}`}
          message="Are you sure you want to delete this Product ?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleDelete}
          cancelAction={() => setOpenModal(null)}
          showModal={openModal}
        ></Modal>
      )}
    </>
  );
}

export default ProductForm;
