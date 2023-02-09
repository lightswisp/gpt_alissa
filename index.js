const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const GPT_TOKEN = process.env.GPT_TOKEN

async function getGptAnswer(question){
	try{
		response = await axios({
		  method: 'post',
		  url: 'https://api.openai.com/v1/completions',
		  headers: {'Authorization': 'Bearer ' + GPT_TOKEN},
		  data: {
		    model: "text-davinci-003",
	   		prompt: question,
	   		max_tokens: 1500,
	   		temperature: 0.1
		  }
		});
		return response.data["choices"][0]["text"] || "The server had an error while processing your request. Sorry about that!"
	}catch(e){
		console.log(e)
		return "The server had an error while processing your request. Sorry about that!"
	}

}

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  let answer = await getGptAnswer(msg.text)
  bot.sendMessage(chatId, answer);
});
