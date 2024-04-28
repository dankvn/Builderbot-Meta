import { addKeyword, EVENTS } from '@builderbot/bot';
import flowUserNotRegistered from "./flowUserNotRegistered.js"
import flowRegistered from "./flowRegistered.js";
import GoogleSheetService from "../services/sheets/index.js";
import { GPTFREE } from "gpt4free-plugin";

const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

const gpt = new GPTFREE();
const welcomeFlow = addKeyword(EVENTS.WELCOME)
.addAnswer('🤖', null, async (ctx, { state, gotoFlow, flowDynamic }) => {
  const messages = [
    { role: "assistant", content: "" },
    { role: "user", content: text },
  ];
  const options = {
    model: "gpt-4",
    prompt: ` El cliente escribira y tu "${text}"
    saludaras de distintas formas al cliente  `,
  };
  const text = ctx.body;
  const telefono = ctx.from;
  const response = await gpt.chatCompletions(messages, options);
  
      console.log(
        `${new Date()}\nPregunta: ${text} \nRespuesta: ${response}`
      );
  
      await flowDynamic(response);

  console.log("Número de teléfono:", telefono);
      
      const userData = await googlesheet.validatePhoneNumber(telefono);
      console.log(`${new Date()} Resultado de la consulta en la hoja de cálculo:`, userData);

      if (userData !== null) { // Si se encontraron datos
        await state.update({ registration: true, userData }); // Actualizar el estado con los datos del usuario
        return gotoFlow(flowRegistered); // Redireccionar al flujo flowRegistered
      } else {
        return gotoFlow(flowUserNotRegistered); // Redireccionar al flujo flowUserNotRegistered
      }

      
    
});


export default welcomeFlow;
   