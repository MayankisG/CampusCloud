import Announcement from '../models/Announcement.js';

class AnnouncementService {
  async sendAnnouncement(announcementData) {
    return await Announcement.create(announcementData);
  }

  async getAllAnnouncements() {
    return await Announcement.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getCurrentAnnouncement() {
    return await Announcement.findOne({
      order: [['id', 'ASC']]
    });
  }

  async deleteAnnouncement(id) {
    return await Announcement.destroy({ where: { id } });
  }
}

export default new AnnouncementService();