import { addKeyword, EVENTS } from '@builderbot/bot';
import flowmenu from './flowmenu.js';


  const flowUserNotRegistered= addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Para acacceder al bot tienes que registarte.Cual es tu nombre..??",
    
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const { body } = ctx;
      await state.update({ Registration: true, Name: body });
      await flowDynamic(`registarndo en la base de datos `);
      return gotoFlow(flowmenu);
    }
  );

  export default flowUserNotRegistered