import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrandAsync,
  createCategoryAsync,
  createSubCategoryAsync,
  deleteBrandAsync,
  deleteCategoryAsync,
  deleteSubCategoryAsync,
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchSubCategoriesAsync,
  selectBrands,
  selectCategories,
  selectSubCategories,
  updateBrandAsync,
  updateCategoryAsync,
  updateSubCategoryAsync,
} from "../features/product/productSlice";
import { BiSolidEdit } from "react-icons/bi";
import {
  MdArrowDropDown,
  MdArrowForward,
  MdArrowRight,
  MdDelete,
} from "react-icons/md";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";
import { motion } from "framer-motion";
import { useAlert } from "react-alert";
import Modal from "../features/common/Modal";
import { uploadCloudinary } from "../upload";
import { LuUpload } from "react-icons/lu";
import { BounceLoader } from "react-spinners";
import { mainCategory as parentCategories } from "../features/common/MainCategories";

export default function CategoryBrand() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
    dispatch(fetchSubCategoriesAsync());
  }, [dispatch]);

  return (
    <>
      <NavBar>
  
        <div className="py-6 px-4 md:flex flex-col md:flex-row">
          <Categories />
          <Brands />
        </div>
      </NavBar>
      <Footer />
    </>
  );
}

const Categories = () => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editSubIndex, setEditSubIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState("");
  const [editedSubCategory, setEditedSubCategory] = useState("");
  const [form, setForm] = useState(false);
  const [subForm, setSubForm] = useState(false);
  const [category, setCategory] = useState("");
  const [parent, setParent] = useState("");
  const [parentEdit, setParentEdit] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [openModal, setOpenModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubcategories, setShowSubcategories] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUploader, setFileUploader] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const alert = useAlert();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);

  const SameLabel = [...categories].map((cat) => cat.label);
  const isDuplicate = SameLabel.includes(editedCategory);

  const isSubDuplicate = subCategories
    .filter((sub) => sub.parentCategory === parent)
    .some((sub) => sub.label === subCategory);

  const handleCategoryDelete = async (e, cat) => {
    try {
      // Find subcategories associated with the main category
      const associatedSubcategories = subCategories.filter(
        (sub) => sub.parentCategory === cat.value
      );

      // Delete the associated subcategories
      for (const sub of associatedSubcategories) {
        await dispatch(deleteSubCategoryAsync(sub.id));
      }

      // Delete the main category
      await dispatch(deleteCategoryAsync(cat.id));
      alert.success(`Category Successfully Deleted`);
    } catch (error) {
      alert.error("Failed to Delete: " + error);
    }
  };

  const handleSubCategoryDelete = async (e, sub) => {
    try {
      await dispatch(deleteSubCategoryAsync(sub.id));
      alert.success(`${sub.label} Successfully Deleted`);
    } catch (error) {
      alert.error("Failed to Delete: " + error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const categoryData = {
      value: category.replace(/\s/g, "-"), // Replace spaces with hyphens
      label: category,
      image: imageUrl,
      mainCategory: selectedMainCategory,
    };

    if (imageUrl === "") {
      alert.error("Image is required");
    }
    if (selectedMainCategory) {
      alert.error("Please select a main category");
    }
    if (!category) {
      alert.error("Category cannot be empty");
    }
    try {
      const result = await dispatch(createCategoryAsync(categoryData));
      if (isDuplicate) {
        alert.error("Categories cannot be the same");
      } else if (result.payload.error) {
        alert.error("Error creating category: " + result.error.message);
      } else {
        setForm(false);
        setCategory("");
        setImageUrl("");
        setSelectedMainCategory("");
        setFileUploader(true);
        alert.success("Category created successfully!");
      }
    } catch (error) {
      alert.error("Some errors occurred" + error);
    }
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    const subCategoryData = {
      parentCategory: parent,
      value: subCategory.replace(/\s/g, "-"), // Replace spaces with hyphens
      label: subCategory,
    };
    try {
      // Check if the subcategory label is already used in the same parent category
      if (!subCategory) {
        alert.error("subCategory cannot be empty");
        return;
      }
      if (!parent) {
        alert.error("please select a parent category");
        return;
      }
      if (isSubDuplicate) {
        alert.error(
          "Subcategories cannot have the same name within the same parent category"
        );
        return;
      } else {
        setSubForm(false);
        setSubCategory("");
        setParent("");
        dispatch(createSubCategoryAsync(subCategoryData));
        alert.success("Subcategory created successfully!");
      }
    } catch (error) {
      alert.error("Some errors occurred" + error);
    }
  };

  const handleCategoryEdit = (cat, index) => {
    setEditIndex(index);
    setEditedCategory(cat.label);

    if (cat.image) {
      setImageUrl(cat.image);
      setFileUploader(false);
    } else {
      setImageUrl("");
      setFileUploader(true)
    }

    if (cat.mainCategory && cat.mainCategory.length >=1) {
      setSelectedMainCategory(cat.mainCategory[0]);
    } else {
      setSelectedMainCategory([])
    }
  };

  const handleCategoryUpdate = async (e, cat) => {
    try {
      const updatedCategory = {
        id: cat.id,
        value: editedCategory.replace(/\s/g, "-"), // Replace spaces with hyphens
        label: editedCategory,
        image: imageUrl,
        mainCategory: selectedMainCategory,
      };

      if (imageUrl === "") {
        alert.error("Image is required");
      }
      if (selectedMainCategory === "") {
        alert.error("Please select a main category");
      }
      if (editedCategory === "") {
        alert.error("Category cannot be empty");
        return;
      }
      const result = await dispatch(updateCategoryAsync(updatedCategory));
      if (result.payload.error) {
        alert.error("Error uploading category: " + result.error.message);
      } else {
        alert.success("Category Successfully Updated");
        setEditIndex(-1);
        setEditedCategory("");
        setImageUrl("");
        setFileUploader(true);
        setSelectedMainCategory("");
      }
    } catch (error) {
      alert.error("Failed to update" + error);
    }
  };

  const handleSubCategoryUpdate = async (e, sub) => {
    try {
      const updatedSubCategory = {
        id: sub.id,
        value: editedSubCategory.replace(/\s/g, "-"), // Replace spaces with hyphens
        label: editedSubCategory,
        parentCategory: parentEdit,
      };
      if (!parentEdit) {
        alert.error("parentCategory is required");
        return;
      }
      if (!editedSubCategory) {
        alert.error("Sub Category cannot be empty");
        return;
      }
      if (isSubDuplicate) {
        alert.error(
          "Subcategories cannot have the same name within the same parent category"
        );
        return;
      } else {
        dispatch(updateSubCategoryAsync(updatedSubCategory));
        alert.success("SubCategory Successfully Updated");
        setEditSubIndex(-1);
        setEditedSubCategory("");
        setParentEdit("");
      }
      if (isSubDuplicate) {
        alert.error("Categories cannot be the same");
      } else {
      }
    } catch (error) {
      alert.error("Failed to update" + error);
    }
  };

  const filteredCategories =
    categories &&
    categories?.filter((cat) =>
      cat?.label?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const highlightSearchResult = (text, query) => {
    if (!query.trim()) {
      return <span className="text-black">{text}</span>;
    }

    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-blue-700 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  async function uploadCategories(e) {
    const image = e.target.files[0];

    if (image) {
      e.preventDefault();
      setCategoriesLoading(true);

      try {
        const data = await uploadCloudinary(image);
        setCategoriesLoading(false);
        setImageUrl(data.url);
        setFileUploader(false);
      } catch (error) {
        alert.error(`Error uploading image: ${error.message}`);
        setCategoriesLoading(false);
      }
    } else {
      alert.error("No image selected. Please try again.");
    }
  }

  const handleMainCategory = (e) => {
    const foundedMainCategory = parentCategories.find(
      (parent) => parent.value === e.target.value
    );
    setSelectedMainCategory(foundedMainCategory);
  };

  const handleDeleteImage = () => {
    setImageUrl("");
    setFileUploader(true);
  };

  return (
    <>
      {/* main categories */}
      <div className="md:w-1/2 w-full mr-4 overflow-auto p-2">
        <div className="flex justify-between">
          {!form && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.9 }}
              className="flex gap-1 items-center bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 mb-4"
              onClick={() => setForm(true)}
            >
              Create Category
            </motion.button>
          )}
          {!subForm && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.9 }}
              className="flex gap-1 items-center bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 mb-4"
              onClick={() => setSubForm(true)}
            >
              Create Sub Category
            </motion.button>
          )}
        </div>
        {form && (
          <motion.form
            className="origin-left w-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Categories"
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 px-2 py-[0.40rem] rounded-md focus:outline-none focus:border-blue-700 w-3/4"
              />

              <select
                onChange={(e) => handleMainCategory(e)}
                className="rounded-md"
                defaultValue={""}
              >
                <option value="" disabled>
                  select a main category
                </option>
                {parentCategories.map((mainCategory) => (
                  <option value={mainCategory.value}>
                    {mainCategory.title}
                  </option>
                ))}
              </select>
            </div>

            {categoriesLoading && (
              <div className="w-28 h-28 flex items-center justify-center">
                <BounceLoader color="#4F46E5" />
              </div>
            )}
            <input
              type="file"
              id="categories"
              onChange={uploadCategories}
              accept="image/*"
              hidden
            />

            <div className="mt-2">
              {!categoriesLoading && fileUploader && (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer ">
                  <label
                    htmlFor="categories"
                    className="flex flex-col items-center text-center justify-center rounded-lg bg-gray-300 cursor-pointer gap-2 w-full h-full p-4"
                  >
                    <LuUpload className="w-6 h-6" />
                    Upload Image
                  </label>
                </div>
              )}

              {imageUrl && (
                <div
                  className="h-28 w-28 relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="h-full w-full object-cover transition duration-300 ease-in-out rounded-lg group:"
                  />
                  <div
                    className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 rounded-md ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <MdDelete
                      className="text-red-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={handleDeleteImage}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 w-full my-2">
              <button
                type="button"
                onClick={() => setForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300 w-1/4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 w-3/4"
              >
                Create Category
              </button>
            </div>
          </motion.form>
        )}
        {subForm && (
          <motion.form
            className="space-x-2 my-4 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          >
            <div className="flex justify-between items-center space-x-2 px-2">
              <select
                onChange={(e) => setParent(e.target.value)}
                className="rounded-lg"
              >
                <option>select category</option>
                {categories.map((cat) => (
                  <option value={cat.value} key={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Sub Categories"
                onChange={(e) => setSubCategory(e.target.value)}
                className="border border-gray-300 px-2 py-2 rounded-md focus:outline-none focus:border-blue-700 w-full"
              />
            </div>
            <div className="flex justify-between items-center space-x-2 mt-2 pr-2">
              <button
                type="button"
                onClick={handleCreateSubCategory}
                className="bg-blue-700 text-white px-3 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 w-3/4"
              >
                Create Sub Category
              </button>
              <button
                type="button"
                onClick={() => setSubForm(false)}
                className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300 w-1/4"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
        <div className="flex w-full mb-4 px-2">
          <input
            type="text"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-blue-700 text-black font-bold py-2 px-4 rounded-r-none rounded-l-md focus:outline-none focus:shadow-outline w-full"
          />
          <button
            className="bg-blue-700 text-white font-bold py-2 px-4 rounded-l-none rounded-r-md focus:outline-none focus:shadow-outline"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        </div>

        {filteredCategories.length === 0 ? (
          <p className="text-gray-500 mt-4">No result found.</p>
        ) : (
          <table
            className="w-full border-collapse border border-gray-300 bg-white p-4"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          >
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 py-2 px-4">
                  Category Name
                </th>
                <th className="border border-gray-300 py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-100 transition-all duration-300">
                    <td className="border border-gray-300 py-2 px-4 transition-all duration-300">
                      <div className="flex items-center">
                        {subCategories.some(
                          (sub) => sub.parentCategory === cat.value
                        ) && (
                          <span
                            className="cursor-pointer flex items-center"
                            onClick={() => {
                              setShowSubcategories((prev) => ({
                                ...prev,
                                [cat.value]: !prev[cat.value],
                              }));
                            }}
                          >
                            {cat.image && (
                              <img
                                src={cat?.image ? cat.image : null}
                                alt={cat.label}
                                className="w-8 h-8 rounded-md"
                              />
                            )}
                            <span
                              className={`duration-300 transition-all ${
                                showSubcategories[cat.value]
                                  ? "rotate-90"
                                  : "rotate-0"
                              }`}
                            >
                              <MdArrowRight className="text-2xl text-blue-500 " />
                            </span>
                            {highlightSearchResult(cat.label, searchQuery)}
                          </span>
                        )}
                        {!subCategories.some(
                          (sub) => sub.parentCategory === cat.value
                        ) && (
                          <div className="flex gap-2 items-center">
                            {cat.image && (
                              <img
                                src={cat?.image ? cat.image : null}
                                alt={cat.label}
                                className="w-8 h-8 rounded-md"
                              />
                            )}
                            {highlightSearchResult(cat.label, searchQuery)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="border border-gray-300 py-2 px-4 flex gap-2 justify-end">
                      <button
                        className="flex gap-1 items-center bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 transition-colors duration-300"
                        onClick={() => handleCategoryEdit(cat, index)}
                      >
                        <BiSolidEdit />
                        Edit
                      </button>
                      <button
                        className="flex gap-1 items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                        onClick={() => setOpenModal(cat.id)}
                      >
                        <MdDelete />
                        Delete
                      </button>
                    </td>
                    <td>
                      <Modal
                        title={`Delete Category ${cat.label}`}
                        message={` Warning: Deleting ${cat.label} will also delete the following subcategories`}
                        dangerOption="Delete"
                        cancelOption="Cancel"
                        dangerAction={(e) => {
                          handleCategoryDelete(e, cat);
                        }}
                        cancelAction={() => setOpenModal(null)}
                        showModal={openModal === cat.id}
                      />
                    </td>
                  </tr>

                  {editIndex === index && (
                    <tr key={`edit-${index}`}>
                      <td colSpan="2">
                        <motion.form
                          className="origin-top w-full px-2 my-2"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Edit Category"
                              value={editedCategory}
                              onChange={(e) =>
                                setEditedCategory(e.target.value)
                              }
                              className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:border-blue-700 w-1/2"
                            />

                            <select
                              value={selectedMainCategory.value}
                              onChange={(e) => handleMainCategory(e)}
                              className="rounded-md w-1/2"
                            >
                              <option value="">select a main category</option>
                              {parentCategories.map((mainCategory) => (
                                <option
                                  value={mainCategory.value}
                                  key={mainCategory.value}
                                >
                                  {mainCategory.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {categoriesLoading && (
                            <div className="w-28 h-28 flex items-center justify-center">
                              <BounceLoader color="#4F46E5" />
                            </div>
                          )}
                          <input
                            type="file"
                            id="categories"
                            onChange={uploadCategories}
                            accept="image/*"
                            hidden
                          />

                          <div className="mt-2">
                            {!categoriesLoading && fileUploader && (
                              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer ">
                                <label
                                  htmlFor="categories"
                                  className="flex flex-col items-center text-center justify-center rounded-lg bg-gray-300 cursor-pointer gap-2 w-full h-full p-4"
                                >
                                  <LuUpload className="w-6 h-6" />
                                  Upload Image
                                </label>
                              </div>
                            )}

                            {imageUrl && (
                              <div
                                className="h-28 w-28 relative"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                              >
                                <img
                                  src={imageUrl}
                                  alt="Uploaded"
                                  className="h-full w-full object-cover transition duration-300 ease-in-out rounded-lg group:"
                                />
                                <div
                                  className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 rounded-md ${
                                    isHovered ? "opacity-100" : "opacity-0"
                                  }`}
                                >
                                  <MdDelete
                                    className="text-red-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={handleDeleteImage}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 w-full my-2">
                            <button
                              type="button"
                              onClick={(e) => handleCategoryUpdate(e, cat)}
                              className="bg-blue-700 text-white px-3 py-[0.35rem] rounded-md hover:bg-blue-800 transition-colors duration-300 text-center w-3/4"
                            >
                              Update Category
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditIndex(-1)}
                              className="bg-gray-300 text-gray-700 px-3 py-[0.35rem] rounded-md hover:bg-gray-400 transition-colors duration-300 w-1/4"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      </td>
                    </tr>
                  )}

                  {showSubcategories[cat.value] &&
                    subCategories
                      .filter((sub) => sub.parentCategory === cat.value)
                      .map((sub, subIndex) => (
                        <>
                          <motion.tr
                            key={`sub-${subIndex}`}
                            className="bg-gray-200 w-full origin-top"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                          >
                            <td className="border border-gray-300 py-2 px-4 pl-16">
                              <div className="flex items-center">
                                <i>
                                  {highlightSearchResult(
                                    sub.label,
                                    searchQuery
                                  )}
                                </i>
                              </div>
                            </td>

                            <td className="border border-gray-300 py-2 px-4 flex gap-2 justify-end">
                              <button
                                className="flex gap-1 items-center bg-blue-700 text-white px-2 py-1 rounded-md hover:bg-blue-800 transition-colors duration-300"
                                onClick={() => {
                                  setEditSubIndex(sub.id);
                                  setEditedSubCategory(sub.label);
                                  setParentEdit(sub.parentCategory);
                                }}
                              >
                                <BiSolidEdit />
                                Edit
                              </button>
                              <button
                                className="flex gap-1 items-center bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                                onClick={() => setOpenModal(sub.id)}
                              >
                                <MdDelete />
                                Delete
                              </button>
                              <Modal
                                title={`Delete Category ${sub.label}`}
                                message="Are you sure you want to remove this Category?"
                                dangerOption="Delete"
                                cancelOption="Cancel"
                                dangerAction={(e) => {
                                  handleSubCategoryDelete(e, sub);
                                }}
                                cancelAction={() => setOpenModal(null)}
                                showModal={openModal === sub.id}
                              />
                            </td>
                          </motion.tr>{" "}
                          {editSubIndex === sub.id && (
                            <tr key={`edit-${index}`}>
                              <td colSpan="2">
                                <motion.form
                                  className="space-x-2 my-4 origin-left"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  exit={{ scaleX: 0 }}
                                >
                                  <div className="flex justify-between items-center gap-2 px-2">
                                    <select
                                      onChange={(e) =>
                                        setParentEdit(e.target.value)
                                      }
                                      className="rounded-lg"
                                      defaultValue={parentEdit}
                                    >
                                      <option>select category</option>
                                      {categories.map((cat) => (
                                        <option value={cat.value} key={cat.id}>
                                          {cat.label}
                                        </option>
                                      ))}
                                    </select>

                                    <input
                                      type="text"
                                      placeholder="Sub Categories"
                                      value={editedSubCategory}
                                      onChange={(e) =>
                                        setEditedSubCategory(e.target.value)
                                      }
                                      className="border border-gray-300 px-2 py-2 rounded-md focus:outline-none focus:border-blue-700 w-full"
                                    />
                                  </div>
                                  <div className="flex justify-between items-center gap-2 mt-2 pr-2">
                                    <button
                                      type="button"
                                      onClick={(e) =>
                                        handleSubCategoryUpdate(e, sub)
                                      }
                                      className="bg-blue-700 text-white px-3 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 w-3/4 "
                                    >
                                      Update Sub Category
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditSubIndex(false);
                                        setEditedSubCategory("");
                                      }}
                                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300 w-1/4"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </motion.form>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const Brands = () => {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedBrand, setEditedBrand] = useState("");
  const [form, setForm] = useState(false);
  const [brand, setBrand] = useState("");
  const [openModal, setOpenModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);

  const SameLabel = [...brands].map((brand) => brand.label);
  const isDuplicate = SameLabel.includes(editedBrand);

  const handleBrandDelete = async (e, id) => {
    try {
      await dispatch(deleteBrandAsync(id));
      alert.success(`Brand Successfully Deleted`);
    } catch (error) {
      alert.error("Failed to Delete: " + error);
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    const brandData = {
      value: brand.replace(/\s/g, "-"), // Replace spaces with hyphens
      label: brand,
    };

    try {
      if (isDuplicate) {
        alert.error("Brands cannot be the same");
      } else {
        setForm(false);
        setBrand("");
        dispatch(createBrandAsync(brandData));
        alert.success("Brand created successfully!");
      }
    } catch (error) {
      alert.error("Some errors occurred" + error);
    }
  };

  const handleBrandEdit = (brand, index) => {
    setEditIndex(index);
    setBrand(brand.label);
  };

  const handleBrandUpdate = async (e, brand) => {
    try {
      const updatedBrand = {
        id: brand.id,
        value: editedBrand.replace(/\s/g, "-"), // Replace spaces with hyphens
        label: editedBrand,
      };

      if (isDuplicate) {
        alert.error("Brands cannot be the same");
      } else {
        dispatch(updateBrandAsync(updatedBrand));
        alert.success("Brand Successfully Updated");
        setEditIndex(-1);
        setEditedBrand("");
      }
    } catch (error) {
      alert.error("Failed to update" + error);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightSearchResult = (text, query) => {
    if (!query.trim()) {
      return <span className="text-black">{text}</span>;
    }

    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-blue-700 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="md:w-1/2 w-full mr-4 overflow-auto p-2">
      <div className="flex justify-between">
        {!form && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.9 }}
            className="flex gap-1 items-center bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 mb-4"
            onClick={() => setForm(true)}
          >
            Create Brand
          </motion.button>
        )}
      </div>
      {form && (
        <motion.form
          className="flex items-center space-x-2 my-4 origin-left w-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        >
          <input
            type="text"
            placeholder="Brands"
            onChange={(e) => setBrand(e.target.value)}
            className="border border-gray-300 px-2 py-2 rounded-md focus:outline-none focus:border-blue-700 w-1/2"
          />
          <div className="w-1/2 flex space-x-2">
            <button
              type="button"
              onClick={handleCreateBrand}
              className="bg-blue-700 text-white px-3 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300 w-3/4"
            >
              Create Brand
            </button>
            <button
              type="button"
              onClick={() => setForm(false)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300 w-1/4"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search Brands"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-blue-700 text-black font-bold py-2 px-4 rounded-r-none rounded-l-md focus:outline-none focus:shadow-outline w-full "
        />
        <button
          className="bg-blue-700 text-white font-bold py-2 px-4 rounded-l-none rounded-r-md focus:outline-none focus:shadow-outline"
          onClick={() => setSearchQuery("")}
        >
          Clear
        </button>
      </div>

      {filteredBrands.length === 0 ? (
        <p className="text-gray-500 mt-4">No result found.</p>
      ) : (
        <table
          className="w-full border-collapse border border-gray-300 p-4 bg-white"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 py-2 px-4">Brand Name</th>
              <th className="border border-gray-300 py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand, index) => (
              <React.Fragment key={index}>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 py-2 px-4">
                    {highlightSearchResult(brand.label, searchQuery)}
                  </td>

                  <td className="border border-gray-300 py-2 px-4 flex gap-2 justify-end">
                    <button
                      className="flex gap-1 items-center bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 transition-colors duration-300"
                      onClick={() => handleBrandEdit(brand, index)}
                    >
                      <BiSolidEdit />
                      Edit
                    </button>
                    <button
                      className="flex gap-1 items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                      onClick={() => setOpenModal(brand.id)}
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </td>
                  <td>
                    <Modal
                      title={`Delete Brand ${brand.label}`}
                      message="Are you sure you want to remove this Brand?"
                      dangerOption="Delete"
                      cancelOption="Cancel"
                      dangerAction={(e) => {
                        handleBrandDelete(e, brand.id);
                      }}
                      cancelAction={() => setOpenModal(null)}
                      showModal={openModal === brand.id}
                    />
                  </td>
                </tr>

                {editIndex === index && (
                  <tr key={`edit-${index}`}>
                    <td colSpan="2">
                      <motion.form
                        className="flex items-center space-x-2 my-2 origin-top"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                      >
                        <input
                          type="text"
                          value={editedBrand || brand.label}
                          onChange={(e) => setEditedBrand(e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:border-blue-700"
                        />
                        <button
                          type="button"
                          onClick={(e) => handleBrandUpdate(e, brand)}
                          className="bg-blue-700 text-white px-3 py-1 rounded-md hover:bg-blue-800 transition-colors duration-300"
                        >
                          Update Brand
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditIndex(-1)}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </motion.form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
