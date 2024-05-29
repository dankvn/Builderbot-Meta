import GoogleCalendarService from "../services/calendar/index.js"
import { addKeyword, EVENTS } from "@builderbot/bot";

const userEmail = 'dannyelctro@gmail.com';

const calendarService = new GoogleCalendarService(userEmail);

const calendarFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async () => {

    const events = await calendarService.listEvents();
    console.log('Upcoming events:', events);
      // Crear un nuevo evento
  
  })

  export default calendarFlow;
