import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { resetCartAsync } from "../features/cart/cartSlice";
import { resetOrder } from "../features/order/orderSlice";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

function OrderSuccessPage() {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // reset cart
    dispatch(resetCartAsync());
    // reset currentOrder
    dispatch(resetOrder());
  }, [dispatch]);

  return (
    <>
      {!params.id && <Navigate to="/" replace={true}></Navigate>}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500 border-[5px] border-green-500 rounded-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <p className="text-base font-semibold text-blue-800">
            Order Successfully Placed
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Order Number #{params?.id}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            You can check your order in My Account &gt; My Orders
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Go back home
            </Link>
            <Link
              to="/orders"
              className="rounded-md bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Check Your Order
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderSuccessPage;
