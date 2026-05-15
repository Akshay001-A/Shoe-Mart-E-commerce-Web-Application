import "./Navbar.css";

function Navbar({

  setShowCart,
  setShowProfile,
  setShowAdminProducts,
  setShowOrders,
  setShowManageShoes,

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

            setShowManageShoes(false);

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

            setShowManageShoes(false);

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

            setShowManageShoes(false);

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

                setShowManageShoes(false);

              }}
            >
              Add Shoes
            </button>

            <button
              onClick={() => {

                setShowManageShoes(true);

                setShowCart(false);

                setShowProfile(false);

                setShowAdminProducts(false);

                setShowOrders(false);

              }}
            >
              Manage Shoes
            </button>

            <button
              onClick={() => {

                setShowOrders(true);

                setShowCart(false);

                setShowProfile(false);

                setShowAdminProducts(false);

                setShowManageShoes(false);

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