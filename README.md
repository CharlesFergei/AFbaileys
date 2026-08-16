# WA-Bot

Bot WhatsApp sederhana berbasis [Baileys](https://github.com/CharlesFergei/AF_Baileys), dengan sistem command yang bisa dikembangkan lewat folder `commands/`.

## Fitur

- Auto-reconnect saat koneksi terputus
- Login via scan QR atau pairing code (atur di `config.js`)
- Sistem command modular — tinggal tambah file baru di `commands/`
- Command bawaan: `!menu`, `!ping`

## Instalasi

```bash
git clone https://github.com/<username>/<repo-kamu>.git
cd <repo-kamu>
npm install
```

## Konfigurasi

Edit `config.js`:

```js
module.exports = {
  prefix: "!",
  botName: "WA-Bot",
  ownerNumber: "628xxxxxxxxxx",
  usePairingCode: false, // true = login pakai kode, false = scan QR
};
```

## Menjalankan

```bash
npm start
```

- Jika `usePairingCode: false`, scan QR code yang muncul di terminal.
- Jika `usePairingCode: true`, masukkan nomor WhatsApp saat diminta, lalu masukkan kode pairing di HP kamu (Perangkat Tertaut > Tautkan dengan nomor telepon).

Sesi login tersimpan di folder `auth_info/` (sudah di-ignore oleh git, jangan pernah di-commit/dibagikan karena berisi kredensial akun WhatsApp kamu).

## Menambah command baru

Buat file baru di `commands/`, contoh `commands/halo.js`:

```js
module.exports = {
  name: "halo",
  description: "Menyapa pengirim",
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    await sock.sendMessage(from, { text: "Halo!" }, { quoted: msg });
  },
};
```

Bot otomatis mendeteksi file baru di folder itu, tidak perlu didaftarkan manual.

## Lisensi

MIT
