import AdminProductDetail from "../features/admin/components/AdminProductDetail";
import Footer from "../features/common/Footer";
import NavBar from "../features/navbar/Navbar";
function AdminProductDetailPage() {
    return ( 
        <div>
            <NavBar>
                <AdminProductDetail></AdminProductDetail>
            </NavBar>
            <Footer/>
        </div>
     );
}

export default AdminProductDetailPage;