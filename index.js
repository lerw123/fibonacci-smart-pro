require('dotenv').config();
const ccxt = require('ccxt');
const TelegramBot = require('node-telegram-bot-api');

const {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  TELEGRAM_BOT_TOKEN,
  NETWORK
} = process.env;

const exchange = new ccxt.binance({
  apiKey: BINANCE_API_KEY,
  secret: BINANCE_API_SECRET,
  options: { defaultType: NETWORK === 'testnet' ? 'future' : 'spot' }
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '¡Hola! Soy Fibonacci Smart Pro. Usa /trade y /status para interactuar.');
});

bot.onText(/\/status/, async (msg) => {
  try {
    const balance = await exchange.fetchBalance();
    const usdt = balance.free['USDT'] || 0;
    bot.sendMessage(msg.chat.id, `Balance USDT: ${usdt}`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `Error obteniendo estado: ${err.message}`);
  }
});

bot.onText(/\/trade (\w+) ([0-9.]+) ([0-9.]+) ([0-9.]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const [, symbol, amountStr, levelStr, trailingStr] = match;
  const amount = parseFloat(amountStr);
  const level = parseFloat(levelStr);
  const trailing = parseFloat(trailingStr);
  try {
    const ticker = await exchange.fetchTicker(symbol);
    const entryPrice = ticker.low + (ticker.high - ticker.low) * (level / 100);
    await exchange.createMarketBuyOrder(symbol, amount);
    bot.sendMessage(chatId, `Orden LONG ${symbol} ${amount}@${entryPrice.toFixed(2)}. Trailing ${trailing}%`);
  } catch (err) {
    bot.sendMessage(chatId, `Error creando orden: ${err.message}`);
  }
});

process.on('SIGINT', () => process.exit());
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
