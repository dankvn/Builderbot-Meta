import "dotenv/config";
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'




//flows
import welcomeFlow from "./flows/welcomeFlow.js";
import UserYesRegister from "./flows/UserYesRegisterFlow.js"; 
import UserNotRegisteredFlow from "./flows/UserNotRegisteredFlow.js";
import create_imgFlow from "./flows/create_imgFlow.js";
import menuFlow from "./flows/menuFlow.js"
import traductorFlow from "./flows/traductorFlow.js"


const PORT = process.env.PORT ?? 3008;

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow,UserYesRegister,UserNotRegisteredFlow, create_imgFlow,menuFlow,traductorFlow]);
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.JWT_TOKEN,
        numberId: process.env.NUMBER_ID,
        verifyToken: process.env.VERIFY_TOKEN,
        version: 'v18.0'
    })

 

  const adapterDB = new Database()
  

  const { handleCtx, httpServer } = await createBot({
      flow:adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
  })
  

  adapterProvider.server.post(
      '/v1/messages',
      handleCtx(async (bot, req, res) => {
          const { number, message, urlMedia } = req.body
          await bot.sendMessage(number, message, { media: urlMedia ?? null })
          return res.end('sended')
      })
  )

  adapterProvider.server.post(
      '/v1/register',
      handleCtx(async (bot, req, res) => {
          const { number, name } = req.body
          await bot.dispatch('REGISTER_FLOW', { from: number, name })
          return res.end('trigger')
      })
  )

  adapterProvider.server.post(
      '/v1/samples',
      handleCtx(async (bot, req, res) => {
          const { number, name } = req.body
          await bot.dispatch('SAMPLES', { from: number, name })
          return res.end('trigger')
      })
  )

  adapterProvider.server.post(
      '/v1/blacklist',
      handleCtx(async (bot, req, res) => {
          const { number, intent } = req.body
          if (intent === 'remove') bot.blacklist.remove(number)
          if (intent === 'add') bot.blacklist.add(number)

          res.writeHead(200, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ status: 'ok', number, intent }))
      })
  )

  httpServer(+PORT)
};

main();