import "./Navbar.css";

function Navbar({

  setShowCart,
  setShowProfile,
  setShowAdminProducts,
  setShowOrders,

}) {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return (

    <nav className="navbar">

      <h2 className="logo">
        Shoe Mart
      </h2>

      <div className="nav-links">

        <button
          onClick={() => {

            setShowCart(false);

            setShowProfile(false);

            setShowAdminProducts(false);

            setShowOrders(false);

          }}
        >
          Home
        </button>

        <button
          onClick={() => {

            setShowCart(true);

            setShowProfile(false);

            setShowAdminProducts(false);

            setShowOrders(false);

          }}
        >
          Cart
        </button>

        <button
          onClick={() => {

            setShowProfile(true);

            setShowCart(false);

            setShowAdminProducts(false);

            setShowOrders(false);

          }}
        >
          Profile
        </button>

        {userInfo?.isAdmin && (

          <>

            <button
              onClick={() => {

                setShowAdminProducts(true);

                setShowCart(false);

                setShowProfile(false);

                setShowOrders(false);

              }}
            >
              Add Shoes
            </button>

            <button
              onClick={() => {

                setShowOrders(true);

                setShowCart(false);

                setShowProfile(false);

                setShowAdminProducts(false);

              }}
            >
              Orders
            </button>

          </>

        )}

      </div>

    </nav>

  );
}

export default Navbar;