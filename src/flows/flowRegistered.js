import { addKeyword } from '@builderbot/bot';

import flowmenu from "./flowmenu.js"
import flowerro from "./flowerro.js"

import GoogleSheetService from "./services/sheets/index.js";
const googlesheet = new GoogleSheetService(
    "1sjSk6t983zc9ZeojTdiLn67tN4W854Ekcjq75Dwfga8"
  );

const flowRegistered = addKeyword('register')
.addKeyword("USUARIOS_REGISTRADOS")
.addAction(async (ctx, { flowDynamic, gotoFlow }) => {
  const telefono = ctx.from;
  const ifExist = await googlesheet.validatePhoneNumber(telefono);
  const mensaje = `👋Hola ${ifExist.Nombre}, soy tu asistente virtual `;

  await flowDynamic(mensaje);
  if (ifExist) {
    return gotoFlow(flowmenu); // Si está registrado, ir al flujo de registrados
  } else {
    return gotoFlow(flowerro); // Si no está registrado, ir al flujo de no registrados
  }
});

export default flowRegistered 
