/**
 * =================================================================================
 * CUSTOM REACT STATE MANAGER HOOK (useAppState.js)
 * =================================================================================
 * 
 * WHAT IT DOES:
 * This custom hook functions as the central nervous system of the React frontend.
 * It manages:
 * 1. Global state properties (e.g. cart lists, catalog arrays, admin controls).
 * 2. Asynchronous API fetch query requests (fetching products, customer orders, and status updates).
 * 3. Shopping cart logic (adding, quantity scaling, and removal computations).
 * 4. Silent interceptors to automatically clean up sessions if authorization tokens expire.
 * 
 * WHY WE USE IT:
 * Standardizes state control. Instead of cluttering App.js or drilling props through 
 * dozens of levels, all state logic is compiled here and easily extracted globally.
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function useAppState() {
  // --- CORE UI & CATALOG STATES ---
  const [cartItems, setCartItems] = useState([]); // Array containing user basket items
  const [showRegister, setShowRegister] = useState(false); // Controls Login/Register page toggles
  const [products, setProducts] = useState([]); // Complete catalog array fetched from MongoDB
  const [topMessage, setTopMessage] = useState(""); // Dynamic text content of top notification toast
  const [showTopMessage, setShowTopMessage] = useState(false); // Controls visibility of top notification toast
  const [currentSlide, setCurrentSlide] = useState(0); // Active index of rotating landing slider
  const [activePage, setActivePage] = useState("home"); // Controls page router targets ("home", "cart", etc.)

  // --- USER DATA STATES ---
  const [myOrders, setMyOrders] = useState([]); // List of current logged-in user order documents
  const [orders, setOrders] = useState([]); // List of global store orders (Visible to Admins only)

  // --- ADMIN CREATE SHOE STATES ---
  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeCategory, setShoeCategory] = useState("");
  const [shoeDescription, setShoeDescription] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeImage, setShoeImage] = useState("");
  const [shoeStock, setShoeStock] = useState("");

  // --- ADMIN EDIT SHOE STATES ---
  const [editingProduct, setEditingProduct] = useState(null); // Reference to active shoe model under edit
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editStock, setEditStock] = useState("");

  // --- CHECKOUT & FILTER STATES ---
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" (Cash on Delivery) or "Card"
  const [search, setSearch] = useState(""); // Current keyboard text search value
  const [aiResults, setAiResults] = useState([]); // Vision matched items returned from OpenCLIP server

  // Fetch logged-in credentials from browser localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ROTATING SLIDER UTILITIES
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  // ===============================================================================
  // 1. ASYNCHRONOUS DATA FETCHER CALLBACKS
  // ===============================================================================

  // Fetch global transaction orders (Admin role checked by Bearer token)
  const fetchOrders = async () => {
    try {
      const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${userInfoLocal.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("fetchOrders error:", error.message);
    }
  };

  // Fetch transaction history of logged-in user only
  const fetchMyOrders = async () => {
    try {
      const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${userInfoLocal.token}`,
        },
      });
      setMyOrders(data);
    } catch (error) {
      console.error("fetchMyOrders error:", error.message);
    }
  };

  // Fetch entire catalog products list from MongoDB
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      console.error("fetchProducts error:", error.message);
    }
  };

  // ===============================================================================
  // 2. SHOPPING CART LOGIC PIPELINES
  // ===============================================================================

  // Append items to cart array, validating remaining warehouse quantities
  const addToCart = (product) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id
            ? {
                ...x,
                quantity:
                  x.quantity + 1 <= x.countInStock
                    ? x.quantity + 1
                    : x.quantity,
              }
            : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    setTopMessage(`${product.name} Added To Cart 🛒`);
    setShowTopMessage(true);
    setTimeout(() => {
      setShowTopMessage(false);
    }, 2000);
  };

  // Adjust item amounts (increase / decrease) directly from the shopping basket view
  const updateQuantity = (id, action) => {
    setCartItems(
      cartItems.map((item) => {
        if (item._id === id) {
          if (action === "increase" && item.quantity < item.countInStock) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          if (action === "decrease" && item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
        }
        return item;
      })
    );
  };

  // Remove targeted shoe entry from basket list
  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  // ===============================================================================
  // 3. ADMIN CONTROL ACTIONS (CRUD)
  // ===============================================================================

  // Remove shoe model listing entirely from MongoDB database
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      alert("Product Deleted Successfully");
    } catch (error) {
      console.error(error);
      alert("Delete Action Failed");
    }
  };

  // Mount product values to Edit state hooks to open editor overlay
  const openEditForm = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditBrand(product.brand);
    setEditCategory(product.category);
    setEditDescription(product.description);
    setEditPrice(product.price);
    setEditImage(product.image);
    setEditStock(product.countInStock);
  };

  // Save modified product configurations back to database
  const updateProduct = async () => {
    try {
      const updatedData = {
        name: editName,
        brand: editBrand,
        category: editCategory,
        description: editDescription,
        price: editPrice,
        image: editImage,
        countInStock: editStock,
      };

      await axios.put(
        `${API_URL}/api/products/${editingProduct._id}`,
        updatedData
      );

      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
      setEditingProduct(null);

      setTopMessage("Product Updated Successfully ✅");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setTopMessage("Update Action Failed ❌");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);
    }
  };

  // Transition global shipping order status label (Pending -> Shipped -> Delivered)
  const updateOrderStatus = async (orderId, status) => {
    try {
      const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { orderStatus: status },
        {
          headers: {
            Authorization: `Bearer ${userInfoLocal.token}`,
          },
        }
      );
      fetchOrders();
      setTopMessage("Order Status Updated ✅");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Status Update Action Failed");
    }
  };

  // Upload and write a new shoe model listing into Mongoose databases
  const addNewShoe = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/api/products`, {
        name: shoeName,
        brand: shoeBrand,
        category: shoeCategory,
        description: shoeDescription,
        price: shoePrice,
        image: shoeImage,
        countInStock: shoeStock,
      });

      setProducts([...products, data]);
      setTopMessage("Shoe Added Successfully ✅");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);

      // Clean creator form states
      setShoeName("");
      setShoeBrand("");
      setShoeCategory("");
      setShoeDescription("");
      setShoePrice("");
      setShoeImage("");
      setShoeStock("");
    } catch (error) {
      console.error(error);
      alert("Failed To Add Product Listing");
    }
  };

  // ===============================================================================
  // 4. COMPUTED FILTERS & EFFECT LIFECYCLES
  // ===============================================================================

  // Compute active filtered listings list
  // Uses high-speed visual vector results if OpenCLIP returned items, else defaults to standard search text filters
  const filteredProducts =
    aiResults.length > 0
      ? aiResults
      : products.filter(
          (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        );

  useEffect(() => {
    fetchProducts();
    if (userInfo) {
      fetchMyOrders();
    }
    if (userInfo?.isAdmin) {
      fetchOrders();
    }

    // 🔒 AXIOS INTERCEPTOR ROUTE
    // Automatically catches 401 Unauthorized API responses from server, clears browser session tokens, 
    // and returns the shopper safely back to the Login gateway (prevents system hang situations)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo");
          setTopMessage("Session Expired. Please log in again. 🔒");
          setShowTopMessage(true);
          setTimeout(() => {
            setShowTopMessage(false);
            window.location.reload();
          }, 2500);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return {
    cartItems,
    setCartItems,
    showRegister,
    setShowRegister,
    products,
    setProducts,
    topMessage,
    setTopMessage,
    showTopMessage,
    setShowTopMessage,
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    activePage,
    setActivePage,
    myOrders,
    setMyOrders,
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
    orders,
    setOrders,
    editingProduct,
    setEditingProduct,
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
    paymentMethod,
    setPaymentMethod,
    search,
    setSearch,
    aiResults,
    setAiResults,
    filteredProducts,
    userInfo,
    fetchProducts,
    fetchMyOrders,
    fetchOrders,
    addToCart,
    updateQuantity,
    removeFromCart,
    deleteProduct,
    openEditForm,
    updateProduct,
    updateOrderStatus,
    addNewShoe,
  };
}
