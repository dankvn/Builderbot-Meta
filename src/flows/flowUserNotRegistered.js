import { addKeyword, EVENTS } from '@builderbot/bot';

import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(
  "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
);

  const flowUserNotRegistered= addKeyword(EVENTS.ACTION)
  .addAnswer('Para acceder al bot tienes que registarte 📝')

  .addAnswer('¿Cuál es tu nombre?', { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body }); 
})
.addAnswer('¿Cuál es tu edad?', { capture: true }, async (ctx, { state }) => {
    await state.update({ age: ctx.body });  
})
.addAnswer('Tus datos son:', null, async (_, { flowDynamic, state }) => {
    const nombre = state.get('name');
    const edad = state.get('age');

    // Guardar los datos en Google Sheets
    await googlesheet.guardarDatosUsuario(nombre, edad);

   await flowDynamic(`Nombre: ${nombre}\nEdad: ${edad}`);

});
  

  export default flowUserNotRegistered