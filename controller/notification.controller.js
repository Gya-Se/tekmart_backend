const Notification = require('../models/notification.model');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all notifications for a user
const getUserNotifications =asyncHandler (async (req, res) => {
  const userId = req.params.userId;
  validateMongoDbId(userId);
  try {
    const notifications = await Notification.find({ user: userId });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
const markNotificationAsRead =asyncHandler (async (req, res) => {
  const notificationId = req.params.id;
  validateMongoDbId(notificationId);
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete notification
const deleteNotification =asyncHandler (async (req, res) => {
  const notificationId = req.params.id;
  validateMongoDbId(notificationId)
  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
};