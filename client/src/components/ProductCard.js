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
    localStorage.getItem("userInfo")
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

      {/* SHOW STOCK ONLY FOR ADMIN */}

      {userInfo?.isAdmin && (
        <p className="stock">
          Stock: {countInStock}
        </p>
      )}

      <button onClick={addToCart}>
        Add to Cart
      </button>

    </div>

  );

}

export default ProductCard;