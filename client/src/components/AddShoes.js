import "./AddShoes.css";

function AddShoes({

  shoeName,
  setShoeName,

  shoeBrand,
  setShoeBrand,

  shoeCategory,
  setShoeCategory,

  shoeDescription,
  setShoeDescription,

  shoePrice,
  setShoePrice,

  shoeImage,
  setShoeImage,

  shoeStock,
  setShoeStock,

  addNewShoe,

}) {

  return (

    <div className="admin-page">

      <h1>
        Admin Dashboard 👑
      </h1>

      <h2>
        Add New Shoes
      </h2>

      <div className="admin-form">

        <input
          type="text"
          placeholder="Shoe Name"
          value={shoeName}
          onChange={(e) =>
            setShoeName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Brand"
          value={shoeBrand}
          onChange={(e) =>
            setShoeBrand(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={shoeCategory}
          onChange={(e) =>
            setShoeCategory(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={shoeDescription}
          onChange={(e) =>
            setShoeDescription(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={shoePrice}
          onChange={(e) =>
            setShoePrice(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Image URL"
          value={shoeImage}
          onChange={(e) =>
            setShoeImage(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Count In Stock"
          value={shoeStock}
          onChange={(e) =>
            setShoeStock(e.target.value)
          }
        />

        <button onClick={addNewShoe}>
          Add Shoe
        </button>

      </div>

    </div>

  );

}

export default AddShoes;