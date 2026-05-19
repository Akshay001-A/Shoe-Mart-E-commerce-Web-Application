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

  // LOGIN / REGISTER FLOW

  if (!userInfo) {
    return (
      showRegister ? (
        <Register
          setShowRegister={setShowRegister}
        />
      ) : (
        <Login
          setShowRegister={setShowRegister}
        />
      )
    );
  }

  return (
    <>
      {/* TOP MESSAGE */}
      {
        showTopMessage && (
          <div className="top-message">
            {topMessage}
          </div>
        )
      }

      <div>
        {/* NAVBAR */}
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

        {/* PAGE RENDER */}
        {
          activePage === "add" ? (
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
          )
        }
      </div>
      <Chatbot addToCart={addToCart} />
    </>
  );
}

export default App;