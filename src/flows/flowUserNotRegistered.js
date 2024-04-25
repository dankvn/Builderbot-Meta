import { addKeyword, EVENTS } from '@builderbot/bot';
import flowRegistered from '../flows/flowRegistered.js';

  const flowUserNotRegistered= addKeyword(EVENTS.ACTION).addAnswer(
    "para aceereder al bot regisatre...👍 .",
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const { body } = ctx;
      await state.update({ Registration: true, Name: body });
      await flowDynamic(`You have been successfully registered.`);
      return gotoFlow(flowRegistered);
    }
  );

  export default flowUserNotRegistered