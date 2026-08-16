module.exports = {
  name: "ping",
  description: "Cek apakah bot masih hidup",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const start = Date.now();
    await sock.sendMessage(
      from,
      { text: `Pong! ${Date.now() - start}ms` },
      { quoted: msg }
    );
  },
};
