import { addKeyword, EVENTS } from "@builderbot/bot";
import flowUserNotRegistered from "./flowUserNotRegistered.js";
import flowRegistered from "./flowRegistered.js";
import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

const welcomeFlow = addKeyword(EVENTS.WELCOME)
  .addAnswer(`Bienvenidos .🤖`, {
    media: "https://imgur.com/6gFJoMB",
  })
  .addAnswer( null, async (ctx, { state, gotoFlow }) => {
    const telefono = ctx.from;
    
    console.log("Número de teléfono:", telefono);

    const userData = await googlesheet.validatePhoneNumber(telefono);
    console.log(
      `${new Date()} Resultado de la consulta en la hoja de cálculo:`,
      userData
    );
   
    if (userData !== null) {
      // Si se encontraron datos
      await state.update({ registration: true, userData }); // Actualizar el estado con los datos del usuario
      return gotoFlow(flowRegistered); // Redireccionar al flujo flowRegistered
    } else {
      return gotoFlow(flowUserNotRegistered); // Redireccionar al flujo flowUserNotRegistered
    }
   
  }
 
)
  

export default welcomeFlow;
