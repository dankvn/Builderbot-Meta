import { addKeyword, EVENTS } from '@builderbot/bot';
import flowUserNotRegistered from "./flowUserNotRegistered.js"
import flowRegistered from "./flowRegistered.js";
import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(
  "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
);

const welcomeFlow = addKeyword(EVENTS.WELCOME)
.addAnswer('Welcome!', null, async (ctx, { state, gotoFlow }) => {
 
  const telefono = ctx.from;
      console.log(
        "consultando en base de datos si existe el numero registrado...."
      );

      const ifExist = await googlesheet.validatePhoneNumber(telefono);
      console.log(ifExist);

      if (ifExist === true) {
      await state.update({registration: true})
        return gotoFlow(flowRegistered);
      }
      if (ifExist === null){
        return gotoFlow(flowUserNotRegistered)
      }

});


export default welcomeFlow;
   