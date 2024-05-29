import { addKeyword, EVENTS } from "@builderbot/bot";

const webFlow = addKeyword(EVENTS.WELCOME)
    .addAction(
        async (ctx, { provider }) => {
            const to = ctx.from
            provider.sendMessageMeta(
                {
                    messaging_product: 'whatsapp',
                    to,
                    type: "text",
                    text: {
                        preview_url: true,
                        body: 'Bienvenido a mi Pagina Web\nhttps://www.devmaster.website/'
                    }
                }
            )
         
        }
    )

    export default webFlow;
