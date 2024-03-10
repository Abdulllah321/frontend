import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import { MdDelete } from "react-icons/md";
import { BounceLoader } from "react-spinners";
import { LuUpload } from "react-icons/lu";
import { ReactSortable } from "react-sortablejs";
import { uploadCloudinary } from "../../../upload";
import { useDispatch, useSelector } from "react-redux";
import {
  createSlideAsync,
  deleteSlideAsync,
  fetchSlidesAsync,
  selectSlides,
} from "../../product/productSlice";

export default function AdminSliders() {
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState();
  const dispatch = useDispatch();
  const slides = useSelector(selectSlides);
  const [imagesUrl, setImagesUrl] = useState([]);

  useEffect(() => {
    dispatch(fetchSlidesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (slides.length > 0) {
      const fetchedImages = slides.map((slide) => slide.image);
      setImagesUrl(fetchedImages);
    }
  }, [slides]);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
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

        const updatedImages = tempArr.map((data) => data.url);
        setImagesUrl((prevImages) => [...prevImages, ...updatedImages]);
        setLoading(false);

        const urlsToSave = tempArr.map((data) => data.url);
        dispatch(createSlideAsync({ images: urlsToSave }));
      } catch (error) {
        alert.error(`Error uploading images: ${error.message}`);
        setLoading(false);
      }
    } else {
      alert.error("No images selected. Please try again.");
    }
  }

  const updateImagesOrder = (newOrder) => {
    setImagesUrl([...newOrder]);
  };

  const handleDeleteImage = async (index) => {
    try {
      const deletedSlideId = slides[index].id;
      await dispatch(deleteSlideAsync(deletedSlideId));

      // Remove the deleted image from imagesUrl array
      const updatedImagesUrl = [...imagesUrl];
      updatedImagesUrl.splice(index, 1);
      setImagesUrl(updatedImagesUrl);
    } catch (error) {
      alert.error(`Error deleting image: ${error.message}`);
    }
  };

  return (
    <Navbar>
      <div className="bg-white p-4">
        <div className="mt-2 flex gap-2 flex-wrap">
          <ReactSortable
            list={imagesUrl}
            setList={updateImagesOrder}
            className="flex gap-2 flex-wrap"
          >
            {!!imagesUrl.length &&
              imagesUrl.map((image, index) => {
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
                        hoveredIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <MdDelete
                        className="text-red-500 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
                        onClick={() => handleDeleteImage(index)}
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
        </div>
      </div>
    </Navbar>
  );
}
