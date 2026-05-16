import "./ManageShoes.css";

function ManageShoes({

  products,

  openEditForm,

  deleteProduct,

  editingProduct,

  editName,
  setEditName,

  editBrand,
  setEditBrand,

  editCategory,
  setEditCategory,

  editDescription,
  setEditDescription,

  editPrice,
  setEditPrice,

  editImage,
  setEditImage,

  editStock,
  setEditStock,

  updateProduct,

  setEditingProduct,

}) {

  return (

    <div className="admin-page">

      {/* TITLE */}

      <h1 className="manage-title">
        Manage Shoes 👟
      </h1>

      {/* PRODUCTS */}

      <div className="manage-products-grid">

        {products.map((product) => (

          <div
            key={product._id}
            className="manage-product-card"
          >

            {/* IMAGE */}

            <div className="manage-image-box">

              <img
                src={product.image}
                alt={product.name}
              />

            </div>

            {/* DETAILS */}

            <div className="manage-product-details">

              <h2>
                {product.name}
              </h2>

              <p className="manage-brand">
                {product.brand}
              </p>

              <p className="manage-category">
                {product.category}
              </p>

              <p className="manage-price">
                ₹{product.price}
              </p>

              <p className="manage-stock">

                Stock:
                {product.countInStock}

              </p>

            </div>

            {/* BUTTONS */}

            <div className="manage-buttons">

              <button
                className="edit-btn"
                onClick={() =>
                  openEditForm(product)
                }
              >

                Edit

              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteProduct(product._id)
                }
              >

                Delete

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EDIT POPUP */}

      {editingProduct && (

        <div className="edit-popup">

          <div className="edit-box">

            <h2>
              Edit Shoe
            </h2>

            <input
              value={editName}
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              placeholder="Shoe Name"
            />

            <input
              value={editBrand}
              onChange={(e) =>
                setEditBrand(
                  e.target.value
                )
              }
              placeholder="Brand"
            />

            <input
              value={editCategory}
              onChange={(e) =>
                setEditCategory(
                  e.target.value
                )
              }
              placeholder="Category"
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              placeholder="Description"
            />

            <input
              value={editPrice}
              onChange={(e) =>
                setEditPrice(
                  e.target.value
                )
              }
              placeholder="Price"
            />

            <input
              value={editImage}
              onChange={(e) =>
                setEditImage(
                  e.target.value
                )
              }
              placeholder="Image URL"
            />

            <input
              value={editStock}
              onChange={(e) =>
                setEditStock(
                  e.target.value
                )
              }
              placeholder="Stock"
            />

            {/* BUTTONS */}

            <div className="popup-buttons">

              <button
                onClick={updateProduct}
              >
                Save Changes
              </button>

              <button
                onClick={() =>
                  setEditingProduct(null)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ManageShoes;