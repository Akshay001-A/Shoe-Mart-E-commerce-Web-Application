import "./Cart.css";

import { useState } from "react";

function Cart({
  cartItems,
  updateQuantity,
  removeFromCart,
  paymentMethod,
  setPaymentMethod,
  checkoutHandler,
}) {

  // TOP MESSAGE

  const [message, setMessage] =
    useState("");

  const [showMessage, setShowMessage] =
    useState(false);

  // HANDLE QUANTITY

  const handleQuantity = (
    id,
    action,
    itemName
  ) => {

    if (
      action === "increase"
    ) {

      setMessage(
        `${itemName} Quantity Updated ✅`
      );

    } else {

      setMessage(
        `${itemName} Quantity Reduced`
      );

    }

    setShowMessage(true);

    setTimeout(() => {

      setShowMessage(false);

    }, 2000);

    updateQuantity(id, action);

  };

  // REMOVE ITEM

  const handleRemove = (
    index,
    itemName
  ) => {

    setMessage(
      `${itemName} Removed From Cart ❌`
    );

    setShowMessage(true);

    setTimeout(() => {

      setShowMessage(false);

    }, 2000);

    removeFromCart(index);

  };

  // CHECKOUT

  const handleCheckout = () => {

    setMessage(
      "Order Placed Successfully 🎉"
    );

    setShowMessage(true);

    setTimeout(() => {

      setShowMessage(false);

    }, 2500);

    checkoutHandler();

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
                onClick={handleCheckout}
              >

                Checkout

              </button>

            </div>

          </div>

        </>

      )}

    </div>

  );

}

export default Cart;