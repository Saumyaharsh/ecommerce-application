import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      console.log("getmycoupon api called", response);
      set({ coupon: response.data });
    } catch (error) {
      console.log("error in feetching get my coupon", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      console.log("getcartitems api called data is", res.data);
      set({ cart: res.data });
      get().calculateTotals();
      console.log("get cart items api called", res.data);
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  addToCart: async (product) => {
    try {
      const res = await axios.post("/cart", { productid: product._id });
      console.log("add to cart api called data is", res.data);
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountpercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },

  removeFromCart: async (productid) => {
    const res = await axios.delete(`/cart`, { data: { productid } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productid),
    }));
    console.log("removefromcart api called data is", res);
    get().calculateTotals();
  },

  updateQuantity: async (productid, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productid);
      return;
    }
    const res = await axios.put(`/cart/${productid}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productid ? { ...item, quantity } : item,
      ),
    }));
    console.log("update quantity api is called response is :", res);
  },

  clearCart: () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
}));
