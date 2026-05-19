/**
 * =================================================================================
 * CORE CLIENT GATEWAY (App.js)
 * =================================================================================
 * 
 * WHAT IT DOES:
 * App.js acts as the principal controller and page router of the frontend React app.
 * It integrates the central hook (`useAppState`) to share state functions globally.
 * 
 * WHY WE USE IT:
 * It dynamically mounts Navbar, Home, Cart, Profile, Admin Panels, and Chatbot 
 * based on user session status and current `activePage` states.
 * 
 * USEFULNESS:
 * Provides a clean Single-Page Application (SPA) workflow without requiring 
 * full browser reloads during navigations.
 */

import "./App.css";
import useAppState from "./hooks/useAppState";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import AddShoes from "./components/AddShoes";
import ManageShoes from "./components/ManageShoes";
import Orders from "./components/Orders";
import MyOrders from "./components/MyOrders";
import Chatbot from "./components/Chatbot";

function App() {
  // Extract state properties and API callback queries from our consolidated custom hook
  const {
    cartItems,
    setCartItems,
    showRegister,
    setShowRegister,
    products,
    setProducts,
    topMessage,
    setTopMessage,
    showTopMessage,
    setShowTopMessage,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    activePage,
    setActivePage,
    myOrders,
    setMyOrders,
    shoeName,
    setShoeName,
    shoeBrand,
    setShoeBrand,
    shoeCategory,
    setShoeCategory,
    shoeDescription,
    setShoeDescription,
    shoePrice,
    setShoePrice,
    shoeImage,
    setShoeImage,
    shoeStock,
    setShoeStock,
    orders,
    setOrders,
    editingProduct,
    setEditingProduct,
    editName,
    setEditName,
    editBrand,
    setEditBrand,
    editCategory,
    setEditCategory,
    editDescription,
    setEditDescription,
    editPrice,
    setEditPrice,
    editImage,
    setEditImage,
    editStock,
    setEditStock,
    paymentMethod,
    setPaymentMethod,
    search,
    setSearch,
    aiResults,
    setAiResults,
    filteredProducts,
    userInfo,
    fetchProducts,
    fetchMyOrders,
    fetchOrders,
    addToCart,
    updateQuantity,
    removeFromCart,
    deleteProduct,
    openEditForm,
    updateProduct,
    updateOrderStatus,
    addNewShoe,
  } = useAppState();

  // ===============================================================================
  // 1. GATEKEEPER SESSION FLOW (LOGIN/REGISTER)
  // ===============================================================================
  // If no active user session exists in localStorage, render authentication prompts
  if (!userInfo) {
    return (
      showRegister ? (
        <Register setShowRegister={setShowRegister} />
      ) : (
        <Login setShowRegister={setShowRegister} />
      )
    );
  }

  // ===============================================================================
  // 2. ROOT RENDER BLOCK
  // ===============================================================================
  return (
    <>
      {/* Dynamic Header Notification Alerts (e.g. "Order Placed Successfully") */}
      {showTopMessage && (
        <div className="top-message">
          {topMessage}
        </div>
      )}

      <div>
        {/* Navigation Header Menu */}
        <Navbar
          setActivePage={setActivePage}
          search={search}
          setSearch={setSearch}
          setAiResults={setAiResults}
          aiResults={aiResults}
          products={products}
          setTopMessage={setTopMessage}
          setShowTopMessage={setShowTopMessage}
        />

        {/* Dynamic Multi-Page Component Router Grid */}
        {activePage === "add" ? (
          <AddShoes
            shoeName={shoeName}
            setShoeName={setShoeName}
            shoeBrand={shoeBrand}
            setShoeBrand={setShoeBrand}
            shoeCategory={shoeCategory}
            setShoeCategory={setShoeCategory}
            shoeDescription={shoeDescription}
            setShoeDescription={setShoeDescription}
            shoePrice={shoePrice}
            setShoePrice={setShoePrice}
            shoeImage={shoeImage}
            setShoeImage={setShoeImage}
            shoeStock={shoeStock}
            setShoeStock={setShoeStock}
            addNewShoe={addNewShoe}
          />
        ) : activePage === "manage" ? (
          <ManageShoes
            products={products}
            openEditForm={openEditForm}
            deleteProduct={deleteProduct}
            editingProduct={editingProduct}
            editName={editName}
            setEditName={setEditName}
            editBrand={editBrand}
            setEditBrand={setEditBrand}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            editImage={editImage}
            setEditImage={setEditImage}
            editStock={editStock}
            setEditStock={setEditStock}
            updateProduct={updateProduct}
            setEditingProduct={setEditingProduct}
          />
        ) : activePage === "orders" ? (
          <Orders
            orders={orders}
            updateOrderStatus={updateOrderStatus}
          />
        ) : activePage === "myorders" ? (
          <MyOrders
            myOrders={myOrders}
          />
        ) : activePage === "profile" ? (
          <Profile
            userInfo={userInfo}
          />
        ) : activePage === "cart" ? (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            fetchProducts={fetchProducts}
            fetchMyOrders={fetchMyOrders}
          />
        ) : (
          <Home
            search={search}
            aiResults={aiResults}
            currentSlide={currentSlide}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
            filteredProducts={filteredProducts}
            addToCart={addToCart}
          />
        )}
      </div>

      {/* Floating AI Chatbot Assistant Widget */}
      <Chatbot addToCart={addToCart} />
    </>
  );
}

export default App;