import Product from "../model/product.model.js";
import { redis } from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";
export const getallproducts = async (req, res) => {
  try {
    // fetching all products
    const products = await Product.find({});

    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const featuredproducts = async (req, res) => {
  try {
    // checking in redis
    let featuredproducts = await redis.get("featured_products");

    if (featuredproducts) {
      return res.json(JSON.parse(featuredproducts)); // because redis store in form of string
    }

    // not in redis then search in moongodb
    featuredproducts = await Product.find({ isFeatured: true }).lean(); // lean() give as js object instead of a mongodb document good for performance
    if (!featuredproducts) {
      res.status(404).json({ message: "No featured products found" });
    }
    // if got from mongodb store in redis
    await redis.set("featured_products", JSON.stringify(featuredproducts));
    res.json(featuredproducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createproduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryresponse = null;
    if (image) {
      cloudinaryresponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const products = await Product.create({
      name,
      description,
      price,
      image: cloudinaryresponse?.secure_url
        ? cloudinaryresponse.secure_url
        : "",
      category,
    });
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteproduct = async (req, res, next) => {
  try {
    // delete product from db and delete image from cloudinary
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicid = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicid}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        next(error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// not checked
export const getrecommendedproduct = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// not checked
export const getproductbycategory = async (req, res, next) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// togglefeaturedproduct
// not checked
export const togglefeaturedproduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isfeatured = !product.isfeatured;
      const updatedproduct = await product.save();
      await updatefeaturedproductscache();
      res.json(updatedproduct);
    } else {
      return res.status(404).json("No product found");
    }
  } catch (error) {
    next(error);
  }
};

async function updatefeaturedproductscache() {
  try {
    const featuredproducts = await Product.find({ isfeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredproducts));
  } catch (error) {
    console.log("Error in cache", error);
  }
}
