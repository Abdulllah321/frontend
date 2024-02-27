import { useSelector, useDispatch } from "react-redux";
import {
  selectError,
  selectLoggedInUser,
  clearError,
  selectAuthStatus,
} from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { loginUserAsync } from "../authSlice";
import { useForm } from "react-hook-form";
import Logo from "../../../images/logoBlue.jpg";

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const status = useSelector(selectAuthStatus);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div className="flex min-h-max flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="bg-white w-[400px] p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md" style={{
          boxShadow:" rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        }}>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
            <img
              className="h-20 w-20 object-cover ml-2 rounded-full"
              src={Logo}
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Log in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              noValidate
              onSubmit={handleSubmit((data) => {
                try {
                  dispatch(
                    loginUserAsync({
                      email: data.email,
                      password: data.password,
                    })
                  );
                } catch (err) {
                  console.error(err);
                }
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
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-blue-800 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    {...register("password", {
                      required: "password is required",
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
                {error && (
                  <p className="text-red-500">{error || error.message}</p>
                )}{" "}
              </div>

              <div>
                <button
                  type="submit"
                  className={`flex w-full justify-center rounded-md ${
                    status === "loading"
                      ? "bg-blue-800/50"
                      : "bg-custom-gradient"
                  } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                    status === "loading" ? "" : "hover:bg-blue-700 "
                  }focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800`}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Loading..." : "Log in"}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                to="/signup"
                className="font-semibold leading-6 text-blue-800 hover:text-blue-700"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* <GoogleLogin
        onSuccess={(credentialResponse) => {
          let credentialResponseDecode = jwtDecode(credentialResponse.credential);
          console.log(credentialResponseDecode);
        }}
        onError={(err) => console.log(err + "login failed")}
      /> */}
    </>
  );
}
