import Coupon from "../model/coupon.model.js";

export const getcoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      userid: req.user._id,
      isactive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    next(error);
  }
};

export const validatecoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userid: req.user._id,
      isactive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (coupon.expirationdate < new Date()) {
      coupon.isactive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountpercentage: coupon.discountpercentage,
    });
  } catch (error) {
    next(error);
  }
};
