import BaseRepository from "../../../core/repositories/BaseRepository.js";
import Notification from "../models/notification.model.js";

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findUnreadByRecipient(recipientId) {
    return await this.model
      .find({ recipientId, read: false })
      .sort({ createdAt: -1 });
  }

  async countUnread(recipientId) {
    return await this.model.countDocuments({ recipientId, read: false });
  }

  async markAllAsRead(recipientId) {
    return await this.model.updateMany(
      { recipientId, read: false },
      { read: true, readAt: new Date() }
    );
  }
}

export default new NotificationRepository();
