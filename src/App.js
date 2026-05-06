import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/header';
import Home from './Pages/Home';
import About from './Pages/About';
import ProductDetails from './Pages/ProductDetails/index.js';
import Collection from './Pages/Collection/index.js';
import Footer from './components/footer';
import TermsAndCondition from './Pages/TermsAndCondition.js';
import Refund from './Pages/Refund.js';
import Privacy from './Pages/Privacy.js';
import FilteredProducts from './Pages/filteredProducts.js';
import Signup from './Pages/Signup.js';
import Login from './Pages/Login.js';
import Otp from './Pages/Otp.js';
import Profile from './Pages/Profile.js';
import Testing from './Pages/Testing.js';
import ResetPassword from './Pages/ResetPassword.js';
import Shipping from './Pages/Shipping.js';
import Contact from './Pages/Contact.js';
import SubCategoryList from './Pages/subcategoryList.js';
import SubCategoryProducts from './Pages/subcategoryProducts.js';
import AllProducts from './Pages/allProducts.js';
import MyOrders from './Pages/MyOrders.js';
import RequestReturn from './Pages/RequestReturn.js';
import MyReturns from './Pages/MyReturns.js';
import ReturnDetails from './Pages/ReturnDetails.js';
import CheckoutPage from './Pages/checkout.js';
import OrderSuccessPage from './Pages/OrderSuccessPage.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/products/:categoryName" element={<FilteredProducts />} />
          <Route path="/category/:categoryId" element={<SubCategoryList />} />
          <Route path="/subcategory/:subCategoryId" element={<SubCategoryProducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/termsandcondition" element={<TermsAndCondition />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/my-returns" element={<MyReturns />} />
          <Route path="/return-details/:id" element={<ReturnDetails />} />
          <Route path="/request-return/:orderId" element={<RequestReturn />} />
          <Route path="/productdetails/:productId" element={<ProductDetails />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<AllProducts />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
