import { addKeyword, } from "@builderbot/bot";
import create_imgFlow from "./create_imgFlow.js";
import traductorFlow from "./traductorFlow.js";


const menuFlow = addKeyword('buy')
.addAnswer(
    [
     '¿Dime en qué podemos ayudarte?'
        , '1️⃣ Translation 📡'
        , '2️⃣ Chat con Ia 🤖'
        , '3️⃣ Creacion de imagenes 📷'
        , '4️⃣ Cancelar\n'
        , '*Escribe el número de tu respuesta*'
    ], { capture: true }
    
)
.addAnswer(`Thanks for you answer`,async (ctx, {gotoFlow,fallBack,endFlow})=> {
    const userAnswer = ctx.body
    if(userAnswer === '1'){
        return gotoFlow(traductorFlow)
    } 
    if(userAnswer === '2'){
        return gotoFlow(create_imgFlow)
    } 
    if(userAnswer === '3'){
        return gotoFlow(create_imgFlow)
    }
    if (userAnswer === '4') {
        return endFlow(`Su solicitud ha sido cancelada`);
      }
    return fallBack(`Ups! opcion no valida 🤔❌...`);
    

})






export default menuFlow