
import { addKeyword, EVENTS } from "@builderbot/bot";
import { G4F } from "g4f";


const g4f = new G4F();
const PROMPT_SELLER = `Eres el asistente virtual en la prestigiosa barbería "Barbería Flow 25", ubicada en Madrid, Plaza de Castilla 4A. Tu principal responsabilidad es responder a las consultas de los clientes y ayudarles a programar sus citas.

FECHA DE HOY: {CURRENT_DAY}

SOBRE "BARBERÍA FLOW 25":
Nos distinguimos por ofrecer cortes de cabello modernos y siempre a la vanguardia. Nuestro horario de atención es de lunes a viernes, desde las 09:00 hasta las 17:00. Para más información, visita nuestro sitio web en "barberflow.co". Aceptamos pagos en efectivo y a través de PayPal. Recuerda que es necesario programar una cita.

PRECIOS DE LOS SERVICIOS:
- Corte de pelo de hombre 10USD
- Corte de pelo + barba 15 USD

HISTORIAL DE CONVERSACIÓN:
--------------
{HISTORIAL_CONVERSACION}
--------------

DIRECTRICES DE INTERACCIÓN:
1. Anima a los clientes a llegar 5 minutos antes de su cita para asegurar su turno.
2. Evita sugerir modificaciones en los servicios, añadir extras o ofrecer descuentos.
3. Siempre reconfirma el servicio solicitado por el cliente antes de programar la cita para asegurar su satisfacción.

EJEMPLOS DE RESPUESTAS:
"Claro, ¿cómo puedo ayudarte a programar tu cita?"
"Recuerda que debes agendar tu cita..."
"como puedo ayudarte..."

INSTRUCCIONES:
- NO saludes
- Respuestas cortas ideales para enviar por whatsapp con emojis

Respuesta útil:`;

const flowSeller = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Qué información deseas saber?", { capture: true })
  .addAction(async (ctx, { state, flowDynamic }) => {
    try {
      const text = ctx.body;
      // Crear los mensajes para la API de chat
      const messages = [
        { role: "system", content: "Eres un asistente personal" },
        { role: "assistant", content: PROMPT_SELLER },
      ];

      const options = {
        model: "gpt-4",
        debug: true,
      };

      // Obtener la respuesta del bot
      const response = await g4f.chatCompletion(messages, options);
      console.log(`${new Date()}\nPregunta: ${text} \nRespuesta: ${response}`);


      const history = (state.getMyState()?.history ?? []);

      
      console.log(`[Historta]`, history);
      history.push({
        role: "user",
        content: ctx.body,
      });
      const ai = await g4f.chatCompletion(history);
      await flowDynamic(ai);

      history.push({
        role: "assistant",
        content: ctx.body,
      });
      await state.update({ history: history });
    } catch (err) {
      console.log(err);
    }
  });

export default flowSeller;


