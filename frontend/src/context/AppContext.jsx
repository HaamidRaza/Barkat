import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../config/api.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isSeller, setIsSeller] = useState(false);
  const [seller, setSeller] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [reviewSummaries, setReviewSummaries] = useState({});

  const isMounted = useRef(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/user/auth");
      if (data.success) {
        setUser(data.user);
        setIsSeller(
          data.user.role === "seller" && data.user.sellerStatus === "approved",
        );
        if (data.user.cartItems) {
          setCartItems(data.user.cartItems);
        }
      }
    } catch {
      setUser(null);
    }
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/admin/is-auth", {
        withCredentials: true,
      });
      console.log("admin auth check:", data);
      if (data.success) setIsAdmin(true);
      else setIsAdmin(false); // ← explicitly set false on failure
    } catch {
      setIsAdmin(false);
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
        setSeller(data.seller); // { id, name, email }
      }
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/product/all");
      if (data.success) {
        setProducts(data.products.map((p) => ({ ...p, id: p._id })));
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const fetchReviewSummary = useCallback(
    async (targetType, targetId) => {
      const key = `${targetType}_${targetId}`;

      // Return cached if already fetched
      if (reviewSummaries[key]) return reviewSummaries[key];

      try {
        const { data } = await axios.get(`/review/${targetType}/${targetId}`);
        if (data.success) {
          setReviewSummaries((prev) => ({ ...prev, [key]: data.summary }));
          return data.summary;
        }
      } catch {
        return null;
      }
    },
    [reviewSummaries],
  );

  useEffect(() => {
    Promise.all([
      fetchUser(),
      fetchSeller(),
      fetchAdmin(),
      fetchProducts(),
    ]).finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isMounted.current) {
      isMounted.current = true;
      return; // skip first render
    }
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (e) {
        toast.error(e.message);
      }
    };
    updateCart();
  }, [cartItems]);

  const fetchAllProductSummaries = useCallback(
    async (productIds) => {
      // Batch fetch only ones not already cached
      const missing = productIds.filter(
        (id) => !reviewSummaries[`product_${id}`],
      );
      if (!missing.length) return;

      const results = await Promise.allSettled(
        missing.map((id) => axios.get(`/review/product/${id}`)),
      );

      const updates = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value.data.success) {
          updates[`product_${missing[i]}`] = result.value.data.summary;
        }
      });

      setReviewSummaries((prev) => ({ ...prev, ...updates }));
    },
    [reviewSummaries],
  );

  const getReviewSummary = (targetType, targetId) => {
    return reviewSummaries[`${targetType}_${targetId}`] || null;
  };

  const invalidateReviewSummary = (targetType, targetId) => {
    const key = `${targetType}_${targetId}`;
    setReviewSummaries((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Basket!");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Basket Updated!");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from Basket!");
    setCartItems(cartData);
  };

  const clearCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    delete cartData[itemId];
    setCartItems(cartData);
    toast.success("Basket cleared!");
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? sum + product.price * qty : sum;
    }, 0);
  };
  const fetchAllRecipeSummaries = useCallback(
    async (recipeIds) => {
      const missing = recipeIds.filter(
        (id) => !reviewSummaries[`communityRecipe_${id}`],
      );
      if (!missing.length) return;

      const results = await Promise.allSettled(
        missing.map((id) => axios.get(`/review/communityRecipe/${id}`)),
      );

      const updates = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value.data.success) {
          updates[`communityRecipe_${missing[i]}`] = result.value.data.summary;
        }
      });

      setReviewSummaries((prev) => ({ ...prev, ...updates }));
    },
    [reviewSummaries],
  );

  const loginAsAdmin = (userData) => {
    setIsAdmin(true);
    setUser(userData);
    setIsSeller(true);
    setSeller({ name: userData.name, email: userData.email });
  };

  const logoutAdmin = async () => {
    await axios.get("/admin/logout", { withCredentials: true });
    setIsAdmin(false);
    setUser(null);
    setIsSeller(false);
    setSeller(null);
    setCartItems({});
    navigate("/");
  };

  const logout = async () => {
    await axios.get("/user/logout", { withCredentials: true });
    setIsAdmin(false);
    setIsSeller(false);
    setUser(null);
    navigate("/");
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    isAdmin,
    setIsAdmin,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartAmount,
    searchQuery,
    setSearchQuery,
    authReady,
    seller,
    setSeller,
    logout,
    reviewSummaries,
    fetchReviewSummary,
    fetchAllProductSummaries,
    getReviewSummary,
    invalidateReviewSummary,
    fetchAllRecipeSummaries,
    loginAsAdmin,
    logoutAdmin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
