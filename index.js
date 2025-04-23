require('dotenv').config();
const ccxt = require('ccxt');
const TelegramBot = require('node-telegram-bot-api');

const {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  TELEGRAM_BOT_TOKEN,
  NETWORK,
} = process.env;

// Opciones comunes CCXT
const opts = {
  apiKey:   BINANCE_API_KEY,
  secret:   BINANCE_API_SECRET,
  enableRateLimit: true,
  options: { adjustForTimeDifference: true },
};

// Instancia CCXT Binance
const exchange = new ccxt.binance(opts);

// Modo sandbox en Testnet
if ((NETWORK || 'testnet') === 'testnet') {
  exchange.setSandboxMode(true);
  console.log('⚙️  Binance Testnet mode ON');
} else {
  console.log('⚙️  Binance Mainnet mode ON');
}

// Resto de tu código (inicializar bot, handlers, etc.)…

// Al final: servidor HTTP para Railway
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
