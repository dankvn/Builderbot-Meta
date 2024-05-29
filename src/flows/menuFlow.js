import { addKeyword } from "@builderbot/bot";
import create_imgFlow from "./create_imgFlow.js";
import traductorFlow from "./traductorFlow.js";
import gptflow from "./gptFlow.js";
import webFlow from "./webFlow.js";
import pdfflow from "./pdf.Flow.js";

const menuFlow = addKeyword("buy")
  .addAction(async (ctx, { provider }) => {
    const to = ctx.from;
    const listParams = {
      type: "list",
      header: {
        type: "text",
        text: "Temenos varias opciones para explorar",
      },
      body: {
        text: "Que opcion te gustarias escojer",
      },
      footer: {
        text: "Equipo DevMaster",
      },
      action: {
        button: "Ver Opciones",
        sections: [
          {
            title: "Menu",
            rows: [
              {
                id: "option 1",
                title: "Traductor ✍",
                description: "Traducion en ingles",
              },
              {
                id: "option 2",
                title: "Gpt4 🤖",
                description: "Pregunta GPT4",
              },
              {
                id: "option 3",
                title: "Creacion de imagenes 🎨",
                description: "Opcion de crear imagens con IA",
              },
              {
                id: "option 4",
                title: "Pagina Web 👨‍💻",
                description: "Opcion de pagina web",
              },
              {
                id: "option 5",
                title: "Pdf 📑",
                description: "Opcion de pagina web",
              },
            ],
          },
        ],
      },
    };
    await provider.sendList(to, listParams);
  })

  .addAction({ capture: true }, async (ctx, { fallBack, gotoFlow }) => {
    const resp = ctx.body;

    if (resp == "option 1") {
      return gotoFlow(traductorFlow);
    }
    if (resp == "option 2") {
      return gotoFlow(gptflow);
    }
    if (resp == "option 3") {
      return gotoFlow(create_imgFlow);
    }
    if (resp == "option 4") {
      return gotoFlow(webFlow);
    }
    if (resp == "option 5") {
      return gotoFlow(pdfflow);
    }

    return fallBack(`Ups! opcion no valida 🤔❌...`);
  });

export default menuFlow;
