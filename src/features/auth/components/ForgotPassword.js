import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequestAsync, selectMailSent } from "../authSlice";
import { useEffect, useState } from "react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const mailSent = useSelector(selectMailSent);
  const [loading, setLoading] = useState(false);
  
 useEffect(() => {
   if (mailSent) {
     setLoading(false);
   }
 }, [mailSent]);

  return (
    <>
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
              dispatch(resetPasswordRequestAsync(data));
              setLoading(true);
            })}
            className="space-y-6"
          >
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
                {mailSent && <p className="text-green-500"> mail sent</p>}
              </div>
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
                {loading ? "Sending..." : "Send mail"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Send me back to{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-blue-800 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
