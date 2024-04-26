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
.addAnswer('¿Cuál es tu email?', { capture: true }, async (ctx, { state ,fallBack,  }) => {
    await state.update({ email: ctx.body });  
    if (!ctx.body.includes('@')) {
      return fallBack(`Ups! email no valido ❌...Ingresa un email que contenga @`);
     
    } else {
      // 
    }
  })

.addAnswer('Tus datos son:', null, async (ctx, { flowDynamic, state }) => {
    const nombre = state.get('name');
    const email = state.get('email');
    const telefono = ctx.from;
    // Guardar los datos en Google Sheets
    await googlesheet.guardarDatosUsuario(nombre,email,telefono);

   await flowDynamic(`Nombre: ${nombre}\nEmail: ${email}`);

});
  

  export default flowUserNotRegistered