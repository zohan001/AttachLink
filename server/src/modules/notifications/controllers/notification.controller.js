import notificationService from "../services/notification.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class NotificationController {
  async getMy(req, res, next) {
    try {
      const notifications = await notificationService.getMy(req.user.id);

      return responseBuilder.success(
        res,
        notifications,
        "Notifications retrieved successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);

      return responseBuilder.success(res, { unread: count }, "Unread count retrieved.");
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

      return responseBuilder.success(res, notification, "Notification marked as read.");
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);

      return responseBuilder.success(
        res,
        result,
        `Marked ${result.markedAsRead} notifications as read.`
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
