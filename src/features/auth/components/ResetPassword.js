import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordAsync, selectPasswordReset } from "../authSlice";
import PageNotFound from "../../../pages/404";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const passwordReset = useSelector(selectPasswordReset);
  const query = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(false);
  const token = query.get("token");
  const email = query.get("email");
  
  useEffect(() => {
    if (passwordReset) {
      setLoading(false);
    }
  }, [passwordReset]);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      {email && token ? (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Enter email to reset password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              noValidate
              onSubmit={handleSubmit((data) => {
                dispatch(
                  resetPasswordAsync({ token, email, password: data.password })
                );
                setLoading(true);
              })}
              className="space-y-6"
            >
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
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                        message: `- At least 8 characters\n
                      - Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
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
                      required: "Confirm password is required",
                      validate: (value, formValues) =>
                        value === formValues.password ||
                        "Password not matching",
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
                {passwordReset && (
                  <p className="text-green-500">Password successfully reset.</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-md ${
                    loading ? "bg-blue-800/50" : "bg-blue-800"
                  } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                    loading ? "" : "hover:bg-blue-700 "
                  }focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800`}
                  disabled={loading} // Fixed syntax here
                >
                  {loading ? "resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <PageNotFound />
      )}
    </>
  );
}
