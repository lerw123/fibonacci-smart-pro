require('dotenv').config();
const ccxt = require('ccxt');
const TelegramBot = require('node-telegram-bot-api');

// Lee tus variables de entorno
const {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  TELEGRAM_BOT_TOKEN,
  NETWORK,
} = process.env;

// Instancia CCXT para Binance
const exchange = new ccxt.binance({
  apiKey:   BINANCE_API_KEY,
  secret:   BINANCE_API_SECRET,
  enableRateLimit: true,
  options: { adjustForTimeDifference: true },
});

console.log(`⚙️  Binance mode: ${NETWORK || 'testnet'}`);

// Inicializa el bot de Telegram en polling
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Comando /start
bot.onText(/\/start/, msg => {
  bot.sendMessage(
    msg.chat.id,
    '¡Hola! Soy Fibonacci Smart Pro. Usa /trade y /status para interactuar.'
  );
});

// Comando /status
bot.onText(/\/status/, async msg => {
  const chatId = msg.chat.id;
  try {
    const balance = await exchange.fetchBalance();
    bot.sendMessage(chatId, `Saldo total: ${JSON.stringify(balance.total)}`);
  } catch (err) {
    bot.sendMessage(chatId, `Error obteniendo estado: ${err}`);
  }
});

// Comando /trade <símbolo> <cantidad> <fib_level> <take_profit>
bot.onText(
  /\/trade (\S+) (\d+(\.\d+)?) (\d+(\.\d+)?) (\d+(\.\d+)?)/,
  async (msg, match) => {
    const chatId = msg.chat.id;
    const symbol    = match[1];
    const amount    = parseFloat(match[2]);
    const fibLevel  = parseFloat(match[3]);
    const takeProfit= parseFloat(match[4]);
    try {
      // Aquí tu lógica real de ejecución
      const order = await exchange.createMarketBuyOrder(symbol, amount);
      bot.sendMessage(chatId, `Orden ejecutada: ${JSON.stringify(order)}`);
    } catch (err) {
      bot.sendMessage(chatId, `Error ejecutando orden: ${err}`);
    }
  }
);

// Servidor HTTP “keep-alive” para Railway
const http = require('http');
const port = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
  })
  .listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
  });
