import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

class GoogleCalendarService {
  jwtClient = undefined;
  calendar = undefined;

  constructor(userEmail) {
    this.jwtClient = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: SCOPES,
      subject: userEmail,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.jwtClient });
  }

  async listEvents(calendarId = 'primary') {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async createEvent(calendarId = 'primary', event) {
    try {
      const response = await this.calendar.events.insert({
        calendarId,
        resource: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async deleteEvent(calendarId = 'primary', eventId) {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export default GoogleCalendarService;
