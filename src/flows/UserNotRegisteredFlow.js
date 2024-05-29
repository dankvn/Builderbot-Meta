import { addKeyword, EVENTS } from '@builderbot/bot';

import GoogleSheetService from "../services/Sheets/index.js";
import menuFlow from './menuFlow.js';

const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

  const UserNotRegisteredFlow= addKeyword(EVENTS.ACTION)
  .addAnswer('Para acceder al bot tienes que registarte 📝')

  .addAnswer('¿Cuál es tu nombre?', { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body }); 
})
.addAnswer('¿Cuál es tu email?', { capture: true }, async (ctx, { state ,fallBack,  }) => {
    await state.update({ email: ctx.body });  
    if (!ctx.body.includes('@')) {
      return fallBack(`Ups! email no valido ❌...\nIngresa un email que contenga @...✏`);
     
    } else {
      // 
    }
  })

.addAnswer('Tus datos son:', null, async (ctx, { gotoFlow,flowDynamic, state }) => {
    const nombre = state.get('name');
    const email = state.get('email');
    const telefono = ctx.from;
    // Guardar los datos en Google Sheets
    await googlesheet.guardarDatosUsuario(nombre,email,telefono);
    await flowDynamic(`Nombre: ${nombre}\nEmail: ${email}`);

    if (googlesheet !== null) { // Si se encontraron datos
      await state.update({ registration: true, googlesheet }); // Actualizar el estado con los datos del usuario
      await flowDynamic([
        { media:'https://i.imgur.com/10tt1be.jpeg'}
    ]);
      await flowDynamic(`Bienvenido *${nombre}* 👋`);
      return gotoFlow(menuFlow); // Redireccionar al flujo flowRegistered
    }
})

  export default UserNotRegisteredFlow