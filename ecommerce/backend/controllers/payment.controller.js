import { stripe } from "../config/stripe.js";
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
export const createcheckoutsession = async (req, res, next) => {
  try {
    const { products, couponcode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty products array" });
    }
    let totalamount = 0;
    const lineitems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send data in cents
      totalamount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    let coupon = null;
    if (couponcode) {
      coupon = await Coupon.findOne({
        code: couponcode,
        userid: req.user._id,
        isactive: true,
      });
      if (coupon) {
        totalamount -= Math.round(
          (totalamount * coupon.discountpercentage) / 100,
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineitems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createstripecoupon(coupon.discountpercentage),
            },
          ]
        : [],
      metadata: {
        userid: req.user._id.toString(),
        couponcode: couponcode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });
    if (totalamount >= 20000) {
      await createnewcoupon(req.user._id);
    }
    res.status(200).json({
      url: session.url,
      id: session.id,
      totalamount: totalamount / 100,
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkoutsuccess = async (req, res, next) => {
  try {
    const { sessionid } = req.body;
    const existingOrder = await Order.findOne({
      stripesessionid: sessionid,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        orderid: existingOrder._id,
      });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionid);
    if (session.payment_status === "paid") {
      if (session.metadata.couponcode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponcode,
            userid: session.metadata.userid,
          },
          {
            isactive: false,
          },
        );
      }
      const products = JSON.parse(session.metadata.products);
      const neworder = new Order({
        user: session.metadata.userid,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalamount: session.amount_total / 100, // convert from cents to dollars
        stripesessionid: sessionid,
      });
      await neworder.save();
      res.status(200).json({
        success: true,
        message:
          "Payment successfull, order created, and coupon deactivated if used",
        orderid: neworder._id,
      });
    }
  } catch (error) {
    console.log("Error in checkout-success", error);
    next(error);
  }
};

async function createstripecoupon(discountpercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountpercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createnewcoupon(userid) {
  const newcoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountpercentage: 10,
    expirationdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userid: userid,
  });
  await newcoupon.save();

  return newcoupon;
}
