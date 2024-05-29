import { G4F } from "g4f";
import fs from "fs";
import { addKeyword } from "@builderbot/bot";
const g4f = new G4F();

const create_imgFlow = addKeyword(["3"])
.addAnswer("Ingresa un prompt para la creacion de la imaguen")
.addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    await state.update({ name: ctx.body });
    console.log;({ name: ctx.body });
    const text = ctx.body;
    const base64Image = await g4f.imageGeneration(`${text}`, { 
        debug: true,
        provider: g4f.providers.Prodia,
        providerOptions: {
            model: "ICantBelieveItsNotPhotography_seco.safetensors [4e7a3dfd]",
            samplingSteps: 15,
            cfgScale: 30
        }
    });	
    
    fs.writeFile('image1.jpg', base64Image, { encoding: 'base64' }, async function(err) {
        if (err) {
            console.error('Error writing the file: ', err);
        } else {
            console.log('The image has been successfully saved as image.jpg.');
            // Leer el archivo y enviarlo como respuesta
            fs.readFile('image1.jpg', async function(err, data) {
                if (err) {
                    console.error('Error reading the file: ', err);
                } else {
                    // Enviar la imagen como respuesta
                    await flowDynamic([
                        {body:'Aquí está tu imagen:', media: 'image1.jpg', data}
                    ])
                }
            });
        }
    });
});
  export default create_imgFlow 



