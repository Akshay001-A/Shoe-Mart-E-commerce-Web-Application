import "./Orders.css";

function Orders({

  orders,

  updateOrderStatus,

}) {

  return (

    <div className="orders-page">

      <h1 className="orders-title">
        Customer Orders 📦
      </h1>

      <div className="orders-container">

        {orders.length === 0 ? (

          <p className="no-orders">
            No Orders Found
          </p>

        ) : (

          orders.map((order) => (

            <div
              key={order._id}
              className="order-card"
            >

              {/* LEFT */}

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

                <p className="status-text">

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

              {/* RIGHT */}

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

  );

}

export default Orders;