import Calendar from '../models/Calendar.js';

class CalendarService {
  async getLatestCalendar() {
    return await Calendar.findOne({
      order: [['lastUpdated', 'DESC']]
    });
  }

  async saveCalendar(file, title) {
    const calendar = await Calendar.create({
      title,
      fileName: file.originalname,
      fileData: file.buffer,
      lastUpdated: new Date()
    });

    return calendar;
  }
}

export default new CalendarService();