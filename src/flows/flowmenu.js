import { addKeyword } from '@builderbot/bot';
import { geminiLayer } from "@builderbot-plugins/gemini-layer";
const flowmenu = addKeyword("PRODUCTOS")

.addAction(async (...bot) => await geminiLayer({
  vision: true,
  context: {
      horarios_de_atencion: 'Lunes a Viernes de 9:00 a 18:00',
      ubicacion: 'venezuela',
      'reclamos y quejas': 'dejar un correo en la seccion de reclamos y quejas',
  }
}, bot))

  export default flowmenu