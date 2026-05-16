import "./App.css";



import { useState, useEffect } from "react";

import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import AddShoes from "./components/AddShoes";

function App() {

  const [cartItems, setCartItems] = useState([]);

 



  const [showRegister, setShowRegister] =
    useState(false);

  const [products, setProducts] = useState([]);

  
const [topMessage, setTopMessage] =
  useState("");

const [showTopMessage,
  setShowTopMessage] =
  useState(false);


const [currentSlide, setCurrentSlide] =
  useState(0);

const nextSlide = () => {

  setCurrentSlide((prev) =>
    prev === 2 ? 0 : prev + 1
  );

};

const prevSlide = () => {

  setCurrentSlide((prev) =>
    prev === 0 ? 2 : prev - 1
  );

};
const [activePage, setActivePage] =
  useState("home");
  // ADMIN STATES

  const [myOrders, setMyOrders] =
  useState([]);

  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeCategory, setShoeCategory] = useState("");
  const [shoeDescription, setShoeDescription] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeImage, setShoeImage] = useState("");
  const [shoeStock, setShoeStock] = useState("");
  const [orders, setOrders] = useState([]);

  const [editingProduct, setEditingProduct] =
  useState(null);

const [editName, setEditName] =
  useState("");

const [editBrand, setEditBrand] =
  useState("");

const [editCategory, setEditCategory] =
  useState("");

const [editDescription,
setEditDescription] =
  useState("");

const [editPrice, setEditPrice] =
  useState("");

const [editImage, setEditImage] =
  useState("");

const [editStock, setEditStock] =
  useState("");



const [paymentMethod,
setPaymentMethod] =
useState("COD");

  

    const fetchOrders = async () => {

  try {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    const { data } = await axios.get(

      "http://localhost:5000/api/orders",

      {
        headers: {
          Authorization:
            `Bearer ${userInfo.token}`,
        },
      }

    );

    setOrders(data);

  } catch (error) {

    console.log(error);

  }

};

const fetchMyOrders = async () => {

  try {

    const userInfo = JSON.parse(

      localStorage.getItem(
        "userInfo"
      )

    );

    const { data } = await axios.get(

      "http://localhost:5000/api/orders/myorders",

      {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`,

        },

      }

    );

    setMyOrders(data);

  } catch (error) {

    console.log(error);

  }

};


  // FETCH PRODUCTS
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


  // ADD TO CART

// ADD TO CART

const addToCart = (product) => {

  const existItem = cartItems.find(
    (x) => x._id === product._id
  );

  if (existItem) {

    setCartItems(

      cartItems.map((x) =>

        x._id === product._id

          ? {
              ...x,

              quantity:
                x.quantity + 1 <=
                x.countInStock
                  ? x.quantity + 1
                  : x.quantity,
            }

          : x
      )

    );

  } else {

    setCartItems([

      ...cartItems,

      {
        ...product,
        quantity: 1,
      },

    ]);

  }

  // TOP SUCCESS MESSAGE

  setTopMessage(
    `${product.name} Added To Cart 🛒`
  );

  setShowTopMessage(true);

  setTimeout(() => {

    setShowTopMessage(false);

  }, 2000);

};


// UPDATE QUANTITY

const updateQuantity = (

  id,
  action

) => {

  setCartItems(

    cartItems.map((item) => {

      if (item._id === id) {

        // INCREASE

        if (

          action === "increase" &&

          item.quantity <
            item.countInStock

        ) {

          return {

            ...item,

            quantity:
              item.quantity + 1,

          };

        }

        // DECREASE

        if (

          action === "decrease" &&

          item.quantity > 1

        ) {

          return {

            ...item,

            quantity:
              item.quantity - 1,

          };

        }

      }

      return item;

    })

  );

};

  // REMOVE FROM CART

  const removeFromCart = (index) => {

    const updatedCart = cartItems.filter(
      (_, i) => i !== index
    );

    setCartItems(updatedCart);

  };

  const deleteProduct = async (id) => {

  try {

    await axios.delete(
      `http://localhost:5000/api/products/${id}`
    );

    const updatedProducts =
      products.filter(
        (product) =>
          product._id !== id
      );

    setProducts(updatedProducts);

    alert("Product Deleted");

  } catch (error) {

    console.log(error);

    alert("Delete Failed");

  }

};



const openEditForm = (product) => {

  setEditingProduct(product);

  setEditName(product.name);

  setEditBrand(product.brand);

  setEditCategory(product.category);

  setEditDescription(
    product.description
  );

  setEditPrice(product.price);

  setEditImage(product.image);

  setEditStock(product.countInStock);

};

const updateProduct = async () => {

  try {

    const updatedData = {

      name: editName,

      brand: editBrand,

      category: editCategory,

      description: editDescription,

      price: editPrice,

      image: editImage,

      countInStock: editStock,

    };

    await axios.put(

      `http://localhost:5000/api/products/${editingProduct._id}`,

      updatedData

    );

    const { data } = await axios.get(
      "http://localhost:5000/api/products"
    );

    setProducts(data);

    setEditingProduct(null);

    alert("Product Updated");

  } catch (error) {

    console.log(error);

    alert("Update Failed");

  }

};


const updateOrderStatus = async (

  orderId,

  status

) => {

  try {

    const userInfo = JSON.parse(

      localStorage.getItem(

        "userInfo"

      )

    );

    await axios.put(

      `http://localhost:5000/api/orders/${orderId}/status`,

      {

        orderStatus: status,

      },

      {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`,

        },

      }

    );

    fetchOrders();

    alert("Order Status Updated");

  } catch (error) {

    console.log(error);

    alert("Status Update Failed");

  }

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
const [search, setSearch] =
  useState("");

const filteredProducts =
  products.filter((product) =>

    product.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||

    product.brand
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||

    product.category
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

  );

  // USER INFO

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );
  // eslint-disable-next-line
useEffect(() => {

  fetchProducts();

  if (userInfo) {

    fetchMyOrders();

  }

  if (userInfo?.isAdmin) {

    fetchOrders();

  }

}, []);

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

  
  const editPopup = editingProduct && (

  <div className="edit-popup">

    <div className="edit-box">

      <h2>Edit Shoe</h2>

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
        placeholder="Name"
      />

      <input
        value={editBrand}
        onChange={(e) =>
          setEditBrand(e.target.value)
        }
        placeholder="Brand"
      />

      <input
        value={editCategory}
        onChange={(e) =>
          setEditCategory(e.target.value)
        }
        placeholder="Category"
      />

      <textarea
        value={editDescription}
        onChange={(e) =>
          setEditDescription(e.target.value)
        }
        placeholder="Description"
      />

      <input
        value={editPrice}
        onChange={(e) =>
          setEditPrice(e.target.value)
        }
        placeholder="Price"
      />

      <input
        value={editImage}
        onChange={(e) =>
          setEditImage(e.target.value)
        }
        placeholder="Image URL"
      />

      <input
        value={editStock}
        onChange={(e) =>
          setEditStock(e.target.value)
        }
        placeholder="Stock"
      />

      <div className="popup-buttons">

        <button
          onClick={updateProduct}
        >
          Save
        </button>

        <button
          onClick={() =>
            setEditingProduct(null)
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

);
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

    {/* EDIT POPUP */}

    {editPopup}

    <div>

      {/* NAVBAR */}

      <Navbar

        setActivePage={setActivePage}

        search={search}

        setSearch={setSearch}

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

          <div className="admin-page">

            <h1>
              Manage Shoes 👟
            </h1>

            <div className="manage-products-grid">

              {products.map((product) => (

                <div
                  key={product._id}
                  className="manage-product-card"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <h2>{product.name}</h2>

                  <p>{product.brand}</p>

                  <p>{product.category}</p>

                  <p>₹{product.price}</p>

                  <p>
                    Stock:
                    {product.countInStock}
                  </p>

                  <div className="manage-buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        openEditForm(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteProduct(product._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ) : activePage === "orders" ? (

          <div className="admin-page">

            <h1>
              Customer Orders 📦
            </h1>

            <div className="orders-container">

              {orders.length === 0 ? (

                <p>No Orders Found</p>

              ) : (

                orders.map((order) => (

                  <div
                    key={order._id}
                    className="order-card"
                  >

                    <div className="order-left">

                      <h2>
                        Customer:
                        {order.user?.name}
                      </h2>

                      <p>
                        Email:
                        {order.user?.email}
                      </p>

                      <p>
                        Total:
                        ₹{order.totalPrice}
                      </p>

                      <p>
                        Payment:
                        {order.isPaid
                          ? " Paid"
                          : " Not Paid"}
                      </p>

                      <p>
                        Status:
                        {order.orderStatus}
                      </p>

                      <select

                        value={order.orderStatus}

                        onChange={(e) =>

                          updateOrderStatus(

                            order._id,

                            e.target.value

                          )

                        }

                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                      </select>

                    </div>

                    <div className="order-right">

                      <h3>
                        Products:
                      </h3>

                      <div className="order-items">

                        {order.orderItems.map(
                          (item, index) => (

                            <div
                              key={index}
                              className="order-item"
                            >

                              <img
                                src={item.image}
                                alt={item.name}
                              />

                              <div>

                                <h4>
                                  {item.name}
                                </h4>

                                <p>
                                  ₹{item.price}
                                </p>

                                <p>
                                  Qty:
                                  {item.quantity}
                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        ) : activePage === "myorders" ? (

          <div className="admin-page">

            <h1>
              My Orders 📦
            </h1>

            <div className="orders-container">

              {myOrders.length === 0 ? (

                <p>No Orders Found</p>

              ) : (

                myOrders.map((order) => (

                  <div
                    key={order._id}
                    className="order-card"
                  >

                    <div className="order-left">

                      <p>
                        Total:
                        ₹{order.totalPrice}
                      </p>

                      <p className="order-status">

                        {order.orderStatus}

                      </p>

                    </div>

                    <div className="order-right">

                      <h3>
                        Products:
                      </h3>

                      <div className="order-items">

                        {order.orderItems.map(
                          (item, index) => (

                            <div
                              key={index}
                              className="order-item"
                            >

                              <img
                                src={item.image}
                                alt={item.name}
                              />

                              <div className="order-item-details">

                                <h4>
                                  {item.name}
                                </h4>

                                <p>
                                  ₹{item.price}
                                </p>

                                <p>
                                  Qty:
                                  {item.quantity}
                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

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

          <>

            {/* HOME PAGE */}

            <Banner

              currentSlide={currentSlide}

              nextSlide={nextSlide}

              prevSlide={prevSlide}

            />

            {/* PRODUCTS */}

            <div className="products-container">

              {filteredProducts.map((product) => (

                <ProductCard

                  key={product._id}

                  _id={product._id}

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

              ))}

            </div>

          </>

        )

      }

    </div>

  </>

);

}

export default App;