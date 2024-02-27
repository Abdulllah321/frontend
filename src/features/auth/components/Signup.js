import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { selectLoggedInUser, createUserAsync } from "../authSlice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { uploadCloudinary } from "../../../upload";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import { BounceLoader } from "react-spinners";

export default function Signup() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileUploader, setFileUploader] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  async function uploadImages(e) {
    const image = e.target.files[0];

    if (image) {
      e.preventDefault();
      setLoading(true);

      try {
        const data = await uploadCloudinary(image);
        setLoading(false);
        setImageUrl(data.url);
        setFileUploader(false);
      } catch (error) {
        alert.error(`Error uploading image: ${error.message}`);
        setLoading(false);
      }
    } else {
      alert.error("No image selected. Please try again.");
    }
  }

  const handleDeleteImage = () => {
    setImageUrl("");
    setFileUploader(true);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div
          className="bg-white w-[400px] p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md"
          style={{
            boxShadow:
              " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          }}
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
            <img
              className="h-20 w-20 object-cover ml-2 rounded-full"
              src="https://cdn5.f-cdn.com/contestentries/1822109/49268937/5f68253925225_thumb900.jpg"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create a New Account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              noValidate
              className="space-y-6"
              onSubmit={handleSubmit((data) => {
                dispatch(
                  createUserAsync({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    addresses: [],
                    role: "user",
                    imageUrl: imageUrl,
                  })
                );
                setLoadingButton(true);
              })}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    {...register("name", {
                      required: "name is required",
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:!ring-blue-800 sm:text-sm sm:leading-6"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register("email", {
                      required: "email is required",
                      pattern: {
                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                        message: "email not valid",
                      },
                    })}
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    {...register("password", {
                      required: "password is required",
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                        message: `- at least 8 characters\n
                      - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                      - Can contain special characters`,
                      },
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "confirm password is required",
                      validate: (value, formValues) =>
                        value === formValues.password ||
                        "password not matching",
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              {loading && (
                <div className="w-28 h-28 flex items-center justify-center">
                  <BounceLoader color="#4F46E5" />
                </div>
              )}

              <input
                type="file"
                id="images"
                onChange={uploadImages}
                accept="image/*"
                hidden
              />
              {errors.images && (
                <p className="text-red-500">{errors.images.message}</p>
              )}
              {!loading && fileUploader && (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer ">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center text-center justify-center rounded-lg bg-gray-200 cursor-pointer gap-2 w-full h-full"
                  >
                    <LuUpload className="w-6 h-6" />
                    Upload Profile Image
                  </label>
                </div>
              )}

              {imageUrl && (
                <div
                  className="h-28 w-28 relative rounded-full overflow-hidden"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="h-full w-full object-cover transition duration-300 ease-in-out"
                  />
                  <div
                    className={`w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 opacity-0 transition-opacity duration-300 ${
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

              <div>
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-md ${
                    loadingButton ? "bg-blue-800/50" : "bg-blue-800"
                  } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                    loadingButton ? "" : "hover:bg-blue-700 "
                  }focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800`}
                  disabled={loadingButton}
                >
                  {loadingButton ? "Loading..." : "Signup"}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already a Member?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-blue-800 hover:text-blue-700"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
