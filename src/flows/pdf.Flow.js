import { addKeyword, EVENTS } from "@builderbot/bot";
import { pdfQuery } from "../services/pdf/index.js";
import menuFlow from "./menuFlow.js";

const pdfflow = addKeyword(EVENTS.WELCOME)
  .addAnswer("Que desea saber del pdf....👨‍💻 ")
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    await state.update({ name: ctx.body });
    console.log;
    ({ name: ctx.body });
    const text = ctx.body;

    const response = await pdfQuery(text);

    console.log(`${new Date()}\nPregunta: ${text} \nRespuesta: ${response}`);
    await flowDynamic(response);
  })
  .addAnswer("tienes otra pregunta ?", { delay: 3000 })

  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    await state.update({ name: ctx.body });
    console.log;
    ({ name: ctx.body });
    const text = ctx.body;
    const response = await pdfQuery(text);
    await flowDynamic(response);
  })
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    await state.update({ name: ctx.body });
    console.log;
    ({ name: ctx.body });
    const text = ctx.body;
    const response = await pdfQuery(text);
    await flowDynamic(response);
  })

  .addAnswer(['Para continuar con las preguntas',' ```SI``` o ```NO``` ','para regresar al menú anterior'],
    { delay: 3000 }
  )
  .addAction(
    { capture: true },
    async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
      const userResponse = ctx.body;

      if (userResponse === "Si" || userResponse === "si") {
        return gotoFlow(pdfflow);
      } else if (userResponse === "No" || userResponse === "no") {
        await flowDynamic("Has regresado al menú anterior.");
        return gotoFlow(menuFlow);
      }
      if (!userResponse.includes("si", "no")) {
        return fallBack(`Error...❌Escribe si o no `);
      }
    }
  );

export default pdfflow;
