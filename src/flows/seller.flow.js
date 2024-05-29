import { addKeyword, EVENTS } from "@builderbot/bot";
import { G4F } from "g4f";
import { generateTimer } from "../utils/generateTimer.js";

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

const handleUserMessage = async (ctx, state, flowDynamic) => {
  try {
    const text = ctx.body;

    // Recuperar el historial de conversación del estado
    const history = state.get("history") || [];

    // Agregar el mensaje actual al historial
    history.push({ role: "user", content: text });

    // Crear los mensajes para la API de chat
    const messages = [
      { role: "system", content: "Eres un asistente personal" },
      { role: "assistant", content: PROMPT_SELLER },
      ...history,
    ];

    const options = {
      model: "gpt-4",
      debug: true,
    };

    // Obtener la respuesta del bot
    const response = await g4f.chatCompletion(messages, options);
    console.log(`${new Date()}\nPregunta: ${text} \nRespuesta: ${response}`);

    // Agregar la respuesta del bot al historial
    history.push({ role: "assistant", content: response });
    await state.update({ history });

    // Dividir la respuesta en fragmentos y enviarlos
    const chunks = response.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
    }

    // Preguntar al usuario si tiene más preguntas y capturar la respuesta
    const nextQuestion = await flowDynamic([{ capture: true, body: "¿Tienes alguna otra pregunta?" }]);
    if (nextQuestion && nextQuestion[0] && nextQuestion[0].body) {
      ctx.body = nextQuestion[0].body; // Actualizar el contexto con la nueva pregunta del usuario

      // Llamar recursivamente para capturar y procesar el próximo mensaje
      await handleUserMessage(ctx, state, flowDynamic);
    }
  } catch (err) {
    console.log(`[ERROR]:`, err);
  }
};

const flowSeller = addKeyword(EVENTS.ACTION)
  .addAnswer("¿Qué información deseas saber?", { capture: true })
  .addAction(
    async (ctx, { state, flowDynamic }) => {
      await handleUserMessage(ctx, state, flowDynamic);
    }
  );

export default flowSeller;