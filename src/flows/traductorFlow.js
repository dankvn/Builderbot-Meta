import { G4F } from "g4f";

import { addKeyword } from "@builderbot/bot";
const g4f = new G4F();

const traductorFlow = addKeyword(["3"])
  .addAnswer("Ingresa la frase a traducior")
  .addAction({ capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body });
    console.log;
    ({ name: ctx.body });
    const text = ctx.body;
    const options = {
      text: `${text}`,
      source: "es",
      target: "en",
    };

    const response = await g4f.translation(options);
    console.log(response);

    
  })

  .addAnswer(`Tu traducion es:`,async (ctx, {flowDynamic})=> {
    const text = ctx.body;
    const options = {
        text: `${text}`,
        source: "es",
        target: "en",
      };
    const response = await g4f.translation(options);
    const translationResult = response.translation.result;
    

    await flowDynamic(translationResult);
    

})
export default traductorFlow;
