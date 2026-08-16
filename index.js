const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const readline = require("readline");

const config = require("./config");
const { handleMessage } = require("./lib/handler");

const logger = pino({ level: "silent" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = (text) =>
  new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: !config.usePairingCode,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  // Login pakai pairing code (bukan scan QR)
  if (config.usePairingCode && !sock.authState.creds.registered) {
    const phoneNumber = await question(
      "Masukkan nomor WhatsApp (contoh 628xxxxxxxxxx): "
    );
    const code = await sock.requestPairingCode(phoneNumber.trim());
    console.log(`Kode pairing: ${code}`);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log("Koneksi terputus, reconnect:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log(`${config.botName} tersambung ke WhatsApp.`);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    await handleMessage(sock, msg);
  });
}

startBot().catch((err) => {
  console.error("Gagal menjalankan bot:", err);
});
