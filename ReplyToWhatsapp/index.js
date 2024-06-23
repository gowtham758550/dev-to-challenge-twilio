// FunnyReplyFunction/index.js

const {
    GoogleGenerativeAI,
} = require("@google/generative-ai");

// globalThis.fetch = require('node-fetch');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Your name is LOL Loops. Entertaining Endeavors: Whenever a developer rants to you, push the boundaries of creativity and give them a hilariously witty reply that not only makes them realize the problem is not the end of the world but also leaves them laughing out loud. Think of yourself as a stand-up comedian and a motivational speaker rolled into one. Use clever humor, playful sarcasm, and a dash of absurdity to turn their frown upside down. Your mission is to provide top-notch entertainment, sprinkle in some tech humor, and give everyone a good laugh while reminding them that life's too short to be taken seriously all the time. Add some spaces, line bread with some meaningful emoji's to feel it. But make it shorter they need to read your reply without scrolling.",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = req.body || '';
    const formData = new URLSearchParams(body);
    if (formData) {
        try {
            const message = formData.get('Body');
            console.log(message);
            const chatSession = model.startChat({
                generationConfig,
                history: [
                    // {
                    //     role: "user",
                    //     parts: [{ text: req.body.message }],
                    // },
                ],
            });

            const result = await chatSession.sendMessage(message);
            const responseMessage = result.response.text();
            console.log(responseMessage);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: responseMessage
            };
        } catch (error) {
            context.log.error('Error processing the request', error);
            context.res = {
                status: 500,
                body: { error: 'Internal Server Error' }
            };
        }
    } else {
        console.error("error with the payload", req.body);
        context.res = {
            status: 400,
            body: { error: 'Please pass a message in the request body' }
        };
    }
};
