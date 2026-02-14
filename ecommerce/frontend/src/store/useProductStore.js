import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      console.log("Product created", res.data);
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong");
      set({ loading: false });
      console.log(error);
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      console.log("Get products api connected successfully", response.data);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productid) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${productid}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productid,
        ),
        loading: false,
      }));
      console.log("Product delete api called, response is", res);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (productid) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productid}`);
      // this will update the isfeatured prop of the product
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productid
            ? { ...product, isfeatured: response.data.isfeatured }
            : product,
        ),
        loading: false,
      }));
      console.log("togglefeatured product connected", response);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data, loading: false });
      console.log(
        "Fetch products by category api called, data is",
        response.data,
      );
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      console.log("fetchFeatured products api called", response.data);
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
    }
  },
}));
