import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { MetaProvider as Provider } from "@builderbot/provider-meta";
import axios from "axios"




const PORT = process.env.PORT ?? 3008;


const guardar = async () =>{
    try {
        var config = {
          method: "post",
          url: `http://localhost:1337/api/orders`,
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_KEY}`,
          },
        };
    
        const response = await axios(config);
        return response.data;
      } catch (e) {
        console.log(e);
        return null;
      }
    
}

let GLOBAL_STATE = {};

const welcomeFlow = addKeyword("hola")
  .addAnswer("Bienvenido")
  .addAnswer("A continuacion comenzamos con tu pedido. ")
  .addAnswer("¿Cual es tu nombre?", { capture: true }, async (ctx) => {
    GLOBAL_STATE[ctx.from] = {
      name: ctx.body,
      descripcion: "",
      direccion: "",
    };
  })
  .addAnswer("¿Direccion de envio?", { capture: true }, async (ctx) => {
    GLOBAL_STATE[ctx.from].direccion = ctx.body;
  })
  .addAnswer("Tu orden se esta procesando...", null, async (ctx) => {
    guardar(GLOBAL_STATE[ctx.from]);
  });

const main = async () => {
  const adapterFlow = createFlow([welcomeFlow]);
  const adapterProvider = createProvider(Provider, {
    jwtToken: process.env.JWT_TOKEN,
    numberId: process.env.NUMBER_ID,
    verifyToken: process.env.VERIFY_TOKEN,
    version: "v18.0",
  });
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.post(
    "/v1/messages",
    handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body;
      await bot.sendMessage(number, message, { media: urlMedia ?? null });
      return res.end("sended");
    })
  );

  adapterProvider.server.post(
    "/v1/register",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot.dispatch("REGISTER_FLOW", { from: number, name });
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/samples",
    handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot.dispatch("SAMPLES", { from: number, name });
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/blacklist",
    handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body;
      if (intent === "remove") bot.blacklist.remove(number);
      if (intent === "add") bot.blacklist.add(number);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    })
  );

  httpServer(+PORT);
};

main();
