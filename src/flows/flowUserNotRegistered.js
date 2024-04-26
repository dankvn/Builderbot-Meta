import { addKeyword, EVENTS } from '@builderbot/bot';



  const flowUserNotRegistered= addKeyword(EVENTS.ACTION)
  .addAnswer('Para acceder al bot tienes que registarte 📝')

  .addAnswer('¿Cuál es tu nombre?', { capture: true }, async (ctx, { state }) => {
    await state.update({ name: ctx.body }); 
})
.addAnswer('¿Cuál es tu edad?', { capture: true }, async (ctx, { state }) => {
    await state.update({ age: ctx.body });  
})
.addAnswer('Tus datos son:', null, async (_, { flowDynamic, state }) => {
    const nombre = state.get('name');
    const edad = state.get('age');
   await flowDynamic(`Nombre: ${nombre}\nEdad: ${edad}`);
});
  

  export default flowUserNotRegistered