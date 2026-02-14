import User from "../model/user.model.js";

export const getanalyticsdata = async () => {
  const totalusers = await User.countDocuments();
  const totalproducts = await Product.countDocuments();

  const salesdata = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together
        totalsales: { $sum: 1 },
        totalrevenue: { $sum: "$totalamount" },
      },
    },
  ]);
  const { totalsales, totalrevenue } = salesdata[0] || {
    totalsales: 0,
    totalrevenue: 0,
  };
  return {
    users: totalusers,
    products: totalproducts,
    totalsales,
    totalrevenue,
  };
};

export const getdailysalesdata = async (startdate, enddate) => {};
