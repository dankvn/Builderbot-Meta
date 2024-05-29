import { addKeyword} from '@builderbot/bot';
import GoogleSheetService from "../services/Sheets/index.js";
import menuFlow from "./menuFlow.js";

import UserNotRegisteredFlow from './UserNotRegisteredFlow.js';


const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

const UserYesRegister = addKeyword('red')

.addAction( async (ctx, { state,gotoFlow, flowDynamic}) => {
  const telefono = ctx.from;
  const userData  = await googlesheet.validatePhoneNumber(telefono);
  
  const mensaje = `${userData?.Nombre}, soy tu asistente virtual 🙌 `;
  await flowDynamic(mensaje);
  
    if (userData !== null) { // Si se encontraron datos
      await state.update({ registration: true, userData }); // Actualizar el estado con los datos del usuario
      return gotoFlow(menuFlow); // Redireccionar al flujo flowRegistered
    } else {
      return gotoFlow(UserNotRegisteredFlow); // Redireccionar al flujo flowUserNotRegistered
    }
    
})



export default UserYesRegister
