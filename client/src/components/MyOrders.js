import "./MyOrders.css";

function MyOrders({

  myOrders,

}) {

  return (

    <div className="myorders-page">

      <h1 className="myorders-title">

        My Orders 📦

      </h1>

      <div className="myorders-container">

        {myOrders.length === 0 ? (

          <p className="no-orders">

            No Orders Found

          </p>

        ) : (

          myOrders.map((order) => (

            <div
              key={order._id}
              className="myorder-card"
            >

              {/* LEFT */}

              <div className="myorder-left">

  <div className="order-summary-card">

    <h2>

      Order Summary

    </h2>

    <p>

      <span>Total:</span>

      ₹{order.totalPrice}

    </p>

    <p>

      <span>Items:</span>

      {order.orderItems.length}

    </p>

    <p>

      <span>Status:</span>

    </p>

    <div className="myorder-status">

      {order.orderStatus}

    </div>

  </div>

</div>

              {/* RIGHT */}

              <div className="myorder-right">

                <h3>
                  Products:
                </h3>

                <div className="myorder-items">

                  {order.orderItems.map(

                    (item, index) => (

                      <div
                        key={index}
                        className="myorder-item"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div className="myorder-item-details">

  <h4>

    {item.name}

  </h4>

  <p>

    Price:
    ₹{item.price}

  </p>

  <p>

    Quantity:
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

  );

}

export default MyOrders;