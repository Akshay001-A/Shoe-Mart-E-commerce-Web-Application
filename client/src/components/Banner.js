import "./Banner.css";

function Banner({
  currentSlide,
  nextSlide,
  prevSlide,
}) {

  return (

    <div className="banner-slider">

      {/* LEFT BUTTON */}
      <button
        className="slider-btn left-btn"
        onClick={prevSlide}
      >
        ❮
      </button>

      {/* TRACK */}
      <div
        className="slides-track"
        style={{
          transform:
            `translateX(-${currentSlide * 100}%)`
        }}
      >

        {/* SLIDE 1 */}
        <div className="slide-card nike-slide">

          <div className="slide-content">

            <h1>Nike Air Max</h1>

            <p>
              Feel the speed and comfort
            </p>

            <button>
              Shop Now
            </button>

          </div>

          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt="Nike"
          />

        </div>

        {/* SLIDE 2 */}
        <div className="slide-card adidas-slide">

          <div className="slide-content">

            <h1>Adidas Ultraboost</h1>

            <p>
              Premium running collection
            </p>

            <button>
              Explore
            </button>

          </div>

          <img
            src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
            alt="Adidas"
          />

        </div>

        {/* SLIDE 3 */}
        <div className="slide-card puma-slide">

          <div className="slide-content">

            <h1>Puma Sports</h1>

            <p>
              Stylish everyday wear
            </p>

            <button>
              Buy Now
            </button>

          </div>

          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772"
            alt="Puma"
          />

        </div>

      </div>

      {/* RIGHT BUTTON */}
      <button
        className="slider-btn right-btn"
        onClick={nextSlide}
      >
        ❯
      </button>

    </div>

  );

}

export default Banner;