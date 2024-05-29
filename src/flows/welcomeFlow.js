import { addKeyword, EVENTS } from "@builderbot/bot";
import UserNotRegisteredFlow from "./UserNotRegisteredFlow.js";
import UserYesRegisterFlow from "./UserYesRegisterFlow.js";
import GoogleSheetService from "../services/sheets/index.js";

const googlesheet = new GoogleSheetService(process.env.SHEET_TOKEN);

const welcomeFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { state, endFlow }) => {
    {
      //inicio de parar el welcomeflow
      const hasWelcomed = state.get("welcomed");
      console.log("hasWelcomed1:", hasWelcomed);
      if (hasWelcomed) return endFlow(); // Si ya ha dado la bienvenida, se sale del flujo
      await state.update({ welcomed: true }); // Marca que el usuario ya ha sido recibido
    } //fin de parar el welcomeflow
  })
  .addAction(async (ctx, { provider }) => {
    const to = ctx.from;
    await provider.sendReaction(to, {
      message_id: ctx.wamid,
      emoji: "🫡",
    });
  })

  .addAnswer(`*Bienvenido* 😀`, { media: "https://i.imgur.com/10tt1be.jpeg" })
  .addAction(null, async (ctx, { state, gotoFlow }) => {
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
      return gotoFlow(UserYesRegisterFlow); // Redireccionar al flujo flowRegistered
    } else {
      return gotoFlow(UserNotRegisteredFlow); // Redireccionar al flujo flowUserNotRegistered
    }
  });

export default welcomeFlow;
