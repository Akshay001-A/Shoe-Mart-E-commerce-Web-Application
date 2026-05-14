import "./ProductCard.css";

function ProductCard(props) {

  return (

    <div className="product-card">

      <img
        src={props.image}
        alt={props.name}
        className="product-image"
      />

      <h3>{props.name}</h3>

      <p>{props.brand}</p>

      <h2>₹{props.price}</h2>

      <button onClick={props.addToCart}>
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;