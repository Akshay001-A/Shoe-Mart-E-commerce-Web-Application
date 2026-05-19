import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function useAppState() {
  const [cartItems, setCartItems] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [products, setProducts] = useState([]);
  const [topMessage, setTopMessage] = useState("");
  const [showTopMessage, setShowTopMessage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePage, setActivePage] = useState("home");
  const [myOrders, setMyOrders] = useState([]);
  const [shoeName, setShoeName] = useState("");
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeCategory, setShoeCategory] = useState("");
  const [shoeDescription, setShoeDescription] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [shoeImage, setShoeImage] = useState("");
  const [shoeStock, setShoeStock] = useState("");
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editStock, setEditStock] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [search, setSearch] = useState("");
  const [aiResults, setAiResults] = useState([]);

  // USER INFO
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

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
      console.log(error);
    }
  };

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
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      alert("Product Deleted");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

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
      console.log(error);
      setTopMessage("Update Failed ❌");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);
    }
  };

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
      console.log(error);
      alert("Status Update Failed");
    }
  };

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
      setTopMessage("Shoe Added Successfully");
      setShowTopMessage(true);
      setTimeout(() => {
        setShowTopMessage(false);
      }, 2000);

      setShoeName("");
      setShoeBrand("");
      setShoeCategory("");
      setShoeDescription("");
      setShoePrice("");
      setShoeImage("");
      setShoeStock("");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Shoe");
    }
  };

  const filteredProducts =
    aiResults.length > 0
      ? aiResults
      : products.filter(
          (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        );

  // eslint-disable-next-line
  useEffect(() => {
    fetchProducts();
    if (userInfo) {
      fetchMyOrders();
    }
    if (userInfo?.isAdmin) {
      fetchOrders();
    }

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
