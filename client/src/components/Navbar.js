import "./Navbar.css";

function Navbar({

  setShowCart,
  setShowProfile,
  setShowAdminProducts,
  setShowOrders,
  setShowManageShoes,
  setShowMyOrders,

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

  {/* HOME */}

  <button
    onClick={() => {

      setShowCart(false);

      setShowProfile(false);

      setShowAdminProducts(false);

      setShowOrders(false);

      setShowManageShoes(false);

      setShowMyOrders(false);

    }}
  >
    Home
  </button>

  {/* CUSTOMER NAVBAR */}

  {!userInfo?.isAdmin && (

    <>

      <button
        onClick={() => {

          setShowCart(true);

          setShowProfile(false);

          setShowAdminProducts(false);

          setShowOrders(false);

          setShowManageShoes(false);

          setShowMyOrders(false);

        }}
      >
        Cart
      </button>

      <button
        onClick={() => {

          setShowMyOrders(true);

          setShowCart(false);

          setShowProfile(false);

          setShowAdminProducts(false);

          setShowManageShoes(false);

          setShowOrders(false);

        }}
      >
        My Orders
      </button>

      <button
        onClick={() => {

          setShowProfile(true);

          setShowCart(false);

          setShowAdminProducts(false);

          setShowOrders(false);

          setShowManageShoes(false);

          setShowMyOrders(false);

        }}
      >
        Profile
      </button>

    </>

  )}

  {/* ADMIN NAVBAR */}

  {userInfo?.isAdmin && (

    <>

      <button
        onClick={() => {

          setShowAdminProducts(true);

          setShowCart(false);

          setShowProfile(false);

          setShowOrders(false);

          setShowManageShoes(false);

          setShowMyOrders(false);

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

          setShowMyOrders(false);

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

          setShowMyOrders(false);

        }}
      >
        Orders
      </button>

      <button
        onClick={() => {

          setShowProfile(true);

          setShowCart(false);

          setShowAdminProducts(false);

          setShowOrders(false);

          setShowManageShoes(false);

          setShowMyOrders(false);

        }}
      >
        Profile
      </button>

    </>

  )}

</div>

    </nav>

  );

}

export default Navbar;