import { addKeyword, EVENTS } from '@builderbot/bot';


  const flowUserNotRegistered= addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Para acacceder al bot tienes que registarte.Cual es tu nombre..??",
    
  
  );

  export default flowUserNotRegistered