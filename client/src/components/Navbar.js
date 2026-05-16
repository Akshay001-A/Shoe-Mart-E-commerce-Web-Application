import "./Navbar.css";

function Navbar({

  setActivePage,

  search,
  setSearch,

}) {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return (

    <nav className="navbar">

      {/* LEFT SIDE */}

      <div className="navbar-left">

        {/* LOGO */}

        <h2 className="logo">
          Shoe Mart 👟
        </h2>

        {/* SEARCH BAR */}

        <input
          type="text"
          placeholder="Search shoes..."
          className="navbar-search"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      {/* RIGHT SIDE */}

      <div className="nav-links">

        {/* HOME */}

        <button
          onClick={() =>
            setActivePage("home")
          }
        >
          Home
        </button>

        {/* CUSTOMER NAVBAR */}

        {!userInfo?.isAdmin && (

          <>

            <button
              onClick={() =>
                setActivePage("cart")
              }
            >
              Cart
            </button>

            <button
              onClick={() =>
                setActivePage("myorders")
              }
            >
              My Orders
            </button>

            <button
              onClick={() =>
                setActivePage("profile")
              }
            >
              Profile
            </button>

          </>

        )}

        {/* ADMIN NAVBAR */}

        {userInfo?.isAdmin && (

          <>

            <button
              onClick={() =>
                setActivePage("add")
              }
            >
              Add Shoes
            </button>

            <button
              onClick={() =>
                setActivePage("manage")
              }
            >
              Manage Shoes
            </button>

            <button
              onClick={() =>
                setActivePage("orders")
              }
            >
              Orders
            </button>

            <button
              onClick={() =>
                setActivePage("profile")
              }
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