import "./ProductCard.css";

function ProductCard({

  name,
  brand,
  category,
  description,
  price,
  image,
  countInStock,
  addToCart,

}) {

  // GET USER INFO

  const userInfo = JSON.parse(

    localStorage.getItem(
      "userInfo"
    )

  );

  return (

    <div className="product-card">

      <img
        src={image}
        alt={name}
        className="product-image"
      />

      <h2>{name}</h2>

      <p>{brand}</p>

      <p className="category">
        {category}
      </p>

      <p className="description">
        {description}
      </p>

      <h1>₹{price}</h1>
{/* ADMIN ONLY STOCK */}

{userInfo?.isAdmin && (

  <p className="stock">

    Stock: {countInStock}

  </p>

)}

      {/* CUSTOMER ONLY */}

      {!userInfo?.isAdmin && (

        countInStock > 0 ? (

          <button
            onClick={addToCart}
            className="add-cart-btn"
          >

            Add to Cart

          </button>

        ) : (

          <button
            className="out-stock-btn"
            disabled
          >

            Out Of Stock

          </button>

        )

      )}

    </div>

  );

}

export default ProductCard;