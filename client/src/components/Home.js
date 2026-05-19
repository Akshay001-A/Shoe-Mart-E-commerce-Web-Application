import Banner from "./Banner";
import ProductCard from "./ProductCard";

function Home({
  search,
  aiResults,
  currentSlide,
  nextSlide,
  prevSlide,
  filteredProducts,
  addToCart,
}) {
  return (
    <>
      {/* HOME PAGE BANNER */}
      {search.trim() === "" && aiResults.length === 0 && (
        <Banner
          currentSlide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
        />
      )}

      {/* PRODUCTS CONTAINER */}
      <div className="products-container">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            brand={product.brand}
            category={product.category}
            description={product.description}
            price={product.price}
            image={product.image}
            countInStock={product.countInStock}
            addToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
