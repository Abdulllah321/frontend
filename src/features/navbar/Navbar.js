import { Fragment, useEffect, useRef, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectUserInfo } from "../user/userSlice";
import Search from "../product/components/Search";
import Logo from "../../images/logoBlueWithoutBg.png";
import Headroom from "react-headroom";

const navigation = [
  { name: "Products", link: "/", user: true },
  { name: "Products", link: "/", admin: true },
  { name: "Categories", link: "/categories", user: true },
  { name: "Categories", link: "/categories", admin: true },
  { name: "Shop", link: "/shop", user: true },
  { name: "Shop", link: "/shop", admin: true },
  { name: "AdminProducts", link: "/admin", admin: true },
  { name: "Orders", link: "/admin/orders", admin: true },
  { name: "category & brands", link: "/admin/category_&_brand", admin: true },
  { name: "All-users", link: "/admin/all-users", admin: true },
];
const userNavigation = [
  { name: "My Profile", link: "/profile" },
  { name: "My Orders", link: "/orders" },
  { name: "Sign out", link: "/logout" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();

  const [randomBackgroundColors, setRandomBackgroundColors] = useState([]);

  useEffect(() => {
    // Define a mapping of colors for each letter
    const letterColors = {
      a: "#8484B7", // Vivid Tangerine
      b: "#C70039", // Imperial Red
      c: "#FFC300", // Vivid Gamboge
      d: "#FF5733", // Same as a (Vivid Tangerine)
      e: "#FFD700", // Gold
      f: "#7FFF00", // Chartreuse
      g: "#40E0D0", // Turquoise
      h: "#6495ED", // Cornflower Blue
      i: "#9370DB", // Medium Purple
      j: "#BA55D3", // Medium Orchid
      k: "#FF69B4", // Hot Pink
      l: "#FF1493", // Deep Pink
      m: "#800080", // Purple
      n: "#00CED1", // Dark Turquoise
      o: "#32CD32", // Lime Green
      p: "#008000", // Green
      q: "#8B4513", // Saddle Brown
      r: "#B22222", // Fire Brick
      s: "#FF8C00", // Dark Orange
      t: "#FF4500", // Orange Red
      u: "#CD853F", // Peru
      v: "#DAA520", // Goldenrod
      w: "#2E8B57", // Sea Green
      x: "#20B2AA", // Light Sea Green
      y: "#1E90FF", // Dodger Blue
      z: "#4169E1", // Royal Blue
    };

    // Store the mapping in state
    setRandomBackgroundColors(letterColors);
  }, []);

  const getColorBasedOnFirstLetter = (letter) => {
    const lowerCaseLetter = letter.toLowerCase();
    return randomBackgroundColors[lowerCaseLetter] || "#000000"; // Default color if letter not found
  };

  const getFirstLetter = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <>
      {userInfo && (
        <div className="min-h-full">
          <Headroom className="z-[10000] relative">
            <Disclosure
              as="nav"
              className="transition-all duration-500 ease-in-out relative z-[100] top-0 w-full"
            >
              {({ open }) => (
                <>
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Link
                            to="/"
                            className="flex items-center h-44 top-1 relative"
                          >
                            <img
                              className="h-full"
                              src={Logo}
                              alt="Your Company"
                            />
                          </Link>
                        </div>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) =>
                              item[userInfo.role] ? (
                                <Link
                                  key={item.name}
                                  to={item.link}
                                  className={classNames(
                                    location.pathname === item.link
                                      ? "bg-white rounded-sm font-bold text-blue-800"
                                      : "text-sm font-medium text-white",
                                    "group transition-all px-3 py-2 relative"
                                  )}
                                  aria-current={
                                    item.current ? "page" : undefined
                                  }
                                >
                                  {item.name}
                                  {/* Top Border */}
                                  <span
                                    className={`w-full h-[1px] bg-white absolute -top-1 rounded-full left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right hover:origin-left duration-500 ${
                                      location.pathname === item.link &&
                                      "scale-x-100"
                                    }`}
                                  />

                                  {/* Bottom Border */}
                                  <span
                                    className={`w-full h-[1px] bg-white absolute -bottom-1 rounded-full left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left hover:origin-right duration-500 ${
                                      location.pathname === item.link &&
                                      "scale-x-100"
                                    }`}
                                  />
                                </Link>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          <Link to="/cart">
                            <button
                              type="button"
                              className="rounded-full bg-custom-gradient p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <ShoppingCartIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </Link>
                          {items.length > 0 && (
                            <span className="inline-flex items-center rounded-md mb-7 -ml-3 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 text-bold">
                              {items.length}
                            </span>
                          )}

                          {/* Profile dropdown */}
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button
                                className={`flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-500`}
                              >
                                <span className="sr-only">Open user menu</span>
                                {userInfo && userInfo?.imageUrl !== "" ? (
                                  //Display user image if available
                                  <img
                                    className="h-12 w-12 object-cover rounded-full"
                                    src={userInfo.imageUrl}
                                    alt="Your Company"
                                  />
                                ) : (
                                  <div
                                    className={`h-10 w-10 rounded-full text-center text-white text-[1.5rem] items-center flex justify-center pb-1`}
                                    style={{
                                      background: getColorBasedOnFirstLetter(
                                        getFirstLetter(userInfo?.name)
                                      ),
                                    }}
                                  >
                                    {getFirstLetter(userInfo?.name)}
                                  </div>
                                )}
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <Link
                                        to={item.link}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-custom-gradient w-full p-2 text-gray-400 hover:bg-custom-gradient hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3Icon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100 transform origin-top"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform origin-top"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Disclosure.Panel className="md:hidden">
                      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {navigation.map((item) =>
                          item[userInfo.role] ? (
                            <Link
                              key={item.name}
                              to={item.link}
                              className={classNames(
                                location.pathname === item.link
                                  ? "bg-white text-blue-900 font-bold"
                                  : "text-white",

                                "block rounded-md px-3 py-2 text-base font-medium group "
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                              <span
                                className={`w-full h-[1px] bg-white absolute -top-1 rounded-full left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right hover:origin-left duration-500 ${
                                  location.pathname === item.link &&
                                  "scale-x-100"
                                }`}
                              />

                              {/* Bottom Border */}
                              <span
                                className={`w-full h-[1px] bg-white absolute -bottom-1 rounded-full left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left hover:origin-right duration-500 ${
                                  location.pathname === item.link &&
                                  "scale-x-100"
                                }`}
                              />
                            </Link>
                          ) : null
                        )}
                      </div>

                      <div className="border-t border-gray-700 pb-3 pt-4">
                        <div className="flex items-center px-5 justify-between">
                          <div className="flex gap-1 items-center">
                            <div className="flex-shrink-0">
                              {userInfo && userInfo?.imageUrl !== "" ? (
                                //Display user image if available
                                <img
                                  className="h-12 w-12 object-cover rounded-full"
                                  src={userInfo.imageUrl}
                                  alt="Your Company"
                                />
                              ) : (
                                <div
                                  className={`h-10 w-10 rounded-full text-center text-white text-[1.5rem] items-center flex justify-center pb-1`}
                                  style={{
                                    background: getColorBasedOnFirstLetter(
                                      getFirstLetter(userInfo?.name)
                                    ),
                                  }}
                                >
                                  {getFirstLetter(userInfo?.name)}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-base font-medium leading-none text-white mb-1">
                                {/* this should come from userInfo */}
                                {userInfo?.name || "new user"}
                              </div>
                              <div className="text-sm font-medium leading-none text-gray-400 mt-1">
                                {userInfo?.email || "dummy email"}
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <Link to="/cart">
                              <button
                                type="button"
                                className="ml-auto flex-shrink-0 rounded-full bg-custom-gradient p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                              >
                                <ShoppingCartIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </Link>
                            {items.length > 0 && (
                              <span className="absolute rounded-full -right-2 -top-2   bg-red-50 mb-7 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-red-600/10">
                                {items.length}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          {userNavigation.map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white hover:text-gray-900"
                            >
                              <Link to={item.link}>{item.name}</Link>
                            </Disclosure.Button>
                          ))}
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </Headroom>

          <div className={`relative pt-2`}>
            <Search />

            <header className="bg-white shadow">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-gradient bg-custom-gradient ml-6">
                  E-Commerce
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 min-h-screen">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
