import { getHistoryParse } from "../utils/handleHistory.js";

import { flowSeller } from "../flows/seller.flow.js";
import  { flowSchedule } from"../flows/schedule.flow.js";
import { G4F } from "../services/g4f/index.js";
const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si el cliente parece querer hacer una pregunta o necesita más información.
**PROGRAMAR**: Selecciona esta acción si el cliente muestra intención de programar una cita.

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`;

module.exports = async function(_, { state, gotoFlow, }) {
    
    const g4f = new G4F();
    const history = getHistoryParse(state);
    const prompt = PROMPT_DISCRIMINATOR;

    console.log(prompt.replace('{HISTORY}', history));

    const { prediction } = await g4f.chatCompletion([
        {
            model: "gpt-4",
            role: 'system',
            content: prompt.replace('{HISTORY}', history)
        }
    ], );

    console.log({ prediction });

    if (prediction.includes('HABLAR')) return gotoFlow(flowSeller);
    if (prediction.includes('PROGRAMAR')) return gotoFlow(flowSchedule);
};
