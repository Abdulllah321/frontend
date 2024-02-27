import AdminOrders from "../features/admin/components/AdminOrders";
import Footer from "../features/common/Footer";
import NavBar from "../features/navbar/Navbar";

function AdminOrderPage() {
  return (
    <div>
      <NavBar>
        <AdminOrders></AdminOrders>
      </NavBar>

      <Footer/>
    </div>
  );
}

export default AdminOrderPage;
