const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5416361453:AAFUH4LlPFDCtcXuc8DXqe9yg52FekFNDi8";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Попробуй отгадать)", gameOptions);
};

const start = () => {
    bot.setMyCommands([
        // sets awailable commands for user, description will also be shown in the telegram chat, obviously to explain what each command does
        { command: "/start", description: "Начальное приветствие" },
        { command: "/info", description: "Выдать информацию о пользователе" },
        { command: "/game", description: "Сыграть в игру" },
    ]);

    // basically an adding an even, where "message" is event type and "msg" is a callback (in this case "msg" is just a vallue passed to the function, don't be confused)
    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.webp"); //async due to basically fetching for sticker
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот от Эрика Якубу, по скольку это мой первый бот, не судите очень строго, пока ещё учусь`);
        }
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я вас не понимаю, попробуйте другую команду");
    });

    bot.on("callback_query", (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if ((data = "/again")) {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}!`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению, я загадал цифру ${chats[chatId]}`, againOptions);
        }
    });
};

start();
