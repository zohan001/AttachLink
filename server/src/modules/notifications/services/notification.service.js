import notificationRepository from "../repositories/notification.repository.js";

class NotificationService {
  async notify(recipientId, title, message, type = "info", data = {}) {
    const notification = await notificationRepository.create({
      recipientId,
      type,
      title,
      message,
      data,
    });

    console.log(
      `[NOTIFICATION] To: ${recipientId} | ${title} — ${message}`
    );

    return notification;
  }

  async getMy(userId) {
    return await notificationRepository.findAllBy("recipientId", userId);
  }

  async getUnreadCount(userId) {
    return await notificationRepository.countUnread(userId);
  }

  async markAsRead(id, userId) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      const { NotFoundError } = await import("../../../core/errors/index.js");
      throw new NotFoundError("Notification not found");
    }

    if (notification.recipientId.toString() !== userId.toString()) {
      const { ForbiddenError } = await import("../../../core/errors/index.js");
      throw new ForbiddenError("You can only mark your own notifications as read");
    }

    return await notificationRepository.update(id, {
      read: true,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId) {
    const count = await notificationRepository.countUnread(userId);

    if (count > 0) {
      await notificationRepository.markAllAsRead(userId);
    }

    return { markedAsRead: count };
  }
}

export default new NotificationService();
