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

function App() {

  const [cartItems, setCartItems] = useState([]);

 

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
    //Customer State

    const [showMyOrders,
setShowMyOrders] =
useState(false);

const [myOrders,
setMyOrders] =
useState([]);


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

  // ADMIN STATES

  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeCategory, setShoeCategory] = useState("");
  const [shoeDescription, setShoeDescription] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeImage, setShoeImage] = useState("");
  const [shoeStock, setShoeStock] = useState("");
  const [orders, setOrders] = useState([]);
  const [showManageShoes, setShowManageShoes] =
  useState(false);
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

const [showPaymentPopup,
setShowPaymentPopup] =
useState(false);

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
const checkoutHandler = async () => {

  try {

    const { data } = await axios.get(
      "http://localhost:5000/api/products"
    );

    for (const cartItem of cartItems) {

      const latestProduct = data.find(
        (product) =>
          product._id === cartItem._id
      );

      if (
        !latestProduct ||
        latestProduct.countInStock <= 0 ||
        latestProduct.countInStock <
          cartItem.quantity
      ) {

        alert(
          cartItem.name +
          " Out Of Stock"
        );

        return;
      }

    }

    // ONLY OPEN POPUP IF STOCK EXISTS

    setShowPaymentPopup(true);

  } catch (error) {

    alert("Stock Check Failed");

  }

};

const placeOrderHandler = async () => {

  try {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    const orderData = {

      user: userInfo._id,

      orderItems: cartItems.map((item) => ({

        name: item.name,

        quantity: item.quantity,

        image: item.image,

        price: item.price,

        product: item._id,

      })),

      totalPrice: cartItems.reduce(
        (acc, item) =>
          acc + item.price * item.quantity,
        0
      ),

      shippingAddress: {

        address: "Bangalore",

        city: "Bangalore",

        postalCode: "560001",

        country: "India",

      },

    };

    await axios.post(

      "http://localhost:5000/api/orders",

      {

        ...orderData,

        paymentMethod,

        isPaid:
          paymentMethod !== "COD",

      },

      {

        headers: {

          Authorization:
            `Bearer ${userInfo.token}`,

        },

      }

    );

    alert(

      paymentMethod === "ONLINE"

        ? "Payment Successful ✅"

        : "Order Placed Successfully ✅"

    );

    setShowPaymentPopup(false);

    setCartItems([]);

    fetchProducts();

    fetchMyOrders();

  } catch (error) {

  

  alert(

    error.response?.data?.message ||

    "Order Failed"

  );

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
  alert(product.name + " added to cart");

};

const updateQuantity = (

  id,
  action

) => {

  setCartItems(

    cartItems.map((item) => {

      if (item._id === id) {

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

    {editPopup}

    {showPaymentPopup && (

  <div className="payment-popup-overlay">

    <div className="payment-popup">

      <h2>
        Confirm Payment
      </h2>

      <p>

        Payment Method:
        <strong>
          {paymentMethod}
        </strong>

      </p>

      <h3>

        Total: ₹
        {cartItems.reduce(

          (acc, item) =>

            acc +
            item.price *
            item.quantity,

          0

        )}

      </h3>

      {paymentMethod !== "COD" && (

        <div className="fake-payment-box">

          <input
            type="text"
            placeholder="Card / UPI ID"
          />

          <input
            type="password"
            placeholder="Password / PIN"
          />

        </div>

      )}

      <div className="payment-buttons">

        <button
          className="pay-btn"
          onClick={placeOrderHandler}
        >
          Pay Now
        </button>

        <button
          className="cancel-btn"
          onClick={() =>
            setShowPaymentPopup(false)
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

    <div>

      <Navbar
  setShowCart={setShowCart}
  setShowProfile={setShowProfile}
  setShowAdminProducts={
    setShowAdminProducts
  }
  setShowOrders={setShowOrders}
  setShowManageShoes={
    setShowManageShoes
  }
  setShowMyOrders={
    setShowMyOrders
  }

  search={search}
  setSearch={setSearch}
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


) : showManageShoes ? (

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

    ) : showOrders ? (

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

            {/* LEFT SIDE */}

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


            {/* RIGHT SIDE */}

            <div className="order-right">

              <h3>Products:</h3>

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


) : showMyOrders ? (

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

              <h3>Products:</h3>

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

      ) :showProfile ? (

  <Profile
    userInfo={userInfo}
  />

) :
       showCart ? (
     //car page in customer 
  <Cart
    cartItems={cartItems}
    updateQuantity={updateQuantity}
    removeFromCart={removeFromCart}
    paymentMethod={paymentMethod}
    setPaymentMethod={setPaymentMethod}
    checkoutHandler={checkoutHandler}
  />

) :  (
        <>
          {/* HOME PAGE  Banner  */}
      
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
                addToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  </>
);

}

export default App;