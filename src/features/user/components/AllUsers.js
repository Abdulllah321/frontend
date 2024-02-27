import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserAsync,
  fetchAllUserAsync,
  selectAllUsers,
  selectUserInfo,
  selectUserLoaded,
  updateAllUserAsync,
} from "../userSlice";
import Modal from "../../common/Modal";
import { useAlert } from "react-alert";
import { HashLoader } from "react-spinners";

const AllUsers = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const [openModal, setOpenModal] = useState(null);
  const userLoaded = useSelector(selectUserLoaded);
  const alert = useAlert();
  const UserInfo = useSelector(selectUserInfo);
  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  const getInitials = (name) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchProperty, setSearchProperty] = useState("name"); // Default search property

  const filteredUsers = allUsers
    .filter((user) =>
      user[searchProperty].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => user.id !== UserInfo.id);

  const handleMakeAdmin = (user) => {
    const updatedRole = {
      id: user.id,
      role: user.role === "admin" ? "user" : "admin",
    };

    // Use the updatedRole directly in updateUserAsync
    dispatch(updateAllUserAsync(updatedRole));
    alert.success(`${user.name} role has been updated as ${user.role}`);
  };

  const handleRemove = (e, id) => {
    dispatch(deleteUserAsync(id));
  };

  return (
    <>
      {!userLoaded ? (
        <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
          <HashLoader color="blue" size={50} />
        </div>
      ) : (
        <section className="transition-all duration-500 ease-in-out w-full">
          <div className="mb-4 w-full flex gap-1">
            <input
              type="search"
              placeholder={`Search by ${searchProperty}`}
              className="p-2 border rounded-l-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="relative">
              <select
                className="border rounded-r-md p-2 w-28"
                onChange={(e) => setSearchProperty(e.target.value)}
                value={searchProperty}
              >
                <option value="name">Name</option>
                <option value="id">Id</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">All Users</h2>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`border rounded-md p-4 mb-4 flex transition-all duration-300 ease-in-out hover:bg-gray-100 ${
                user.role === "admin" ? "bg-green-200" : "bg-blue-200"
              }`}
            >
              <div className="mr-4 mt-3">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      user.role === "admin" ? "bg-green-500" : "bg-blue-800"
                    }`}
                  >
                    <span className="text-white text-xl font-bold">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold mb-1">
                  <span className="font-bold text-gray-900 text-lg ">
                    userId:
                  </span>{" "}
                  <span className="font-semibold text-gray-600">{user.id}</span>
                </p>
                <p className="font-semibold mb-1">
                  <span className="font-bold text-gray-900 text-lg ">
                    Name:
                  </span>{" "}
                  <span className="font-semibold text-gray-600">
                    {user.name}
                  </span>
                </p>
                <p className=" mb-1">
                  <span className="font-bold text-gray-900 text-lg ">
                    Email:
                  </span>{" "}
                  <span className="font-semibold text-gray-600">
                    {user.email}
                  </span>
                </p>
                <p className=" mb-1">
                  <span className="font-bold text-gray-900 text-lg ">
                    Role:
                  </span>{" "}
                  <span
                    className={`font-semibold ${
                      user.role === "admin"
                        ? "text-green-600 capitalize"
                        : "text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                {user.addresses.length !== 0 ? (
                  <div>
                    <p className=" mb-1 font-semibold">
                      <span className="font-bold text-lg text-gray-900">
                        Addresses:
                      </span>
                    </p>
                    <ul className="list-disc pl-6 mb-2">
                      {user.addresses.map((address, index) => (
                        <li key={index} className="">
                          {address.street}, {address.city}, {address.state} -{" "}
                          {address.pinCode}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-1 font-semibold">
                    No Address Found
                  </p>
                )}

                <div>
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    className={`${
                      user.role === "admin"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-800 hover:bg-blue-700"
                    } text-white font-bold py-2 px-4 rounded mr-2 transition-all duration-300 ease-in-out`}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Set as Admin"}
                  </button>

                  <Modal
                    title={`Delete ${user.name || user.email}`}
                    message="Are you sure you want to delete this Cart item ?"
                    dangerOption="Delete"
                    cancelOption="Cancel"
                    dangerAction={(e) => handleRemove(e, user.id)}
                    cancelAction={() => setOpenModal(null)}
                    showModal={openModal === user.id}
                  ></Modal>
                  <button
                    onClick={(e) => {
                      setOpenModal(user.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default AllUsers;
