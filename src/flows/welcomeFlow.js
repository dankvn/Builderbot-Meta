import { addKeyword, EVENTS } from '@builderbot/bot';
import flowUserNotRegistered from "./flowUserNotRegistered.js"
import flowRegistered from "./flowRegistered.js";
import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(
  "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
);

const welcomeFlow = addKeyword(EVENTS.WELCOME)
.addAnswer('Welcome!', null, async (ctx, { gotoFlow }) => {
  // db.get(...)
  
  const userId = ctx.chat_id
      console.log(
        "consultando en base de datos si existe el numero registrado...."
      );

      const ifExist = await googlesheet.validatePhoneNumber(userId);
      console.log(ifExist);

      if (ifExist) {
        return gotoFlow(flowRegistered); // Si está registrado, ir al flujo de registrados
      } else {
        return gotoFlow(flowUserNotRegistered); // Si no está registrado, ir al flujo de no registrados
      }
});


export default welcomeFlow;
   