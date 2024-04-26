import { addKeyword, EVENTS } from '@builderbot/bot';
import flowUserNotRegistered from "./flowUserNotRegistered.js"
import flowRegistered from "./flowRegistered.js";
import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(
  "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
);

const welcomeFlow = addKeyword(EVENTS.WELCOME)
.addAnswer('Bienvenidos 🤖', null, async (ctx, { state, gotoFlow }) => {
 
  const telefono = ctx.from;
  console.log("Número de teléfono:", telefono);
      console.log(
        "consultando en base de datos si existe el numero registrado...."
      );

      const userData = await googlesheet.validatePhoneNumber(telefono);
      console.log("Resultado de la consulta en la hoja de cálculo:", userData);

      if (userData !== null) { // Si se encontraron datos
        await state.update({ registration: true, userData }); // Actualizar el estado con los datos del usuario
        return gotoFlow(flowRegistered); // Redireccionar al flujo flowRegistered
      } else {
        return gotoFlow(flowUserNotRegistered); // Redireccionar al flujo flowUserNotRegistered
      }

});


export default welcomeFlow;
   