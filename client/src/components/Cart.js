import "./Cart.css";

import { useState } from "react";

import axios from "axios";

function Cart({

  cartItems,
  setCartItems,
  updateQuantity,
  removeFromCart,
  paymentMethod,
  setPaymentMethod,
  fetchProducts,
  fetchMyOrders,

}) {

  // TOP MESSAGE

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  // PAYMENT POPUP

  const [showPaymentPopup,
    setShowPaymentPopup] =
    useState(false);

  // SHOW MESSAGE FUNCTION

  const showTopMessage = (text) => {

    setMessage(text);

    setShowMessage(true);

    setTimeout(() => {

      setShowMessage(false);

    }, 2500);

  };

  // HANDLE QUANTITY

  const handleQuantity = (
    id,
    action,
    itemName
  ) => {

    updateQuantity(id, action);

    if (action === "increase") {

      showTopMessage(
        `${itemName} Quantity Updated ✅`
      );

    } else {

      showTopMessage(
        `${itemName} Quantity Reduced`
      );

    }

  };

  // REMOVE ITEM

  const handleRemove = (
    index,
    itemName
  ) => {

    removeFromCart(index);

    showTopMessage(
      `${itemName} Removed From Cart ❌`
    );

  };

  // CHECK STOCK

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

          showTopMessage(
            `${cartItem.name} Out Of Stock`
          );

          return;

        }

      }

      // OPEN PAYMENT POPUP

      setShowPaymentPopup(true);

    } catch (error) {

      showTopMessage(
        "Stock Check Failed ❌"
      );

    }

  };

  // PLACE ORDER

  const placeOrderHandler = async () => {

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const orderData = {

        user: userInfo._id,

        orderItems: cartItems.map(
          (item) => ({

            name: item.name,

            quantity: item.quantity,

            image: item.image,

            price: item.price,

            product: item._id,

          })
        ),

        totalPrice: cartItems.reduce(
          (acc, item) =>
            acc + item.price * item.quantity,
          0
        ),

        shippingAddress: {

          address:
            userInfo.address ||
            "Bangalore",

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

      showTopMessage(

        paymentMethod === "COD"

          ? "Order Placed Successfully ✅"

          : "Payment Successful ✅"

      );

      setShowPaymentPopup(false);

      setCartItems([]);

      fetchProducts();

      fetchMyOrders();

    } catch (error) {

      showTopMessage(

        error.response?.data?.message ||

        "Order Failed ❌"

      );

    }

  };

  return (

    <div className="cart-container">

      {/* TOP MESSAGE */}

      {

        showMessage && (

          <div className="cart-message">

            {message}

          </div>

        )

      }

      <h1 className="cart-title">

        Cart Items 🛒

      </h1>

      {cartItems.length === 0 ? (

        <p className="empty-cart">

          No items in cart

        </p>

      ) : (

        <>

          {cartItems.map((item, index) => (

            <div
              key={index}
              className="cart-item"
            >

              <div className="cart-left">

                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-product-image"
                />

                <div className="cart-info">

                  <h2>{item.name}</h2>

                  <p>{item.brand}</p>

                </div>

              </div>

              <div className="cart-right">

                <div className="cart-price">

                  ₹{item.price}

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        handleQuantity(
                          item._id,
                          "decrease",
                          item.name
                        )
                      }
                    >
                      -
                    </button>

                    <span className="quantity-number">

                      {item.quantity}

                    </span>

                    <button
                      onClick={() =>
                        handleQuantity(
                          item._id,
                          "increase",
                          item.name
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    handleRemove(
                      index,
                      item.name
                    )
                  }
                >

                  Remove

                </button>

              </div>

            </div>

          ))}

          {/* CHECKOUT */}

          <div className="checkout-section">

            <h2 className="total-price">

              Total: ₹

              {cartItems.reduce(
                (acc, item) =>
                  acc +
                  item.price *
                    item.quantity,
                0
              )}

            </h2>

            <div className="payment-section">

              <h3>

                Select Payment Method

              </h3>

              <select
                className="payment-select"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              >

                <option value="COD">
                  Cash On Delivery
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Debit/Credit Card
                </option>

              </select>

              <button
                className="checkout-btn"
                onClick={checkoutHandler}
              >

                Checkout

              </button>

            </div>

          </div>

        </>

      )}

      {/* PAYMENT POPUP */}

      {

        showPaymentPopup && (

          <div className="payment-popup-overlay">

           <div className="payment-popup">

  <h2 className="popup-title">

    Confirm Your Order 🛍️

  </h2>

  <p className="popup-method">

    Payment Method:

    <span>
      {paymentMethod}
    </span>

  </p>

  <h3 className="popup-total">

    Total: ₹

    {cartItems.reduce(

      (acc, item) =>

        acc +
        item.price *
        item.quantity,

      0

    )}

  </h3>

  {

    paymentMethod !== "COD" && (

      <div className="fake-payment-box">

        <input
          type="text"
          placeholder="Enter UPI ID / Card Number"
        />

        <input
          type="password"
          placeholder="Enter PIN / Password"
        />

      </div>

    )

  }

  <div className="payment-buttons">

    <button
      className="pay-btn"
      onClick={placeOrderHandler}
    >

      Confirm Order

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

        )

      }

    </div>

  );

}

export default Cart;