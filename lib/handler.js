const fs = require("fs");
const path = require("path");
const config = require("../config");

// Muat semua command dari folder /commands secara otomatis.
// Setiap file command harus export: { name, description, execute(sock, msg, args) }
function loadCommands() {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commands = new Map();

  for (const file of fs.readdirSync(commandsPath)) {
    if (!file.endsWith(".js")) continue;
    const command = require(path.join(commandsPath, file));
    if (command?.name) {
      commands.set(command.name, command);
    }
  }

  return commands;
}

const commands = loadCommands();

async function handleMessage(sock, msg) {
  const from = msg.key.remoteJid;
  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    "";

  if (!body.startsWith(config.prefix)) return;

  const [cmdName, ...args] = body
    .slice(config.prefix.length)
    .trim()
    .split(/\s+/);

  const command = commands.get(cmdName.toLowerCase());
  if (!command) return;

  try {
    await command.execute(sock, msg, args);
  } catch (err) {
    console.error(`Command "${cmdName}" gagal dijalankan:`, err);
    await sock.sendMessage(from, {
      text: "Terjadi error saat menjalankan command itu.",
    });
  }
}

module.exports = { handleMessage, commands };
