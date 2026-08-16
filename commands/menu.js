const config = require("../config");

module.exports = {
  name: "menu",
  description: "Tampilkan daftar command",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const { commands } = require("../lib/handler");

    let text = `*${config.botName}*\n\n`;
    for (const [name, cmd] of commands) {
      text += `${config.prefix}${name} - ${cmd.description}\n`;
    }

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
