import { addKeyword, EVENTS } from '@builderbot/bot';
import GoogleSheetService from "../services/sheets/index.js";
import flowmenu from './flowmenu.js';
import flowUserNotRegistered from './flowUserNotRegistered.js';


const googlesheet = new GoogleSheetService(
  "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
);


const flowRegistered = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { state,flowDynamic, gotoFlow}) => {
  const telefono = ctx.from;
  const ifExist = await googlesheet.validatePhoneNumber(telefono);

  const mensaje = `👋Hola ${ifExist?.Nombre}, soy tu asistente virtual `;
  await flowDynamic(mensaje);

  if (ifExist === true) {
    await state.update({registration: true})
      return gotoFlow(flowmenu);
    }
    if (ifExist === null){
      return gotoFlow(flowUserNotRegistered)
    }

  
});
export default flowRegistered 
