
import {  addKeyword, HttpClient, processTemplate } from '@builderbot/bot';

const flowmenu = addKeyword('weather')
    .addAnswer('Vamos a consultar la API del clima', async ({flowDynamic}) => {
        const response = await HttpClient.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY');
        const weatherData = response.data;
        const message = processTemplate('La temperatura en {{city}} es de {{temperature}} grados', weatherData);
        await flowDynamic(message);
    });
  
  export default flowmenu