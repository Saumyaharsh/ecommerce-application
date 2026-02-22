import Notification from "../models/notification.model.js";
export const getnotifications = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const notifications = await Notification.find({ to: userid })
      .sort({ createdAt: -1 })
      .populate({
        path: "from",
        select: "username profileimg",
      });
    await Notification.updateMany({ to: userid }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const deletenotifications = async (req, res, next) => {
  try {
    const userid = req.user._id;
    await Notification.deleteMany({ to: userid });
    res.status(200).json({
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// THIS IS NOT CHECKED INPOSTMAN
export const deleteonenotification = async (req, res, next) => {
  try {
    const notificationid = req.params.id;
    const userid = req.user._id;
    const notification = await Notification.findById(notificationid);
    if (!notification) {
      return res.status(404).json("Notification not found");
    }
    if (!notification.to.toString() !== userid.toString()) {
      return res
        .status(401)
        .json("You cannot delete this notification since you are not sender");
    }
    await Notification.findByIdAndDelete(notificationid);
    res.status(200).json("Notification deleted successfully");
  } catch (error) {
    next(error);
  }
};
