import Footer from "../features/common/Footer";
import NavBar from "../features/navbar/Navbar";
import HomeProductList from "../features/product/components/Home_ProductList";

function Home() {
  return (
    <div>
      <NavBar>
        <HomeProductList />
      </NavBar>
      <Footer />
    </div>
  );
}

export default Home;
