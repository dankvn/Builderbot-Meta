import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { MetaProvider as Provider } from "@builderbot/provider-meta";
import { GPTFREE } from "gpt4free-plugin";
const axios = require("axios").default;


const gpt = new GPTFREE();

const PORT = process.env.PORT ?? 3008;


const guardar = () =>{
var options = {
  method: 'POST',
  url: 'http://localhost:1337/api/orders',
  headers: {
    Accept: '*/*',
    'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
    Authorization: 'Bearer c19748727ee48e87c45352f220e36c41b172eba2e136d2b3ea8b96aec3f1d4af27cc45505dbcf2aa68e72f10f235fb5a9430445bdde23421c04145f16cf796ef49ce144780060b8f2b8dba8a240d683cefd172e24286c8eb8c5283877c3ed4ed44f818c87ff0188a876add112c344a385be2c13f0467e38a303c09f119fd992b',
    'Content-Type': 'application/json'
  },
  data: {data: {name: 'Tayron', descripcion: 'corte de cabello'}}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
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
  const adapterFlow = createFlow([welcomeFlow,guardar]);
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
