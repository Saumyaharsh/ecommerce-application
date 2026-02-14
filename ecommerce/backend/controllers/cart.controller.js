import Product from "../model/product.model.js";

// not checked
export const addtocart = async (req, res, next) => {
  try {
    const { productid } = req.body;
    const user = req.user;
    console.log(productid);
    console.log(user);
    const existingitem = user.cartitems.find((item) => item.id === productid);
    console.log(existingitem);
    if (existingitem) {
      existingitem.quantity += 1;
    } else {
      console.log("running");
      user.cartitems.push(productid);
    }
    console.log("Bahar ka block");
    await user.save();

    res.json(user.cartitems);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// not checked

export const removeallfromcart = async (req, res, next) => {
  try {
    const { productid } = req.body;
    const user = req.user;
    if (!productid) {
      user.cartitems = [];
    } else {
      user.cartitems = user.cartitems.filter((item) => item.id !== productid);
    }
    await user.save();
    res.json(user.cartitems);
  } catch (error) {
    next(error);
  }
};

// not checked
export const updatequantity = async (req, res, next) => {
  try {
    const { id: productid } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingitem = user.cartitems.find((item) => item.id === productid);
    if (existingitem) {
      if (quantity === 0) {
        user.cartitems = user.cartitems.filter((item) => item.id !== productid);
        await user.save();
        return res.json(user.cartitems);
      }
      existingitem.quantity = quantity;
      await user.save();
      res.json(user.cartitems);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// not checked
export const getcartproducts = async (req, res, next) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartitems } });

    // add quantity for each product
    const cartitems = products.map((product) => {
      const item = req.user.cartitems.find(
        (cartitem) => cartitem.id === product.id,
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartitems);
  } catch (error) {
    next(error);
  }
};
