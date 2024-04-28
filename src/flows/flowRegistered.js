import { addKeyword, EVENTS } from '@builderbot/bot';
import GoogleSheetService from "../services/sheets/index.js";
import flowmenu from './flowmenu.js';
import flowUserNotRegistered from './flowUserNotRegistered.js';


const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

const flowRegistered = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { state,flowDynamic, gotoFlow}) => {
  const telefono = ctx.from;
  const userData  = await googlesheet.validatePhoneNumber(telefono);

  const mensaje = `👋Hola ${userData ?.Nombre}, soy tu asistente virtual `;
  await flowDynamic(mensaje);
  
    if (userData !== null) { // Si se encontraron datos
      await state.update({ registration: true, userData }); // Actualizar el estado con los datos del usuario
      return gotoFlow(flowmenu); // Redireccionar al flujo flowRegistered
    } else {
      return gotoFlow(flowUserNotRegistered); // Redireccionar al flujo flowUserNotRegistered
    }
  
});
export default flowRegistered 
