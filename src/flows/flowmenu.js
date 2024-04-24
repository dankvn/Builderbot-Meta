import { addKeyword } from '@builderbot/bot';

const flowmenu = addKeyword("PRODUCTOS")
  .addAnswer([
    "¿Como podemos ayudarte?",
    "",
    "*1-*🛍Realizar *Pedido*",
    "*2-*👨‍💻Contactar con *Agente* ",
    
  ])
  .addAnswer("Responda con el numero de la opcion!");

  export default flowmenu