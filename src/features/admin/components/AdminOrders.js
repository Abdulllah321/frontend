import React, { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, discountedPrice } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectOrderLoaded,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";
import { updateProductAsync } from "../../product/productSlice";
import { HashLoader } from "react-spinners";

function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const orderLoaded = useSelector(selectOrderLoaded);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("id");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };

  const handleShow = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdate = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    if (e.target.value === "delivered") {
      order.items.forEach(async (item) => {
        const { product, quantity } = item;
        const updatedProduct = {
          ...product,
          stock: product.stock - quantity,
          delivered: product.delivered + quantity,
        };
        await dispatch(updateProductAsync(updatedProduct));
      });
    }
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

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

  const handleFilterByStatus = async (status) => {
    setActiveFilter(status);
    setLoading(true);
    try {
      // Fetch orders based on the selected status
      await dispatch(
        fetchAllOrdersAsync({ status: status === "all" ? null : status })
      );
    } finally {
      // Set loading to false once the data has been fetched or if there's an error
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const filteredOrders = (ordersToFilter) => {
    // Check if ordersToFilter is an array
    if (!Array.isArray(ordersToFilter)) {
      alert.error("Invalid orders data. Expected an array.");
      return [];
    }
    return ordersToFilter.filter((order) => {
      const lowerCaseSearch = searchTerm.toLowerCase();

      if (!order) {
        return false;
      }

      // Handle searching by order items
      if (searchCategory === "items") {
        const itemMatches = order.items.some((item) => {
          const itemTitle = item.product.title.toLowerCase();
          return itemTitle.includes(lowerCaseSearch);
        });

        return itemMatches;
      }

      // Handle searching by other properties
      const searchValue = order[searchCategory];

      if (searchValue === undefined || searchValue === null) {
        return false;
      }

      const searchValueString = searchValue.toString().toLowerCase();
      return searchValueString.includes(lowerCaseSearch);
    });
  };

  useEffect(() => {
    let pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    const filterParams = {
      sort,
      pagination,
    };

    dispatch(fetchAllOrdersAsync(filterParams))
      .then(() => setLoading(false)) // Set loading to false after data has been fetched
      .catch(() => setLoading(false)); // Set loading to false in case of an error
  }, [dispatch, page, sort, selectedStatus, searchTerm, searchCategory]);
  return (
    <>
      {" "}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div>
            <HashLoader color="blue" size={50} />
          </div>
        </div>
      )}
      {!orderLoaded ? (
        <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
          <HashLoader color="blue" size={50} />
        </div>
      ) : (
        <div className="">
          <div className="flex justify-between">
            <div className="flex space-x-2 mb-4">
              <button
                className={`${
                  activeFilter === "all"
                    ? "bg-blue-800 text-white"
                    : "bg-transparent border text-blue-800 border-blue-800"
                }  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleFilterByStatus("all")}
              >
                All
              </button>
              <button
                className={`${
                  activeFilter === "pending"
                    ? "bg-purple-700 text-white"
                    : "bg-transparent border text-purple-700 border-purple-700"
                } font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleFilterByStatus("pending")}
              >
                Pending
              </button>
              <button
                className={`${
                  activeFilter === "dispatched"
                    ? "bg-orange-700 text-white"
                    : "bg-transparent border text-orange-700 border-orange-700"
                }  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleFilterByStatus("dispatched")}
              >
                Dispatched
              </button>
              <button
                className={`${
                  activeFilter === "delivered"
                    ? "bg-green-700 text-white"
                    : "bg-transparent border text-green-700 border-green-700"
                }  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleFilterByStatus("delivered")}
              >
                Delivered
              </button>
              <button
                className={`${
                  activeFilter === "cancelled"
                    ? "bg-red-700 text-white"
                    : "bg-transparent border text-red-700 border-red-700"
                } font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleFilterByStatus("cancelled")}
              >
                Cancelled
              </button>
            </div>
            <div className="mb-4 flex items-center space-x-2">
              <select
                className="p-2 border rounded-md"
                value={searchCategory}
                onChange={handleSearchCategoryChange}
              >
                <option value="id">Order ID</option>
                <option value="totalAmount">Total Amount</option>
                <option value="status">Status</option>
                <option value="items">Items Title</option>
                <option value="items">Items Title</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${searchCategory}`}
                className="p-2 border rounded-l-md w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-l-none rounded-r-md focus:outline-none focus:shadow-outline"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="bg-gray-100 flex items-center justify-center font-sans">
            <div className="w-full">
              <div className="bg-white shadow-md rounded my-6">
                {orders.length > 0 ? (
                  <table
                    className="min-w-max w-full table-row-group overflow-hidden p-1"
                    style={{
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                    }}
                  >
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th
                          className="py-3 px-1 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "id",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Order#{" "}
                          {sort._sort === "id" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>
                        <th className="py-3 px-1 text-left">Items</th>
                        <th
                          className="py-3 px-1 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "totalAmount",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Total Amount{" "}
                          {sort._sort === "totalAmount" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>
                        <th className="py-3 px-1 text-center">
                          Shipping Address
                        </th>
                        <th className="py-3 px-1 text-center">Order Status</th>
                        <th className="py-3 px-1 text-center">
                          Payment Method
                        </th>
                        <th
                          className="py-3 px-1 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "createdAt",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Order Time
                          {sort._sort === "createdAt" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>{" "}
                        <th
                          className="py-3 px-1 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "updatedAt",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Updated At
                          {sort._sort === "updatedAt" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>{" "}
                        <th className="py-3 px-1 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {filteredOrders(orders).map((order) => (
                        <React.Fragment key={order.id}>
                          <tr className="border-b border-gray-200 hover:bg-gray-100">
                            {" "}
                            <td className="py-3 px-1 text-left whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="mr-2"></div>
                                <span className="font-medium">{order.id}</span>
                              </div>
                            </td>
                            <td className="py-3 px-1 text-left">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="mr-2">
                                    <img
                                      className="w-6 h-6 rounded-full"
                                      src={item.product.thumbnail}
                                      alt="item"
                                    />
                                  </div>
                                  <span className="flex-shrink-1">
                                    {item.product.title} - #{item.quantity} -
                                    Rs.
                                    {discountedPrice(item.product)}{" "}
                                    {item.subCategory &&
                                      item.subCategory !== "" &&
                                      `- ${item.subCategory}`}
                                    {item.color && item.color !== "" && (
                                      <>
                                        "-"
                                        <span
                                          className={``}
                                          style={{
                                            backgroundColor: `rgba(${parseInt(
                                              item.color.slice(1, 3),
                                              16
                                            )}, ${parseInt(
                                              item.color.slice(3, 5),
                                              16
                                            )}, ${parseInt(
                                              item.color.slice(5, 7),
                                              16
                                            )}, 0.5)`,
                                            padding: "2px",
                                            borderRadius: "5px",
                                            color: item.color,
                                          }}
                                        >
                                          {item.color}
                                        </span>
                                      </>
                                    )}{" "}
                                  </span>
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="flex items-center justify-center">
                                Rs.{order.totalAmount}
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="">
                                <div>
                                  <strong>{order.selectedAddress.name}</strong>,
                                </div>
                                <div>{order.selectedAddress.street},</div>
                                <div>{order.selectedAddress.city}, </div>
                                <div>{order.selectedAddress.state}, </div>
                                <div>{order.selectedAddress.pinCode}, </div>
                                <div>{order.selectedAddress.phone}, </div>
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center">
                              {order.id === editableOrderId ? (
                                <select
                                  onChange={(e) => handleUpdate(e, order)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="dispatched">Dispatched</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              ) : (
                                <span
                                  className={`${chooseColor(
                                    order.status
                                  )} py-1 px-3 rounded-full text-xs`}
                                >
                                  {order.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="flex items-center justify-center">
                                {order.paymentMethod}
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="flex items-center justify-center ">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString()
                                  : null}
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="flex items-center justify-center">
                                {order.updatedAt
                                  ? new Date(order.updatedAt).toLocaleString()
                                  : null}{" "}
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center">
                              <div className="flex item-center justify-center">
                                <div className="w-6 mr-4 transform hover:text-blue-700 hover:scale-120">
                                  <EyeIcon
                                    className="w-8 h-8"
                                    onClick={(e) => handleShow(order)}
                                  ></EyeIcon>
                                </div>
                                <div className="w-6 mr-2 transform hover:text-blue-700 hover:scale-120">
                                  <PencilIcon
                                    className="w-8 h-8"
                                    onClick={(e) => handleEdit(order)}
                                  ></PencilIcon>
                                </div>
                              </div>
                            </td>
                          </tr>
                          {selectedOrder && selectedOrder.id === order.id && (
                            <tr>
                              <td colSpan="6">
                                <div className="bg-white shadow-md rounded my-6 p-6">
                                  <h2 className="text-2xl font-bold mb-4 text-blue-700">
                                    Order Details
                                  </h2>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Order ID:
                                        </strong>{" "}
                                        {selectedOrder.id}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Status:
                                        </strong>{" "}
                                        {selectedOrder.status}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Total Amount:
                                        </strong>{" "}
                                        ${selectedOrder.totalAmount}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Total Items:
                                        </strong>{" "}
                                        {selectedOrder.totalItems}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          User ID:
                                        </strong>{" "}
                                        {selectedOrder.user}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Payment Method:
                                        </strong>{" "}
                                        {selectedOrder.paymentMethod}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Status:
                                        </strong>{" "}
                                        {selectedOrder.status}
                                      </p>
                                      <p className="text-[1rem] my-[3px]">
                                        <strong className="text-green-700 font-bold">
                                          Selected Address:
                                        </strong>{" "}
                                        {`${selectedOrder.selectedAddress.street}, ${selectedOrder.selectedAddress.city}, ${selectedOrder.selectedAddress.state}, ${selectedOrder.selectedAddress.pinCode}`}
                                      </p>
                                    </div>
                                    <div>
                                      <h3 className="text-2xl font-bold mt-4 text-blue-700">
                                        Items
                                      </h3>
                                      <ul>
                                        {selectedOrder.items.map(
                                          (item, index) => (
                                            <>
                                              <li key={index} className="mb-2">
                                                <div className="flex items-center">
                                                  <div className="mr-2">
                                                    <img
                                                      className="w-6 h-6 rounded-full"
                                                      src={
                                                        item.product.thumbnail
                                                      }
                                                      alt="item"
                                                    />
                                                  </div>
                                                  <span>
                                                    <strong className="text-green-700">
                                                      {item.product.title} - #
                                                      {item.quantity} - Rs.
                                                      {discountedPrice(
                                                        item.product
                                                      )}
                                                    </strong>
                                                  </span>
                                                </div>
                                              </li>
                                              <li>
                                                {" "}
                                                <div className="flex justify-between text-sm text-gray-500">
                                                  {item.color &&
                                                    item.color !== "" && (
                                                      <p className="flex items-center my-1">
                                                        Color:{" "}
                                                        <div
                                                          className="w-5 h-5 rounded-full relative mx-1"
                                                          style={{
                                                            background:
                                                              item.color,
                                                          }}
                                                        />
                                                        <span
                                                          style={{
                                                            color: item.color,
                                                            marginRight:
                                                              "0.5rem",
                                                          }}
                                                        >
                                                          {item.color}
                                                        </span>
                                                      </p>
                                                    )}
                                                  {item.subCategory &&
                                                    item.subCategory !== "" && (
                                                      <p>{item.subCategory}</p>
                                                    )}
                                                </div>
                                              </li>
                                            </>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                  {/* Close button */}
                                  <button
                                    className="bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => setSelectedOrder(null)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <h1 className="text-center text-4xl text-gray-400">
                    No Order Found
                  </h1>
                )}
              </div>
            </div>
          </div>

          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalOrders}
          ></Pagination>
        </div>
      )}
    </>
  );
}

export default AdminOrders;
