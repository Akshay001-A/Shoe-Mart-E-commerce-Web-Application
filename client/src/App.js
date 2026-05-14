import "./App.css";

import { useState } from "react";
import Login from "./components/Login";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

function App() {

  const [cartItems, setCartItems] = useState([]);

  const [search, setSearch] = useState("");

  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const products = [

    {
      id: 1,
      name: "Nike Air Max",
      brand: "Nike",
      price: 5999,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },

    {
      id: 2,
      name: "Adidas Ultraboost",
      brand: "Adidas",
      price: 6999,
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    },

    {
      id: 3,
      name: "Puma Running",
      brand: "Puma",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    },

  ];

  const addToCart = (product) => {

    setCartItems([...cartItems, product]);

    alert(product.name + " added to cart");

  };

  const removeFromCart = (index) => {

    const updatedCart = cartItems.filter(
      (_, i) => i !== index
    );

    setCartItems(updatedCart);

  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const userInfo = localStorage.getItem("userInfo");

if (!userInfo) {
  return <Login />;
}

return (

    <div>

      <Navbar
  setShowCart={setShowCart}
  setShowProfile={setShowProfile}
/>

      {showProfile ? (

  <div className="profile-page">

    <h1>Profile 👤</h1>

    <div className="profile-card">

      <h2>Akshay</h2>

      <p>Email: akshay@gmail.com</p>

      <p>Role: Customer</p>
<button
  className="logout-btn"
  onClick={() => {

    localStorage.removeItem("userInfo");

    window.location.reload();

  }}
>
  Logout
</button>

    </div>

  </div>

) : showCart ? (
        <div className="cart-page">

          <h1>Cart Items 🛒</h1>

          {cartItems.length === 0 ? (

            <p>No items in cart</p>

          ) : (

            <>

              {cartItems.map((item, index) => (

                <div key={index} className="cart-item">

                  <div className="cart-left">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-image"
                    />

                    <div className="cart-details">

                      <h3>{item.name}</h3>

                      <p>{item.brand}</p>

                    </div>

                  </div>

                  <div>

                    <div className="cart-price">
                      ₹{item.price}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

              <div className="total-section">

                <h2>

                  Total: ₹
                  {cartItems.reduce(
                    (acc, item) => acc + item.price,
                    0
                  )}

                </h2>

                <button className="checkout-btn">
                  Checkout
                </button>

              </div>

            </>

          )}

        </div>

      ) : (

        <>

          <div className="home">

            <h1>Welcome to Shoe Mart 👟</h1>

            <p>
              Discover the best shoes with premium quality.
            </p>

            <input
              type="text"
              placeholder="Search shoes..."
              className="search-bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="products-container">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                image={product.image}
                addToCart={() => addToCart(product)}
              />

            ))}

          </div>

        </>

      )}

    </div>
  );

}



export default App;