import "./App.css";
import "./features/navbar/navbar.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked,
} from "./features/auth/authSlice";
import { fetchItemsByUserIdAsync } from "./features/cart/cartSlice";
import { fetchLoggedInUserAsync } from "./features/user/userSlice";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Protected from "./features/auth/components/Protected";
import Logout from "./features/auth/components/Logout";
import { HashLoader } from "react-spinners";
import ProtectedAdmin from "./features/auth/components/ProtectedAdmin";
import { SkeletonTheme } from "react-loading-skeleton";
import FlashSales from "./features/product/components/FlashSales";
import { fetchWishlistItemsByUserIdAsync } from "./features/wishlist/wishListSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const PageNotFound = lazy(() => import("./pages/404"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const UserOrdersPage = lazy(() => import("./pages/UserOrdersPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const AdminProductDetailPage = lazy(() =>
  import("./pages/AdminProductDetailPage")
);
const AdminProductFormPage = lazy(() => import("./pages/AdminProductFormPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminCategoryBrand = lazy(() => import("./pages/AdminCategoryBrand"));
const AllUsersPage = lazy(() => import("./pages/AllUsersPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const Categories = lazy(() => import("./pages/Categories"));
const SearchResults = lazy(() =>
  import("./features/product/components/SearchResults")
);
const ShopPage = lazy(() => import("./pages/ShopPage"));
const AdminSliders = lazy(() =>
  import("./features/admin/components/AdminSliders")
);
const WishlistPage = lazy(() => import("./pages/WishListPage"));

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home></Home>
      </Protected>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedAdmin>
        <AdminHome></AdminHome>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/signup",
    element: <SignupPage></SignupPage>,
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ),
  },
  {
    path: "/wishlists",
    element: (
      <Protected>
        <WishlistPage></WishlistPage>
      </Protected>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ),
  },
  {
    path: "/product-detail/:id",
    element: (
      <Protected>
        <ProductDetailPage></ProductDetailPage>
      </Protected>
    ),
  },
  {
    path: "/admin/product-detail/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form/edit/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/sliders",
    element: (
      <ProtectedAdmin>
        <AdminSliders></AdminSliders>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/order-success/:id",
    element: (
      <Protected>
        <OrderSuccessPage></OrderSuccessPage>{" "}
      </Protected>
    ),
  },
  {
    path: "/orders",
    element: (
      <Protected>
        <UserOrdersPage></UserOrdersPage>{" "}
      </Protected>
    ),
  },
  {
    path: "/categories",
    element: (
      <Protected>
        <Categories></Categories>{" "}
      </Protected>
    ),
  },
  {
    path: "/profile",
    element: (
      <Protected>
        <UserProfilePage></UserProfilePage>{" "}
      </Protected>
    ),
  },
  {
    path: "/search",
    element: (
      <Protected>
        <SearchResults></SearchResults>{" "}
      </Protected>
    ),
  },
  {
    path: "/shop",
    element: (
      <Protected>
        <ShopPage></ShopPage>{" "}
      </Protected>
    ),
  },

  {
    path: "/admin/category_&_brand",
    element: (
      <ProtectedAdmin>
        <AdminCategoryBrand></AdminCategoryBrand>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/all-users",
    element: (
      <ProtectedAdmin>
        <AllUsersPage></AllUsersPage>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/flash-sales",
    element: (
      <ProtectedAdmin>
        <FlashSales></FlashSales>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/logout",
    element: <Logout></Logout>,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage></ForgotPasswordPage>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  useEffect(() => {
    if (
      userChecked &&
      !user &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      window.location.replace("/login");
    }
  }, [userChecked, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      dispatch(fetchWishlistItemsByUserIdAsync());
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      <div className="App">
        {!userChecked ? (
          <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
            <HashLoader color="blue" size={100} />
          </div>
        ) : (
          <Provider template={AlertTemplate} {...options}>
            <SkeletonTheme baseColor="#bcbcbc" highlightColor="#d5d5d5">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
                    <HashLoader color="blue" size={100} />
                  </div>
                }
              >
                <RouterProvider router={router} />
                <ToastContainer
                  position="bottom-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </Suspense>
            </SkeletonTheme>
          </Provider>
        )}
        {/* Link must be inside the Provider */}
      </div>
    </>
  );
}

export default App;
