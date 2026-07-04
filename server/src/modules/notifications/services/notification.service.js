class NotificationService {
  async notify(recipientId, title, message, type = "info") {
    console.log(`[NOTIFICATION] To: ${recipientId} | ${title} — ${message}`);
    return { recipientId, title, message, type };
  }
}

export default new NotificationService();
