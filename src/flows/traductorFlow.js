import { G4F } from "g4f";

import { addKeyword } from "@builderbot/bot";
import menuFlow from "./menuFlow.js";
const g4f = new G4F();

const option1 = `English 🇰🇾`;
const option2 = `Korea 🇰🇷`;
const option3 = `Japones 🇯🇵`;
const backOption = `Atras🔙`;
const translateAgainOption = `Traduccion🔄`;

const buttonsList = [{ body: option1 }, { body: option2 }, { body: option3 }];

const traductorFlow = addKeyword(["3"])
  .addAnswer("Please select your country", { buttons: buttonsList })
  .addAction({ capture: true }, async (ctx, { fallBack, endFlow, state }) => {
    const attempts = state.get("attempts") || 1;
    const resp = ctx.title_button_reply;
    if (resp === backOption) {
      await state.update({ attempts: 1 });
      return fallBack(traductorFlow);
    }

    if (resp !== option1 && resp !== option2 && resp !== option3) {
      if (attempts < 4) {
        await state.update({ attempts: attempts + 1 });
        return fallBack(
          `\u274C Wrong option! Please select one of the 3 options.\nAttempt ${attempts} of 3`
        );
      } else {
        await state.update({ attempts: 1 });
        return endFlow(`\u274C Too many attempts. Bot ended.`);
      }
    } else {
      await state.update({ country: resp });
    }
  })
  .addAction(async (_, { flowDynamic, state }) => {
    const country = state.get("country");
    if (country === option1) {
      await flowDynamic(
        `Usted ha seleccionado ${country}.`
      );
    } else if (country === option2) {
      await flowDynamic(
        `Usted ha seleccionado ${country}.`
      );
    } else if (country === option3) {
      await flowDynamic(
        `Usted ha seleccionado ${country}.`
      );
    }
  })
  .addAnswer("Ingresa la frase a traducir",)
  .addAction({ capture: true }, async (ctx, { state, fallBack }) => {
    const country = state.get("country");
    const text = ctx.body;
    if (text === backOption) {
      return fallBack(traductorFlow);
    }
    let targetLanguage;

    switch (country) {
      case option1:
        targetLanguage = "en"; // Inglés
        break;
      case option2:
        targetLanguage = "ko"; // Coreano
        break;
      case option3:
        targetLanguage = "ja"; // Japonés
        break;
      default:
        targetLanguage = "en";
    }

    const options = {
      text: `${text}`,
      source: "es",
      target: targetLanguage,
    };

    const response = await g4f.translation(options);
    await state.update({ translationResult: response.translation.result });
  })
  .addAnswer(`Tu traducción es:`, async (_, { flowDynamic, state }) => {
    const translationResult = state.get("translationResult");
    await flowDynamic(translationResult);
  })
  
  .addAnswer("¿Quieres realizar otra traducción o regresar al menú anterior?", {
    buttons: [{ body: translateAgainOption },{ body: backOption }]
  })
  .addAction({ capture: true }, async (ctx, { state, gotoFlow }) => {
    if (ctx.body === backOption) {
      await state.update({ attempts: 1 }); // Reset attempts
      return gotoFlow(menuFlow)
    } 
  })
  .addAction({ capture: true }, async (ctx, { state, gotoFlow }) => {
    if (ctx.body === translateAgainOption) {
      await state.update({ attempts: 1 }); // Reset attempts
      return gotoFlow(traductorFlow)
    } 
  });


export default traductorFlow;
