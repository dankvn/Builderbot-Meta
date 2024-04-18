import { addKeyword } from '@builderbot/bot';

const flowRegistered = addKeyword('register')
  .addAnswer('What is your name?', { capture: true }, async (ctx, { state }) => {
    const responseName = ctx.body
    await state.update({ name: responseName })
  })
  .addAnswer('What is your email?', { capture: true }, async (ctx, { state }) => {
    const responseEmail = ctx.body
    await state.update({ email: responseEmail })
  })

export default flowRegistered 
