import { addKeyword, EVENTS } from '@builderbot/bot';

  const flowUserNotRegistered= addKeyword(EVENTS.WELCOME)
  .addAnswer("No esta autorizado para ingrezara al bot");


  export default flowUserNotRegistered