import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrderAsync,
  selectUserInfoStatus,
  selectUserOrders,
} from "../userSlice";
import { discountedPrice } from "../../../app/constants";
import { Grid } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserInfoStatus);

  useEffect(() => {
    dispatch(fetchLoggedInUserOrderAsync());
  }, [dispatch]);

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-orange-200 text-orange-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-blue-200 text-blue-800";
    }
  };

  return (
    <div>
      {status === "loading" ? (
        <Skeleton height={100} count={3} />
      ) : (
        orders &&
        orders.map((order) => (
          <div key={order.id}>
            <div>
              <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                    Order # {order.id}
                  </h1>
                  <h3
                    className={`text-xl my-5 w-max font-bold tracking-tight ${chooseColor(
                      order.status
                    )} px-4 rounded-lg`}
                  >
                    Order Status : {order.status}
                  </h3>
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href={item.product._id}>
                                    {item.product.title}
                                  </a>
                                </h3>
                                <p className="ml-4">
                                  Rs.{discountedPrice(item.product)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.product.brand}
                              </p>
                            </div>{" "}
                            <div className="flex justify-between text-sm text-gray-500">
                              {item.color && item.color !== "" && (
                                <p className="flex items-center my-1">
                                  Color:{" "}
                                  <div
                                    className="w-5 h-5 rounded-full relative mx-1"
                                    style={{
                                      backgroundColor: item.color,
                                    }}
                                  />
                                  <span
                                    style={{
                                      backgroundColor: `rgba(${parseInt(
                                        item?.color?.slice(1, 3),
                                        16
                                      )}, ${parseInt(
                                        item?.color?.slice(3, 5),
                                        16
                                      )}, ${parseInt(
                                        item?.color?.slice(5, 7),
                                        16
                                      )}, 0.5)`,
                                      padding: "2px",
                                      borderRadius: "5px",
                                      color: item.color,
                                    }}
                                  >
                                    {item.color}
                                  </span>
                                </p>
                              )}
                              {item.subcategory && item.subCategory !== "" && (
                                <p>
                                  {item.product.subTitle}: {item.subCategory}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="text-gray-500">
                                <label
                                  htmlFor="quantity"
                                  className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                >
                                  Qty :{item.quantity}
                                </label>
                              </div>

                              <div className="flex"></div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>$ {order.totalAmount}</p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{order.totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping Address :
                  </p>
                  <div className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200">
                    <div className="flex gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {order.selectedAddress.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {order.selectedAddress.street}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {order.selectedAddress.pinCode}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm leading-6 text-gray-900">
                        Phone: {order.selectedAddress.phone}
                      </p>
                      <p className="text-sm leading-6 text-gray-500">
                        {order.selectedAddress.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      {status === "loading" ? (
        <Grid
          height="80"
          width="80"
          color="blue"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : null}{" "}
    </div>
  );
}
