import { addKeyword, EVENTS } from '@builderbot/bot';
import flowRegistered from '../flows/flowRegistered.js';

  const flowUserNotRegistered= addKeyword(EVENTS.ACTION).addAnswer(
    "To register, I need your full name. Please enter your full name.",
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const { body } = ctx;
      await state.update({ Registration: true, Name: body });
      await flowDynamic(`You have been successfully registered.`);
      return gotoFlow(flowRegistered);
    }
  );

  export default flowUserNotRegistered