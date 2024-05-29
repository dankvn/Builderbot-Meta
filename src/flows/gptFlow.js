import { addKeyword } from "@builderbot/bot";
import { G4F } from "g4f";
import pdfflow from "./pdf.Flow.js";
import menuFlow from "./menuFlow.js";
import  flowSeller  from "./seller.flow.js";

const g4f = new G4F();

const prompt = `Como una inteligencia artificial avanzada, tu tarea es analizar el contexto de una conversación y determinar cuál de las siguientes acciones es más apropiada para realizar:
--------------------------------------------------------
Historial de conversación:
{HISTORY}

Posibles acciones a realizar:
1. AGENDAR: Esta acción se debe realizar cuando el cliente expresa su deseo de programar una cita.
2. HABLAR: Esta acción se debe realizar cuando el cliente desea hacer una pregunta o necesita más información.
3. CONFIRMAR: Esta acción se debe realizar cuando el cliente y el vendedor llegaron a un acuerdo mutuo proporcionando una fecha, dia y hora exacta sin conflictos de hora.
-----------------------------
Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.

Respuesta ideal (AGENDAR|HABLAR|CONFIRMAR):`;

const gptflow = addKeyword("gpt")
  .addAnswer("En que te puedo ayudar...👨‍🔧 ")
  .addAction({ capture: true }, async (ctx, { state, gotoFlow }) => {
    const text = ctx.body;
    const messages = [
      { role: "system", content: "Eres un asistente personal" },
      { role: "assistant", content: prompt },
      { role: "user", content: text },
    ];
    const options = {
      model: "gpt-4",
      debug: true,
      retry: {
        times: 3,
        condition: (text) => {
          const words = text.split(" ");
          return words.length > 10;
        },
      },
      output: (text) => {
        return text + " 💕🌹";
      },
    };

    const response = await g4f.chatCompletion(messages, options);

    console.log(`${new Date()}\nPregunta: ${text} \nRespuesta: ${response}`);
    

    await state.get(response);

    if (response.includes("HABLAR")) {
      return gotoFlow(flowSeller);
    }
    if (response.includes("AGENDAR")) {
      return gotoFlow(pdfflow);
    }
    if (response.includes("CONFIRMAR")) {
      return gotoFlow(menuFlow);
    }
  });

export default gptflow;
