import "./Navbar.css";

function Navbar({ setShowCart, setShowProfile }) {

  return (

    <nav className="navbar">

      <h2
        className="logo"
        onClick={() => {
          setShowCart(false);
          setShowProfile(false);
        }}
      >
        Shoe Mart
      </h2>

      <ul className="nav-links">

        <li
          onClick={() => {
            setShowCart(false);
            setShowProfile(false);
          }}
        >
          Home
        </li>

        <li
          onClick={() => {
            setShowCart(true);
            setShowProfile(false);
          }}
        >
          Cart
        </li>

        <li
          onClick={() => {
            setShowProfile(true);
            setShowCart(false);
          }}
        >
          Profile
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;