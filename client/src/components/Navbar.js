import "./Navbar.css";

function Navbar({

  setActivePage,

  search,
  setSearch,

  setAiResults,

  aiResults,

  products,

  setTopMessage,

  setShowTopMessage,

}) {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  // CHECK AI RESULTS

  const hasAiResults =
    aiResults.length > 0;

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

        {/* IMAGE SEARCH BUTTON */}

        <label className="image-search-btn">

          📷

          <input
            type="file"
            accept="image/*"
            hidden

            onChange={async (e) => {

              const file =
                e.target.files[0];

              if (!file) return;

              const formData =
                new FormData();

              formData.append(
                "image",
                file
              );

              try {

                const response =
                  await fetch(

                    "http://localhost:5000/api/products/image-search",

                    {

                      method: "POST",

                      body: formData,

                    }

                  );

                const data =
                  await response.json();

              const matchedProducts =

  products.filter((product) => {

    return data.results.some(

      (item) =>

        product._id === item.id

    );

  });

                setAiResults(
                  matchedProducts
                );

                // TOP MESSAGE

                if (
                  matchedProducts.length > 0
                ) {

                  setTopMessage(

                    `${matchedProducts[0].name} Found ✅`

                  );

                } else {

                  setTopMessage(

                    "No Similar Product Found ❌"

                  );

                }

                setShowTopMessage(
                  true
                );

                setTimeout(() => {

                  setShowTopMessage(
                    false
                  );

                }, 3000);

              } catch (error) {

                console.log(error);

                setTopMessage(
                  "Image Search Failed ❌"
                );

                setShowTopMessage(
                  true
                );

                setTimeout(() => {

                  setShowTopMessage(
                    false
                  );

                }, 3000);

              }

            }}

          />

        </label>

        {/* EXIT AI SEARCH BUTTON */}

        {hasAiResults && (

          <button

            className="clear-ai-btn"

            onClick={() => {

              setAiResults([]);

              setTopMessage(
                "AI Search Cleared ✅"
              );

              setShowTopMessage(
                true
              );

              setTimeout(() => {

                setShowTopMessage(
                  false
                );

              }, 3000);

            }}

          >

            Exit

          </button>

        )}

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