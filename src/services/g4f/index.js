import { G4F } from "g4f";

const g4f = new G4F();
const messages = [
    { role: "system", content: "You're an expert bot in poetry."},
    { role: "user", content: "Let's see, write a single paragraph-long poem for me." },
];
const options = {
    model: "gpt-4",
    debug: true,
	retry: {
        times: 3,
        condition: (text) => {
            const words = text.split(" ");
            return words.length > 10;
        }
    },
    output: (text) => {
        return text + " 💕🌹";
    }
};

(async() => {
    const text = await g4f.chatCompletion(messages, options);	
    console.log(text);
})();