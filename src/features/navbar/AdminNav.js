import { NavLink } from "react-router-dom";
import { FaBars, FaHome } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import { MdAdminPanelSettings, MdDiscount } from "react-icons/md";
import { FaJediOrder, FaUsers } from "react-icons/fa6";
import { BiCategoryAlt } from "react-icons/bi";
import { TfiLayoutSliderAlt } from "react-icons/tfi";

const routes = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome />,
  },
  {
    path: "/shop",
    name: "Shop",
    icon: <CiShop />,
  },
  {
    path: "/admin/products",
    name: "Admin Products",
    icon: <MdAdminPanelSettings />,
  },
  {
    path: "/admin/orders",
    name: "Orders",
    icon: <FaJediOrder />,
  },
  {
    path: "/admin/category_&_brand",
    name: "Orders",
    icon: <BiCategoryAlt />,
  },
  {
    path: "/admin/all-users",
    name: "All users",
    icon: <FaUsers />,
  },
  {
    path: "/admin/sliders",
    name: "Slides",
    icon: <TfiLayoutSliderAlt />,
  },
  {
    path: "/admin/flash-sales",
    name: "Flash Sales",
    icon: <MdDiscount />,
  },
];

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const ref = useRef(null);
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  useEffect(() => {
    const main = ref.current;
    const width = main.getBoundingClientRect().width;
    main.style.marginRight = `${width}px`;
  }, []);

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
          ref={ref}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  DoSomeCoding
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} className="cursor-pointer" />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>
      </div>
    </>
  );
};

export default AdminNav;
