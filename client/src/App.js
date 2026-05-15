import "./App.css";

import { useState, useEffect } from "react";

import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

function App() {

  const [cartItems, setCartItems] = useState([]);

  const [search, setSearch] = useState("");

  const [showCart, setShowCart] = useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [showRegister, setShowRegister] =
    useState(false);

  const [products, setProducts] = useState([]);

  const [showAdminProducts,
    setShowAdminProducts] =
    useState(false);

  const [showOrders,
    setShowOrders] =
    useState(false);

  // ADMIN STATES

  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeCategory, setShoeCategory] = useState("");
  const [shoeDescription, setShoeDescription] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeImage, setShoeImage] = useState("");
  const [shoeStock, setShoeStock] = useState("");

  // FETCH PRODUCTS

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const { data } = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchProducts();

  }, []);

  // ADD TO CART

  const addToCart = (product) => {

    setCartItems([...cartItems, product]);

    alert(product.name + " added to cart");

  };

  // REMOVE FROM CART

  const removeFromCart = (index) => {

    const updatedCart = cartItems.filter(
      (_, i) => i !== index
    );

    setCartItems(updatedCart);

  };

  // ADD NEW SHOE

 const addNewShoe = async () => {

  try {

    const { data } = await axios.post(
      "http://localhost:5000/api/products",

      {
        name: shoeName,
        brand: shoeBrand,
        category: shoeCategory,
        description: shoeDescription,
        price: shoePrice,
        image: shoeImage,
        countInStock: shoeStock,
      }
    );

    setProducts([...products, data]);

    alert("Shoe Added Successfully");

    setShoeName("");
    setShoeBrand("");
    setShoeCategory("");
    setShoeDescription("");
    setShoePrice("");
    setShoeImage("");
    setShoeStock("");

  } catch (error) {

    console.log(error);

    alert("Failed To Add Shoe");

  }

};

  // SEARCH FILTER

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // USER INFO

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

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

    <div>

      <Navbar
        setShowCart={setShowCart}
        setShowProfile={setShowProfile}
        setShowAdminProducts={
          setShowAdminProducts
        }
        setShowOrders={setShowOrders}
      />

      {/* ADMIN PAGE */}

      {showAdminProducts ? (

        <div className="admin-page">

          <h1>
            Admin Dashboard 👑
          </h1>

          <h2>Add New Shoes</h2>

          <div className="admin-form">

  <input
    type="text"
    placeholder="Shoe Name"
    value={shoeName}
    onChange={(e) =>
      setShoeName(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Brand"
    value={shoeBrand}
    onChange={(e) =>
      setShoeBrand(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Category"
    value={shoeCategory}
    onChange={(e) =>
      setShoeCategory(e.target.value)
    }
  />

  <textarea
    placeholder="Description"
    value={shoeDescription}
    onChange={(e) =>
      setShoeDescription(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Price"
    value={shoePrice}
    onChange={(e) =>
      setShoePrice(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Image URL"
    value={shoeImage}
    onChange={(e) =>
      setShoeImage(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Count In Stock"
    value={shoeStock}
    onChange={(e) =>
      setShoeStock(e.target.value)
    }
  />

  <button onClick={addNewShoe}>
    Add Shoe
  </button>

</div>

        </div>

      ) : showOrders ? (

        <div className="admin-page">

          <h1>
            Customer Orders 📦
          </h1>

          <p>
            Ordered products will display here
          </p>

        </div>

      ) : showProfile ? (

        /* PROFILE PAGE */

        <div className="profile-page">

          <h1>Profile 👤</h1>

          <div className="profile-card">

            <h2>
              {userInfo.name}
            </h2>

            <p>
              Email:
              {userInfo.email}
            </p>

            <p>

              Role:
              {userInfo.isAdmin
                ? " Admin"
                : " Customer"}

            </p>

            <button
              className="logout-btn"
              onClick={() => {

                localStorage.removeItem(
                  "userInfo"
                );

                window.location.reload();

              }}
            >
              Logout
            </button>

          </div>

        </div>

      ) : showCart ? (

        /* CART PAGE */

        <div className="cart-page">

          <h1>Cart Items 🛒</h1>

          {cartItems.length === 0 ? (

            <p>No items in cart</p>

          ) : (

            <>

              {cartItems.map(
                (item, index) => (

                  <div
                    key={index}
                    className="cart-item"
                  >

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
                        onClick={() =>
                          removeFromCart(index)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                )
              )}

              <div className="total-section">

                <h2>

                  Total: ₹
                  {cartItems.reduce(
                    (acc, item) =>
                      acc + item.price,
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

        /* HOME PAGE */

        <>

          <div className="home">

            <h1>
              Welcome to Shoe Mart 👟
            </h1>

            <p>
              Discover the best shoes
              with premium quality.
            </p>

            <input
              type="text"
              placeholder="Search shoes..."
              className="search-bar"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="products-container">

            {filteredProducts.map(
              (product) => (

                <ProductCard
  key={product._id}
  name={product.name}
  brand={product.brand}
  category={product.category}
  description={product.description}
  price={product.price}
  image={product.image}
  countInStock={product.countInStock}
  addToCart={() =>
    addToCart(product)
  }
/>

              )
            )}

          </div>

        </>

      )}

    </div>

  );

}

export default App;