

const config = require('./resconfig');
const { menu_base,menu_ai,menu_anime,menu_baned,menu_berita,menu_info,menu_database,menu_download,menu_game,menu_group,menu_information,menu_islamic,menu_image,menu_maker,menu_store,menu_owner,menu_pushkontak,menu_random,menu_textpro,menu_tools,menu_more,menu_all } = require('./lib/menu.js');
const { WA_DEFAULT_EPHEMERAL, getAggregateVotesInPollMessage, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys")
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./lib/myfunc')
const { FajarNews, BBCNews, metroNews, CNNNews, iNews, KumparanNews, TribunNews, DailyNews, DetikNews, OkezoneNews, CNBCNews, KompasNews, SindoNews, TempoNews, IndozoneNews, AntaraNews, RepublikaNews, VivaNews, KontanNews, MerdekaNews, KomikuSearch, AniPlanetSearch, KomikFoxSearch, KomikStationSearch, MangakuSearch, KiryuuSearch, KissMangaSearch, KlikMangaSearch, PalingMurah, LayarKaca21, AminoApps, Mangatoon, WAModsSearch, Emojis, CoronaInfo, JalanTikusMeme,Cerpen, Quotes, Couples, Darkjokes } = require("dhn-api");
require('./ac')
const fs                = require('fs')
const path              = require('path');
const https             = require('https');
const util              = require('util')
const unlinkAsync = util.promisify(fs.unlink);
const chalk             = require('chalk')
const os                = require('os')
const axios             = require('axios')
const fsx               = require('fs-extra')
const ffmpeg            = require('fluent-ffmpeg')
const moment            = require('moment-timezone')
const { color, bgcolor }= require('./lib/color')
const { ssweb }         = require('./lib/ssweb')
const { quote }         = require('./lib/quote')
const { UploadTph }     = require('./lib/upload')
const { Primbon }       = require('scrape-primbon')
const primbon           = new Primbon()
const jsobfus           = require('javascript-obfuscator')
const cheerio           = require('cheerio')
const ytdl              = require("ytdl-core")
const { exec, spawn, execSync } = require("child_process")
const { mediafireDl }   = require('./database/mediafire.js')
const yts               = require('./scrape/yt-search')
const { ytSearch }      = require('./scrape/yt')
const listcolor         = ['red','green','yellow','blue','magenta','cyan','white']
const randomcolor       = listcolor[Math.floor(Math.random() * listcolor.length)]
let tak_dimenu          = true;
let wspam_fil           = ''
let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./lib/uploader')
require('moment/locale/id');

let jakartaTime = moment().tz('Asia/Jakarta');
let jammenit      = jakartaTime.format('HH:mm');

/* ===================「 DATABASE 」─=================== */
global.db           = global.db || {};
global.db.data      = JSON.parse(fs.readFileSync('./db/database.json', 'utf-8')) || {};
global.db.data.game = global.db.data.game || {};
global.totalAllfitur = 325
global.db.data.game = {
  tebaklagu         : [],
  _family100        : [],
  kuismath          : [],
  tebakgambar       : [],
  tebakangka       : [],
  tebakkata         : [],
  caklontong        : [],
  caklontong_desk   : [],
  tebakkalimat      : [],
  tebaklirik        : [],
  tebaktebakan      : [],
  tebakbendera     : [],
  ...(global.db.data.game || {})
};


if (!global.antiSpam) {
  global.antiSpam = {};
}

if (!global.blackjack) {
    global.blackjack = {};
}

function cekFormatWaktu(input) {
    const waktuRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    
    if (waktuRegex.test(input)) {
        const [jam, menit] = input.split(":");
        const jamAngka = parseInt(jam, 10);

        if (jamAngka >= 0 && jamAngka <= 23) {
            return true;
        }
    }

    return false;
}


function getNilaiKartu_Blackjack(kartuArray) {
    let totalNilai = 0;

    kartuArray.forEach((kartu) => {
        if (['A','J', 'Q', 'K'].includes(kartu)) {
            totalNilai += 10;
        } else {
            totalNilai += parseInt(kartu) || 0;
        }
    });

    return totalNilai;
}

async function downloadFile(fileUrl, destinationFolder, fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destinationFolder)) fs.mkdirSync(destinationFolder);

    const filePath = path.join(destinationFolder, fileName);
    const file = fs.createWriteStream(filePath);

    https.get(fileUrl, (response) => {
      response.pipe(file)
        .on('finish', () => {
          file.close();
          resolve(filePath);
        })
        .on('error', (err) => {
          fs.unlink(filePath, () => reject(`Gagal mengunduh file: ${err.message}`));
        });
    });
  });
}


async function processAndDeleteFile(ppuser) {
    try {
        const downloadedFilePath = await downloadFile(ppuser, './cache/', 'examplefile.jpg');
        let result_file = await TelegraPh('./' + downloadedFilePath);
        let url_tele = result_file;

        if (result_file) {
            await unlinkAsync(downloadedFilePath);
        }

        return url_tele;
    } catch (error) {
        throw error; // Melemparkan kembali kesalahan jika diperlukan
    }
}



const kartu_blackjack = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'K', 'Q'];

const { tebaklagu, _family100, kuismath, tebakangka ,tebakgambar, tebakbendera, tebakkata, caklontong, caklontong_desk, tebakkalimat, tebaklirik, tebaktebakan } = global.db.data.game;


function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}
function tanggal_add(hari) {
  const tanggalIni = moment.tz('Asia/Jakarta');
  
  const tanggalBeberapaHariKedepan = tanggalIni.clone().add(hari, 'days');
  
  return tanggalBeberapaHariKedepan.valueOf();
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}


function AddMoney(users, money_menang) {
  if (!db_usermoney[users]) {
    db_usermoney[users] = { money: 0 };
  }

  db_usermoney[users].money = parseInt(db_usermoney[users].money) + money_menang;

  fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney));
}



const db_mute     = readJsonFile('./db/mute.json');
const db_gcawait  = readJsonFile('./db/gcawait.json');
const db_pengguna = readJsonFile('./db/user.json');
const db_owner    = readJsonFile('./db/owner.json')
const db_premium    = readJsonFile('./db/premium.json')
const db_vn       = readJsonFile('./db/vnadd.json')
const db_document = readJsonFile('./db/docu.json')
const db_zip      = readJsonFile('./db/zip.json')
const db_apk      = readJsonFile('./db/apk.json')
const db_antilink = readJsonFile("./db/antilink.json")
const db_antitoxic = readJsonFile("./db/antitoxic.json")
const db_antidel  = readJsonFile("./db/antidel.json")
const db_banned   = readJsonFile('./db/banned.json')
const db_sewa     = readJsonFile('./db/sewa.json')
const db_welcome  = readJsonFile('./db/welcome.json')
const db_left     = readJsonFile('./db/left.json')
const db_usermoney= readJsonFile('./db/usermoney.json')
const db_userlist = readJsonFile('./db/userlist.json')
const db_shio     = readJsonFile('./db/shio.json')
const db_settings = readJsonFile('./db/settings.json')
const db_absen    = readJsonFile('./db/absen.json')
const db_sider    = readJsonFile('./db/sider.json')
const db_group    = readJsonFile('./db/group.json')


if (!db_gcawait) {
    db_gcawait = {};
}


function cariDataDenganID(idCari) {
  for (const nomorWhatsApp in db_sewa) {
    const dataSewa2 = db_sewa[nomorWhatsApp];
    const dataDitemukan = dataSewa2.find(item => item.id === idCari);
    if (dataDitemukan) {
        dataDitemukan.status = "sudah bayar";
      return dataDitemukan;
    }
  }
  return null;
}


const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds`;
  }
};


function replaceNonFirstCharWithAsterisk(inputString) {
  if (inputString.length < 2) {
    return inputString; // Tidak cukup panjang untuk mengganti karakter selain huruf pertama
  }

  const firstChar = inputString[0];
  const otherChars = inputString.substring(1).replace(/[a-zA-Z]/g, '*');

  return firstChar + otherChars;
}




// MODULE UTAMA OPEN
module.exports = autoresbot = async (autoresbot, m, chatUpdate, store) => {

jakartaTime = moment().tz('Asia/Jakarta');
jammenit      = jakartaTime.format('HH:mm');



if (!m.message) return console.log('tidak ada pesan')



try { // =================================================================
    

var body            = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype === 'messageContextInfo') ? (m.text) : ''

var prefix          = config.prefix_custom ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : config.prefix_custom ?? global.prefix
var msg_text        = (typeof m.text == 'string' ? m.text : '')


const isCmd         = body.startsWith(prefix)
const command       = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const args          = body.trim().split(/ +/).slice(1)
const spychat       = body.replace().slice().trim()
const pushname      = m.pushName || "Undefined"
const text          = q = args.join(" ")
const { type, quotedMsg, mentioned, now, fromMe } = m
const quoted        = m.quoted ? m.quoted : false
const quoted_       = m.quoted ? m.quoted : m
const mime          = (quoted.msg || quoted).mimetype || ''
const from          = chatinfo.key.remoteJid
const botNumber     = await autoresbot.decodeJid(autoresbot.user.id)

const sender        = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
const groupMetadata = m.isGroup ? await autoresbot.groupMetadata(from).catch(e => {}) : ''
const groupName     = m.isGroup ? groupMetadata.subject : ''
const participants  = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins   = m.isGroup ? await getGroupAdmins(participants) : ''


let firstTenCharacters = ''
if (body.length > 10) {
    firstTenCharacters = body.substring(0, 40)+ '...';
}else{
    firstTenCharacters = body
}


const reply = (teks) => {
    autoresbot.sendMessage(from,{text: teks},{quoted:m})
    //autoresbot.sendMessage(from, { text: teks, contextInfo:{"externalAdReply": {"title": `DON'T SPAM !!!`,"body": `👋🏻 Hai kak ${pushname}`, "previewType": "PHOTO","thumbnail": thumb,"sourceUrl": `https://royalpedia.id`}}}, { quoted: resbot })
}
const chat_only = (teks) => {
    autoresbot.sendMessage(from, {text: teks})
}


const MinLimit = (u) => {

  if (!db_usermoney[u]) {
    db_usermoney[u] = { limit: 30, money: 0 };
  }


if (resbot_.superOwner || resbot_.isOwner || resbot_.isPremium) {

}else{

if (db_usermoney[u].limit < 1) {
     return reply('_Limit Anda Telah Habis, Ketik *buylimit* untuk membeli limit atau jadi member Premium untuk menikmati semua fitur tanpa limit_')

}

db_usermoney[u].limit = parseInt(db_usermoney[u].limit) - 1;

fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney));

}



  return 200;
}



// INFO MESSAGE
const content       = JSON.stringify(m.message)

// WAKTU
//const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')
const wib           = moment.tz('Asia/Jakarta').format('HH : mm : ss')
const wit           = moment.tz('Asia/Jayapura').format('HH : mm : ss')
const wita          = moment.tz('Asia/Makassar').format('HH : mm : ss')
const time2         = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const timestamp     = moment().tz('Asia/Jakarta').valueOf();
const hariini       = jakartaTime.format('DD MMMM YYYY');
const tgl_hariini   = moment().tz('Asia/Jakarta').format('DD-MM-YYYY');



if (db.data.chats[m.chat] && 'antilink' in db.data.chats[m.chat]) {
  antilinkStatus = db.data.chats[m.chat].antilink ? 'ON' : 'OFF';
} else {
  antilinkStatus = 'OFF'
}

if (db.data.chats[m.chat] && 'antilinkv2' in db.data.chats[m.chat]) {
  antilinkv2Status = db.data.chats[m.chat].antilinkv2 ? 'ON' : 'OFF';
} else {
  antilinkv2Status = 'OFF'
}

if (db.data.chats[m.chat] && 'antilinkv3' in db.data.chats[m.chat]) {
  antilinkv3Status = db.data.chats[m.chat].antilinkv3 ? 'ON' : 'OFF';
} else {
  antilinkv3Status = 'OFF'
}



if (db_welcome[m.chat]) {
   if (db_welcome[m.chat][0].status == 'on') {
        welcome_status = 'ON'
    }else {
        welcome_status = 'OFF'
    }
} else {
    welcome_status = 'OFF'
}

if (db_left[m.chat]) {
   if (db_left[m.chat][0].status == 'on') {
        left_status = 'ON'
    }else {
        left_status = 'OFF'
    }
} else {
    left_status = 'OFF'
}



const isImage   = quoted_.mtype === 'imageMessage';
const isVideo   = quoted_.mtype === 'videoMessage';
const isAudio   = quoted_.mtype === 'audioMessage';
const isDocument= quoted_.mtype === 'documentMessage';
const isMsg     = quoted_.mtype === 'conversation';
const isSticker = quoted_.mtype === 'stickerMessage';


const resbot_ = {
    // checker
    numberSuperOwner: config.nomorsuperOwner + '@s.whatsapp.net',
    superOwner      : config.nomorsuperOwner + '@s.whatsapp.net' == m.sender ? true : false,
    isOwner         : [botNumber, ...db_owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender),
    isPremium       : [botNumber, ...db_premium].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender),
    isBotAdmins     : m.isGroup ? groupAdmins.includes(botNumber) : false,
    isAdmins        : m.isGroup ? groupAdmins.includes(m.sender) : false,
    isMuted         : m.isGroup ? db_mute.includes(from) : false,
    isBan           : db_banned.includes(m.sender),
    isUser          : db_pengguna.includes(m.sender),
    isMedia         : /image|video|sticker|audio/.test(mime),
    isReply         : m.quoted ? true : false,
    autodelete      : from && isCmd ? db_antidel.includes(from) : false,
    grub_action     : from && isCmd ? Object.keys(db_gcawait).includes(from) : false,

    // Content data
    mentionByTag    : m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : [],
    time            : moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z'),
    salam           : moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a'),
    groupMetadata,
    sender,
    from,
    pushname,
    text,
    full_text : body,
    quoted_reply : m.quoted ? m.quoted : m
    
}


if (resbot_.superOwner) {

    resbot_.isOwner = true;
    resbot_.isPremium = true;
}




// GROUP ACTION OPEN


// Simpan ID timeout dalam objek
let timeoutIds = {};

if (resbot_.grub_action) {
    const action_gc = db_gcawait[from];

    var date1 = new Date("2022-01-01 " + jammenit);
    var date2 = new Date("2022-01-01 " + action_gc.waktu);

    if (date2 > date1) {
        var selisihMilidetik = date2 - date1;
    } else {
    }


    if (Object.keys(db_gcawait).includes(from)) {
        delete db_gcawait[from];
        fs.writeFileSync('./db/gcawait.json', JSON.stringify(db_gcawait))

    }

    if (action_gc.action == 'close') {

        if (timeoutIds[from]) {
            clearTimeout(timeoutIds[from]);
        }

        // Set timeout dan simpan ID timeout dalam objek
        timeoutIds[from] = setTimeout(async () => {
            await autoresbot.groupSettingUpdate(from, 'announcement')
                .then((res) => chat_only(`_Sukses Menutup Group_`))
                .catch((err) => chat_only(jsonformat(err)));

            delete timeoutIds[from];

        }, selisihMilidetik);
    }

    if (action_gc.action == 'open') {

        if (timeoutIds[from]) {
            clearTimeout(timeoutIds[from]);
        }

        timeoutIds[from] = setTimeout(async () => {
            await autoresbot.groupSettingUpdate(from, 'not_announcement')
                .then((res) => chat_only(`_Sukses Membuka Group_`))
                .catch((err) => chat_only(jsonformat(err)));

            delete timeoutIds[from];
        }, selisihMilidetik);
    }
}




// GROUP ACTION CLOSE




// ==================================================================
// ANTI DELETE OPEN

const id_msgUnique = chatUpdate.messages[0].key.id



global.antidelete = global.antidelete || {};

if (m.isGroup && msg_text.trim() !== '') {
    // Check if the key already exists in global.antidelete
    if (!global.antidelete[id_msgUnique]) {
        // Key doesn't exist, create a new entry in global.antidelete with "pesan" as an array
        global.antidelete[id_msgUnique] = {
            "id": id_msgUnique,
            "pesan": [msg_text],
            "token" : "xx"
        };
    } else {
        // Key exists, check if "pesan" is already an array, if not, convert it to an array
        if (!Array.isArray(global.antidelete[id_msgUnique].pesan)) {
            global.antidelete[id_msgUnique].pesan = [global.antidelete[id_msgUnique].pesan];
        }

        // Batasi jumlah maksimal pesan menjadi 10
        const maxPesan = 10;

        // Jika jumlah pesan sudah mencapai maksimal, hapus pesan terlama
        if (global.antidelete[id_msgUnique].pesan.length >= maxPesan) {
            global.antidelete[id_msgUnique].pesan.shift(); // Menghapus pesan terlama
        }

        // Tambahkan pesan baru ke array pesan
        global.antidelete[id_msgUnique].pesan.push(msg_text);
    }
}




const type_chat = chatUpdate.messages[0].mtype;

if (type_chat === 'protocolMessage' && resbot_.autodelete) {
    if (!chatUpdate.messages[0].fromMe) {
        const idDelete = chatUpdate.messages[0].message.protocolMessage.key.id;


        if (global.antidelete[idDelete] && Array.isArray(global.antidelete[idDelete].pesan)) {
            const pesanTerakhir = global.antidelete[idDelete].pesan.slice(-1)[0];
            autoresbot.sendMessage(from,{text: `_*ANTI DELETE*_\n\n${pesanTerakhir}`},{quoted:m})
        } else {
            //console.log('Tidak ada pesan atau pesan bukan merupakan array');
        }

    }
}

// ANTI DELETE CLOSE
// ==================================================================










let isSpam = false;
let detikLagi = 0
let poinspam = false
if (m.sender in global.antiSpam) {
    wspam_fil = (timestamp - global.antiSpam[m.sender].last_time)

    let timespam_spam = Math.ceil( (wspam_fil/1000) )
    
    if (command == global.antiSpam[m.sender].command && timespam_spam < 15) {
        wspam_fil = (timestamp - global.antiSpam[m.sender].last_time)
        detikLagi = 20 - timespam_spam
        isSpam = true
        global.antiSpam[m.sender].poinspam = global.antiSpam[m.sender].poinspam + 1
        poinspam = global.antiSpam[m.sender].poinspam
    }else{
        wspam_fil = -1
        isSpam = false
        poinspam = false
    }
}else {
    wspam_fil = -1

    isSpam = false
    poinspam = false
}


if (config.antispam_filter && m.sender in global.antiSpam) {
    if (global.antiSpam[m.sender].baned) return console.log('Pengguna ini telah di ban')


    if (global.antiSpam[m.sender].poinspam > 4) {
         global.antiSpam[m.sender].baned = true
         autoresbot.sendMessage(from,{text: `Kamu sudah di ban dari bot ini, dan tidak akan bisa menggunakan semua fitur kecuali owner telah unban akun kamu`},{quoted:m})
        return
    }

    if (isSpam) {
        autoresbot.sendMessage(from,{text: `Jangan Spam Kak ! \n\nTunggu ${detikLagi} detik lagi`},{quoted:m})
        return
    }

   


}


/* ===================「 *ᴅᴏɴᴛ ᴇᴅɪᴛ* 」─=================== */




/* ===================「 ᴄᴜꜱᴛᴏᴍɪᴢᴇᴅ 」─=================== */

const audioData = [
  { time: "03:00:00", greeting: 'Selamat Tengah Malam', file: 'tmalam.mp3' },
  { time: "05:00:00", greeting: 'Selamat Subuh', file: 'subuh.mp3' },
  { time: "10:00:00", greeting: 'Selamat Pagi', file: 'pagi.mp3' },
  { time: "15:00:00", greeting: 'Selamat Siang', file: 'siang.mp3' },
  { time: "18:00:00", greeting: 'Selamat Sore', file: 'sore.mp3' },
  { time: "19:00:00", greeting: 'Selamat Petang', file: 'petang.mp3' },
  { time: "23:59:00", greeting: 'Selamat Malam', file: 'malam.mp3' }
];

let ucapanWaktu;

let audio_file;

for (const entry of audioData) {
  if (time2 < entry.time) {
    ucapanWaktu = entry.greeting;
    audio_file = entry.file;
    lll = entry.time
    break;
  }
}

    
try {
    pp_users = await autoresbot.profilePictureUrl(anu.id, 'image')
} catch {
    pp_users = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
const resbot = {
key: {
    participant: `0@s.whatsapp.net`,
    ...(m.chat ? {
        remoteJid: `status@broadcast`
    } : {})
},
message: {
    "contactMessage": {
        'displayName': `${pushname}`,
        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Koi,;;;\nFN: RoyalBOT\nitem1.TEL;waid=${m.sender.split("@")[0]}:+${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        'jpegThumbnail': pp_users,
        thumbnail: pp_users,
        sendEphemeral: true
    }   
}
}
const resbot2 = {
    key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? {
            remoteJid: "status@broadcast"
        } : {})
    },
    message: {
        "extendedTextMessage": {
            "text": ucapanWaktu,
            "title": ``,
            "thumbnailUrl": pp_users
        }
    }
}


const AntiSpam = (sender) => {
    let antispam_person =  {
        "sender" : m.sender,
        "command" : command,
        'last_time' : timestamp,
        'poinspam' : poinspam,
        'baned' : false
        }
    global.antiSpam[sender] = antispam_person


}



const GcSiderUpdate = (sender,from) => {



     if (!db_sider[from]) {
         db_sider[from] = [{ user_id: sender, tanggal: tgl_hariini, timestamp: timestamp  }];
         fs.writeFileSync('./db/sider.json', JSON.stringify(db_sider))
}else{
 const cek_sideron = db_sider[from].findIndex(item => item.user_id === sender);

      if (cek_sideron !== -1) {
          db_sider[from][cek_sideron].timestamp = timestamp;
        }else {
            // menambah user sider
            db_sider[from].push({ user_id: sender, tanggal: tgl_hariini, timestamp: timestamp  });
        }
        fs.writeFileSync('./db/sider.json', JSON.stringify(db_sider))
}





}

async function restaring() {
var loadingrsbot = [
"Server akan di restart dalam 4 detik",
"Server akan di restart dalam 3 detik",
"Server akan di restart dalam 2 detik",
"Server akan di restart dalam 1 detik",
]
let { key } = await autoresbot.sendMessage(from, {text: 'Server akan di restart dalam 5 detik'},  { quoted: m })

for (let i = 0; i < loadingrsbot.length; i++) {
await sleep(1000)
await autoresbot.sendMessage(from, {text: loadingrsbot[i], edit: key }, { quoted: m });
}


}


if (resbot_.isMuted) {
    if (!m.isGroup || !resbot_.isPremium) {
        console.log('BOT SEDANG DI MUTED');
        return; // Menghentikan eksekusi lebih lanjut jika kondisi tidak terpenuhi
    }

    if (msg_text.toLowerCase() === 'unmute') {
        let index = db_mute.indexOf(from);
        if (index !== -1) {
            db_mute.splice(index, 1);
            fs.writeFileSync('./db/mute.json', JSON.stringify(db_mute));
            reply('_Bot telah diunmute di grup ini_');
        } else {
            console.log('Pengguna tidak dalam daftar mute');
        }
    } else {
        return console.log('BOT SEDANG DI MUTED');
    }
} 




try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)
            let limitUser = global.limitawal.free
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.afkTime)) user.afkTime = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!isNumber(user.limit)) user.limit = limitUser
            } else global.db.data.users[m.sender] = {
                afkTime: -1,
                afkReason: '',
                limit: limitUser,
            }
            let chats = global.db.data.chats[m.chat]
            if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}
            if (chats) {
                if (!('antilink' in chats)) chats.antilink = false
                if (!('antilinkv2' in chats)) chats.antilinkv2 = false
            } else global.db.data.chats[m.chat] = {
                antilink: false,
                antilinkv2: false
            }
            let setting = global.db.data.settings[botNumber]
            if (typeof setting !== 'object') global.db.data.settings[botNumber] = {}
            if (setting) {
                if (!isNumber(setting.status)) setting.status = 0
               
            } else global.db.data.settings[botNumber] = {
                status: 0
            }

        } catch (err) {
            console.error(err)
        }

function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
  const length = 10;
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

if (m.sender.startsWith('212')) return autoresbot.updateBlockStatus(m.sender, 'block')


if (config.autoread) {
autoresbot.readMessages([m.key])
}


const downloadMp3 = async (Link) => {
    try {
        //const info = await ytdl.getInfo(Link);
        const mp3File = getRandom('.mp3');
        
        ytdl(Link, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(mp3File))
            .on('finish', async () => {
                const audioBuffer = fs.readFileSync(mp3File);
                await autoresbot.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mp4' }, { quoted: m });
                fs.unlinkSync(mp3File);
            });
    } catch (err) {
        reply(`${err}`);
    }
}



function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

const downloadMp4 = async (Link) => {
try {
await ytdl.getInfo(Link)
let mp4File = getRandom('.mp4')
let nana = ytdl(Link)
.pipe(fs.createWriteStream(mp4File))
.on('finish', async () => {
await autoresbot.sendMessage(from, { video: fs.readFileSync(mp4File), gifPlayback: false }, { quoted: m })
fs.unlinkSync(`./${mp4File}`)
})
} catch (err) {
reply(`${err}`)
}
}




// if (resbot_.autodelete) {
// autoresbot.sendMessage(m.chat,
// {
// delete: {
// remoteJid: m.chat,
// fromMe: true,
// id: chatinfo.key.id,
// participant: chatinfo.key.participant
// }
// })
// }

     
if (!config.publik) {
      if (!resbot_.isPremium && !m.key.fromMe) return console.log('MODE SELF AKTIF')
}



if (isCmd && !resbot_.isUser) {
db_pengguna.push(sender)
fs.writeFileSync('./database/user.json', JSON.stringify(db_pengguna, null, 2))
}




// ANTI TOXIC ON
global.UserToxic = global.UserToxic || {};

function tambahUserToxic(user) {
    if (!global.UserToxic[user]) {
        // Jika user belum ada, tambahkan dan set jumlah ke 1
        global.UserToxic[user] = { user, jumlah: 1 };
    } else {
        // Jika user sudah ada, tambahkan 1 ke jumlah
        global.UserToxic[user].jumlah += 1;
    }
}

function cekUserToxic(user) {
    if (global.UserToxic[user]) {
        return global.UserToxic[user].jumlah;
    } else {
        return 0;
    }
}



    
if (config.antitoxic && !msg_text.includes('badword')) {
    msg_text = msg_text.toLowerCase();

    if (db_antitoxic.some(word => msg_text.includes(word))) {
        autoresbot.sendMessage(m.chat, { delete: m.key });
       console.log(`${chalk.yellow.bold('['+jammenit+']')} ${chalk.yellow.bold(pushname)} : ${chalk.whiteBright('ANTI TOXIC DETECTED')} `)


        tambahUserToxic(m.sender);

        const userToxicCount = cekUserToxic(m.sender);

        if (userToxicCount == 4) {
            return reply(`_🚫 Ini Adalah Peringatan Terakhir_ \n\n_Apabila Pesan Kamu Mengandung *Badword* Kamu Akan Di Kick_`);
        }

        if (userToxicCount > 4) {
            return reply(`「 DEMO: ANDA SUDAH DI KICK`);
        }
    }
}


// ANTI TOXIC OFF



// Anti Link
if (antilinkStatus == 'ON') {

            if (msg_text.match(`chat.whatsapp.com`)) {
                if (!resbot_.isBotAdmins) return reply(`「 ANTI LINK WHATSAPP 」\n\nKamu Terdeteksi Mengirim Link Group, Namun sayang saya bukan admin untuk kick kamu !`)
                let gclink          = (`https://chat.whatsapp.com/` + await autoresbot.groupInviteCode(m.chat))
                let isLinkThisGc    = new RegExp(gclink, 'i')
                let isgclink        = isLinkThisGc.test(m.text)
                if (isgclink) return
                if (resbot_.isAdmins) return 
                if (resbot_.isPremium) return 
                    reply(`「 ANTI LINK WHATSAPP 」\n\nKamu Terdeteksi Mengirim Link Group, Maaf Kamu Akan Di Kick !`)
                 
                autoresbot.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            }
        }
if (antilinkv2Status == 'ON') {
    if (msg_text.match(`chat.whatsapp.com`)) {
       if (!resbot_.isBotAdmins) return reply(`「 ANTI LINK WHATSAPP 」\n\nKamu Terdeteksi Mengirim Link Group, Namun sayang saya bukan admin untuk kick kamu !`)
                let gclink          = (`https://chat.whatsapp.com/` + await autoresbot.groupInviteCode(m.chat))
                let isLinkThisGc    = new RegExp(gclink, 'i')
                let isgclink        = isLinkThisGc.test(m.text)
                if (isgclink) return
                if (resbot_.isAdmins) return 
                if (resbot_.isPremium) return 
                    reply(`「 ANTI LINK WHATSAPP TERDETEKSI 」`)
                autoresbot.sendMessage(m.chat, { delete: m.key })
    }
}

if (antilinkv3Status == 'ON') {


    const message = body
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[^\s]+\.[^\s]+/g;
    const links = message.match(urlRegex);

    if (links) {
          if (!resbot_.isBotAdmins) return reply(`「 ANTI ALL LINKS 」 BOT NOT ADMIN`)
        
            if (resbot_.isAdmins || resbot_.isPremium) {

            }else{
                reply(`「 ANTI LINK TERDETEKSI 」`)
                autoresbot.sendMessage(m.chat, { delete: m.key })
                return
            }
        
    }

                 
    
}


let list = []
for (let i of db_owner) {
list.push({
displayName: await autoresbot.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\n
VERSION:3.0\n
N:${await autoresbot.getName(i + '@s.whatsapp.net')}\n
FN:${await autoresbot.getName(i + '@s.whatsapp.net')}\n
item1.TEL;waid=${i}:${i}\n
item1.X-ABLabel:Ponsel\n
item2.EMAIL;type=INTERNET:royalpedia.id@gmail.com\n
item2.X-ABLabel:Email\n
item3.URL:https://royalpedia.id\n
item3.X-ABLabel:Grup WangSaff\n
item4.ADR:;;Japan;;;;\n
item4.X-ABLabel:Region\n
END:VCARD`
})
}





if (resbot_.isMedia && m.msg.fileSha256 && (m.msg.fileSha256.toString('base64') in global.db.data.sticker)) {
let hash = global.db.data.sticker[m.msg.fileSha256.toString('base64')]
let { text, mentionedJid } = hash
let messages = await generateWAMessage(from, { text: text, mentions: mentionedJid }, {
userJid: autoresbot.user.id,
quoted : m.quoted && m.quoted.fakeObj
})
messages.key.fromMe = areJidsSameUser(m.sender, autoresbot.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushName
if (m.isGroup) messages.participant = m.sender
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: 'append'
}
autoresbot.ev.emit('messages.upsert', msg)
}

if (msg_text.startsWith('©️')) {
try {
return reply(JSON.stringify(eval(`${args.join(' ')}`),null,'\t'))
} catch (e) {
reply(e)
}
}

async function sendGeekzMessage(chatId, message, options = {}){
    let generate = await generateWAMessage(chatId, message, options)
    let type2 = getContentType(generate.message)
    if ('contextInfo' in options) generate.message[type2].contextInfo = options?.contextInfo
    if ('contextInfo' in message) generate.message[type2].contextInfo = message?.contextInfo
    return await autoresbot.relayMessage(chatId, generate.message, { messageId: generate.key.id })
}

async function obfus(query) {
return new Promise((resolve, reject) => {
try {
const obfuscationResult = jsobfus.obfuscate(query,
{
compact: false,
controlFlowFlattening: true,
controlFlowFlatteningThreshold: 1,
numbersToExpressions: true,
simplify: true, 
stringArrayShuffle: true,
splitStrings: true,
stringArrayThreshold: 1
}
);
const result = {
status: 200,
author: `Autoresbot`,
result: obfuscationResult.getObfuscatedCode()
}
resolve(result)
} catch (e) {
reject(e)
}
})
}
async function loading(){
    await reply(mess.wait)
}
     
async function ttslide(text) {
    let response = await axios.get(`https://dlpanda.com/id?url=${text}&token=G7eRpMaa`);
    const html = response.data;
    const $ = cheerio.load(html);
    let asd = [];
    let imgSrc = [];
    let creator = 'Jikarinka';

    $('div.col-md-12 > img').each((index, element) => {
        imgSrc.push($(element).attr('src'));
    });

    asd.push({
        creator,
        imgSrc
    });

    let fix = imgSrc.map((e, i) => {
        return {
            img: e,
            creator: creator // Fixed this line to use the same creator for each image
        };
    });

    // Move the return statement outside the loop
    return asd;
}


async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 50,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
    const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');

      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const videos = response.data.data;
        const result = {
          title: videos.title,
          cover: videos.cover,
          origin_cover: videos.origin_cover,
          no_watermark: videos.play,
          watermark: videos.wmplay,
          music: videos.music
        };
        resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};

async function shortener(url) {
  return url;
}

async function tiktok(query) {
  let response = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });

  result = {};

  result.creator = "YNTKTS";
  result.title = clean(response.data.desc);
  result.author = clean(response.data.author);
  result.nowm = await shortener(
    (response.data.links[0].a || "").replace("https", "http")
  );
  result.watermark = await shortener(
    (response.data.links[1].a || "").replace("https", "http")
  );
  result.audio = await shortener(
    (response.data.links[2].a || "").replace("https", "http")
  );
  result.thumbnail = await shortener(response.data.cover);
  return result;
}

async function filterValidImages(images, limit) {
  const validImages = [];
  for (const image of images) {
    if (await isImageURL(image)) {
      validImages.push(image);
      if (validImages.length >= limit) {
        break; // Hentikan jika sudah mencapai jumlah gambar yang diminta
      }
    }
  }
  return validImages;
}

async function isImageURL(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const contentType = res.headers.get('content-type');
    return contentType && contentType.startsWith('image'); // Memeriksa apakah tipe file adalah gambar
  } catch (error) {
    return false; // Jika terjadi kesalahan dalam memeriksa URL, mengembalikan false
  }
}

const sendapk = (teks) => {
autoresbot.sendMessage(from, { document: teks, mimetype: 'application/vnd.android.package-archive'}, {quoted:m})
reply('*Maaf ada yang salah !! Yang Bener Contoh : Yoapk Resbot*')
}
for (let ikalii of db_apk) {
if (msg_text === ikalii) {
let buffer = fs.readFileSync(`./database/apk/${ikalii}.apk`)
sendapk(buffer)
}
}

const sendzip = (teks) => {
autoresbot.sendMessage(from, { document: teks, mimetype: 'application/zip'}, {quoted:m})
reply('*Maaf ada yang salah !! Yang Bener Contoh : Yozip Resbot*')
}
for (let ikali of db_zip) {
if (msg_text === ikali) {
let buffer = fs.readFileSync(`./database/zip/${ikali}.zip`)
sendzip(buffer)
}
}

const senddocu = (teks) => {
autoresbot.sendMessage(from, { document: teks, mimetype: 'application/pdf'}, {quoted:m})
reply('*Maaf ada yang salah !! Yang Bener Contoh : Yopdf Resbot*')
}
for (let ikal of db_document) {
if (msg_text === ikal) {
let buffer = fs.readFileSync(`./database/Docu/${ikal}.pdf`)
senddocu(buffer)
}
}
     

const sendvn = (teks) => {
autoresbot.sendMessage(from, { audio: teks, mimetype: 'audio/mp4', ptt: true }, {quoted:m})
}


try {
ppuser = await autoresbot.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
ppnyauser = await getBuffer(ppuser)

if (('family100'+from in _family100) && isCmd) {
kuis = true
let room = _family100['family100'+from]
let teks = msg_text.toLowerCase().replace(/[^\w\s\-]+/, '')
let isSurender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
if (!isSurender) {
 let index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks)
 if (room.terjawab[index]) return !0
 room.terjawab[index] = m.sender
}
let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
let caption = `
Jawablah Pertanyaan Berikut :\n${room.soal}\n\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''}
${isWin ? `Semua Jawaban Terjawab` : isSurender ? 'Menyerah!' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
}).filter(v => v).join('\n')}
${isSurender ? '' : `Perfect Player`}`.trim()
autoresbot.sendText(from, caption, m, { contextInfo: { mentionedJid: parseMention(caption) }}).then(mes => { return _family100['family100'+from].pesan = mesg }).catch(_ => _)
if (isWin || isSurender) delete _family100['family100'+from]


    return console.log('Family 100 Sedang Aktif')
}




if (tebaklagu.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebaklagu[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {

 AddMoney(m.sender,config.MoneyMenangGame)


   autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Lagu 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Lagu`}, {quoted:m}) 
 delete tebaklagu[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebaklagu }, caption: `Yahh Menyerah\nJawaban:  ${tebaklagu[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lagu`}, {quoted:m}) 
     delete tebaklagu[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebaklagu = replaceNonFirstCharWithAsterisk(tebaklagu[from.split('@')[0]]);
    reply(result_jwb_tebaklagu);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}


}

if (kuismath.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = kuismath[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
 AddMoney(m.sender,config.MoneyMenangGame)
 await reply(`🎮 Kuis Matematika  🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? ketik ${prefix}kuismath`)
 delete kuismath[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Yahh Menyerah\nJawaban:  ${kuismath[from.split('@')[0]]}\n\nIngin bermain? Ketik math`}, {quoted:m}) 
     delete kuismath[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_kuismath = replaceNonFirstCharWithAsterisk(kuismath[from.split('@')[0]]);
    reply(result_jwb_kuismath);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}



}

if (tebakgambar.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebakgambar[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
     AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Gambar 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Gambar`}, {quoted:m})
 delete tebakgambar[from.split('@')[0]]
}  else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebakgambar  }, caption: `Yahh Menyerah\nJawaban:  ${tebakgambar[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak gambar`}, {quoted:m}) 
     delete tebakgambar[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebakgambar = replaceNonFirstCharWithAsterisk(tebakgambar[from.split('@')[0]]);
    reply(result_jwb_tebakgambar);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}



}

if (tebakbendera.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebakbendera[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
 AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Bendera 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Bendera`}, {quoted:m})
 delete tebakbendera[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebakbendera }, caption: `Yahh Menyerah\nJawaban:  ${tebakbendera[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak bendera`}, {quoted:m}) 
     delete tebakbendera[from.split('@')[0]]

    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebakbendera = replaceNonFirstCharWithAsterisk(tebakbendera[from.split('@')[0]]);
    reply(result_jwb_tebakbendera);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}



}


if (tebakkata.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebakkata[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
 AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Kata 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Kata`}, {quoted:m})  
 delete tebakkata[from.split('@')[0]]
}else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebakkata }, caption: `Yahh Menyerah\nJawaban:  ${tebakkata[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak kata`}, {quoted:m}) 
     delete tebakkata[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebakkata = replaceNonFirstCharWithAsterisk(tebakkata[from.split('@')[0]]);
    reply(result_jwb_tebakkata);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}

}


// TEBAK ANGKA
if (tebakangka.hasOwnProperty(from.split('@')[0]) && isCmd) {
    kuis = true;
    jawaban = tebakangka[from.split('@')[0]];

    // Memeriksa apakah msg_text adalah angka
    if (!isNaN(msg_text) && msg_text.toLowerCase() == jawaban) {
        AddMoney(m.sender,config.MoneyMenangGame)
        autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Angka 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Angka`}, {quoted: m});
        delete tebakangka[from.split('@')[0]];
    } else if (!isNaN(msg_text) && msg_text.toLowerCase() < jawaban) {
        reply('Angka *'+msg_text+'* Terlalu Kecil');
    } else if (!isNaN(msg_text) && msg_text.toLowerCase() > jawaban) {
        reply('Angka *'+msg_text+'* Terlalu Besar');
    } else {
        if (msg_text.toLowerCase() == 'nyerah') {
            autoresbot.sendMessage(m.chat, { image: { url: config.game.tebakangka }, caption: `Yahh Menyerah\nJawaban: ${tebakangka[m.sender.split('@')[0]]}\n\nIngin bermain? Ketik tebak angka`}, {quoted: m});
            delete tebakangka[from.split('@')[0]];
        } else {
            reply('*Jawaban Salah!* \n\nKetik \n*nyerah* untuk menyelesaikan');
        }
    }
}







// CAK LONTONG

if (caklontong.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = caklontong[from.split('@')[0]]
deskripsi = caklontong_desk[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
    AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Lontong 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Lontong`}, {quoted:m}) 
 delete caklontong[from.split('@')[0]]
delete caklontong_desk[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebaklontong }, caption: `Yahh Menyerah\nJawaban:  ${caklontong[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lontong`}, {quoted:m}) 
     delete caklontong[from.split('@')[0]]
    delete caklontong_desk[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_caklontong_desk = replaceNonFirstCharWithAsterisk(caklontong[from.split('@')[0]]);
    reply(result_jwb_caklontong_desk);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}


}



// tebak kalimat

if (tebakkalimat.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebakkalimat[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
    AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Kalimat 🎮 \n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Kalimat`}, {quoted:m}) 
 delete tebakkalimat[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebakkalimat }, caption: `Yahh Menyerah\nJawaban:  ${tebakkalimat[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak kalimat`}, {quoted:m}) 
     delete tebakkalimat[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebakkalimat = replaceNonFirstCharWithAsterisk(tebakkalimat[from.split('@')[0]]);
    reply(result_jwb_tebakkalimat);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}


}



// tebak lirik

if (tebaklirik.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebaklirik[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
    AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Lirik 🎮\n\nJawaban Benar 🎉 Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Lirik`}, {quoted:m}) 
 delete tebaklirik[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: config.game.tebaklirik }, caption: `Yahh Menyerah\nJawaban:  ${tebaklirik[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lirik`}, {quoted:m}) 
     delete tebaklirik[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebaklirik = replaceNonFirstCharWithAsterisk(tebaklirik[from.split('@')[0]]);
    reply(result_jwb_tebaklirik);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}




}


// Tebak tebakan
if (tebaktebakan.hasOwnProperty(from.split('@')[0]) && isCmd) {
kuis = true
jawaban = tebaktebakan[from.split('@')[0]]
if (msg_text.toLowerCase() == jawaban) {
    AddMoney(m.sender,config.MoneyMenangGame)
 autoresbot.sendMessage(m.chat, { image: ppnyauser, caption: `🎮 Tebak Tebakan 🎮\n\nJawaban Benar 🎉Anda Dapat *${config.MoneyMenangGame}* Money\n\nIngin bermain lagi? Silahkan Ketik Tebak Tebakan`}, {quoted:m}) 
 delete tebaktebakan[from.split('@')[0]]
} else {
    if (msg_text.toLowerCase() == 'nyerah') {


     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Yahh Menyerah\nJawaban:  ${tebaktebakan[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak tebakan`}, {quoted:m}) 
     delete tebaktebakan[from.split('@')[0]]
     
    }else if(msg_text.toLowerCase() == 'hint'){

    let result_jwb_tebaktebakan = replaceNonFirstCharWithAsterisk(tebaktebakan[from.split('@')[0]]);
    reply(result_jwb_tebaktebakan);

    }else {
        return reply('*Jawaban Salah!* \n\nKetik \n*hint* untuk bantuan \n*nyerah* untuk menyelesaikan')
    }
    
}



}

//TicTacToe
this.game = this.game ? this.game : {}
let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
if (room) {
let ok
let isWin = !1
let isTie = !1
let isSurrender = !1
// reply(`[DEBUG]\n${parseInt(m.text)}`)
if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
isSurrender = !/^[1-9]$/.test(m.text)
if (m.sender !== room.game.currentTurn) { // nek wayahku
if (!isSurrender) return !0
}
if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
reply({
'-3': 'Game telah berakhir',
'-2': 'Invalid',
'-1': 'Posisi Invalid',
0: 'Posisi Invalid',
}[ok])
return !0
}
if (m.sender === room.game.winner) isWin = true
else if (room.game.board === 511) isTie = true
let arr = room.game.render().map(v => {
return {
X: '❌',
O: '⭕',
1: '1️⃣',
2: '2️⃣',
3: '3️⃣',
4: '4️⃣',
5: '5️⃣',
6: '6️⃣',
7: '7️⃣',
8: '8️⃣',
9: '9️⃣',
}[v]
})
if (isSurrender) {
room.game._currentTurn = m.sender === room.game.playerX
isWin = true
}
let winner = isSurrender ? room.game.currentTurn : room.game.winner
let str = `Room ID: ${room.id}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${isWin ? `@${winner.split('@')[0]} Menang!` : isTie ? `Game berakhir` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}

Ketik *nyerah* untuk menyerah dan mengakui kekalahan`
if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== from)
room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = from
if (room.x !== room.o) await autoresbot.sendText(room.x, str, m, { mentions: parseMention(str) } )
await autoresbot.sendText(room.o, str, m, { mentions: parseMention(str) } )
if (isTie || isWin) {
delete this.game[room.id]
}
}

this.suit = this.suit ? this.suit : {}
let roof = Object.values(this.suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender))
if (roof) {
let win = ''
let tie = false
if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == 'wait') {
if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
autoresbot.sendTextWithMentions(from, `@${roof.p2.split`@`[0]} menolak suit, suit dibatalkan`, m)
delete this.suit[roof.id]
return !0
}
roof.status = 'play'
roof.asal = from
clearTimeout(roof.waktu)
//delete roof[roof.id].waktu
autoresbot.sendText(from, `Suit telah dikirimkan ke chat

@${roof.p.split`@`[0]} dan 
@${roof.p2.split`@`[0]}

Silahkan pilih suit di chat masing"
klik https://wa.me/${botNumber.split`@`[0]}`, m, { mentions: [roof.p, roof.p2] })
if (!roof.pilih) autoresbot.sendText(roof.p, `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️`, m)
if (!roof.pilih2) autoresbot.sendText(roof.p2, `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️`, m)
roof.waktu_milih = setTimeout(() => {
if (!roof.pilih && !roof.pilih2) autoresbot.sendText(from, `Kedua pemain tidak niat main,\nSuit dibatalkan`)
else if (!roof.pilih || !roof.pilih2) {
win = !roof.pilih ? roof.p2 : roof.p
autoresbot.sendTextWithMentions(from, `@${(roof.pilih ? roof.p2 : roof.p).split`@`[0]} tidak memilih suit, game berakhir`, m)
}
delete this.suit[roof.id]
return !0
}, roof.timeout)
}
let jwb = m.sender == roof.p
let jwb2 = m.sender == roof.p2
let g = /gunting/i
let b = /batu/i
let k = /kertas/i
let reg = /^(gunting|batu|kertas)/i
if (jwb && reg.test(m.text) && !roof.pilih && !m.isGroup) {
roof.pilih = reg.exec(m.text.toLowerCase())[0]
roof.text = m.text
reply(`Kamu telah memilih ${m.text} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`)
if (!roof.pilih2) autoresbot.sendText(roof.p2, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
}
if (jwb2 && reg.test(m.text) && !roof.pilih2 && !m.isGroup) {
roof.pilih2 = reg.exec(m.text.toLowerCase())[0]
roof.text2 = m.text
reply(`Kamu telah memilih ${m.text} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
if (!roof.pilih) autoresbot.sendText(roof.p, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
}
let stage = roof.pilih
let stage2 = roof.pilih2
if (roof.pilih && roof.pilih2) {
clearTimeout(roof.waktu_milih)
if (b.test(stage) && g.test(stage2)) win = roof.p
else if (b.test(stage) && k.test(stage2)) win = roof.p2
else if (g.test(stage) && k.test(stage2)) win = roof.p
else if (g.test(stage) && b.test(stage2)) win = roof.p2
else if (k.test(stage) && b.test(stage2)) win = roof.p
else if (k.test(stage) && g.test(stage2)) win = roof.p2
else if (stage == stage2) tie = true
autoresbot.sendText(roof.asal, `_*Hasil Suit*_${tie ? '\nSERI' : ''}

@${roof.p.split`@`[0]} (${roof.text}) ${tie ? '' : roof.p == win ? ` Menang \n` : ` Kalah \n`}
@${roof.p2.split`@`[0]} (${roof.text2}) ${tie ? '' : roof.p2 == win ? ` Menang \n` : ` Kalah \n`}
`.trim(), m, { mentions: [roof.p, roof.p2] })
delete this.suit[roof.id]
}
}



let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let jid of mentionUser) {
let user = global.db.data.users[jid]
if (!user) continue
let afkTime = user.afkTime
if (!afkTime || afkTime < 0) continue
let reason = user.afkReason || ''
reply(`🚫 *Jangan tag dia!*
 ❏  *Dia sedang AFK* ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
 ❏  *Selama* ${clockString(new Date - afkTime)}
`.trim())
}
if (global.db.data.users[m.sender].afkTime > -1) {
let user = global.db.data.users[m.sender]
reply(`
🕊️ ${pushname} Telah Kembali Dari Afk\n\n ❏ ${user.afkReason ? ' *Dengan Alasan* : ' + user.afkReason : ''}\n\n ❏  *Selama* : ${clockString(new Date - user.afkTime)}
`.trim())
user.afkTime = -1
user.afkReason = ''
}
     

     
     // TIKTAKTOE
var ky_ttt = []
tttawal= ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"]
idttt = []

ers1 = []
ers2 = []
gilir = []
for (let t of ky_ttt){
idttt.push(t.id)
ers1.push(t.er1)
ers2.push(t.er2)
gilir.push(t.gilir)
}



const isTTT = m.isGroup ? idttt.includes(from) : false
iser1 = m.isGroup ? ers1.includes(sender) : false
iser2 = m.isGroup ? ers2.includes(sender) : false



     
  

if (isTTT && iser2){
if (msg_text.startsWith('Y')){
  tto = ky_ttt.filter(ghg => ghg.id.includes(from))
  tty = tto[0]
  angka = tto[0].angka
  ucapan = `*🎳 Game Tictactoe 🎲*

er1 @${tty.er1.split('@')[0]}=❌
er2 @${tty.er2.split('@')[0]}=⭕

${angka[1]}${angka[2]}${angka[3]}
${angka[4]}${angka[5]}${angka[6]}
${angka[7]}${angka[8]}${angka[9]}

Giliran = @${tty.er1.split('@')[0]}`
  autoresbot.sendMessage(from, ucapan, text, {quoted: m, contextInfo:{mentionedJid: [tty.er1,tty.er2]}})
  }
if (msg_text.startsWith('N')){
tto = ky_ttt.filter(ghg => ghg.id.includes(from))
tty = tto[0]
naa = ky_ttt.filter(toek => !toek.id.includes(from)) 
ky_ttt = naa
autoresbot.sendMessage(from, `Yahh @${tty.er2.split('@')[0]} Menolak:(`,text,{quoted:m,contextInfo:{mentionedJid:[tty.er2]}})
}
}

if (isTTT && iser1){
nuber = parseInt(msg_text)
if (isNaN(nuber)) return
if (nuber < 1 || nuber > 9) return reply('Masukan Angka Dengan Benar')
main = ky_ttt.filter(hjh => hjh.id.includes(from)) 
if (!tttawal.includes(main[0].angka[nuber])) return reply('Udah Di Isi, Isi Yang Lain Gan')
if (main[0].gilir.includes(sender)) return reply('Tunggu Giliran Gan')
s = '❌'
main[0].angka[nuber] = s
main[0].gilir = main[0].er1
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
ky_ttt = naa
pop = main[0]
ky_ttt.push(pop)
tto = ky_ttt.filter(hgh => hgh.id.includes(from))
tty = tto[0]
angka = tto[0].angka
ttt = `${angka[1]}${angka[2]}${angka[3]}\n${angka[4]}${angka[5]}${angka[6]}\n${angka[7]}${angka[8]}${angka[9]}`

ucapmenang = () => {
ucapan1 = `*🎳Result Game Tictactoe 🎲

*Yeyyy Permainan Di Menangkan Oleh *@${tty.er1.split('@')[0]}*\n`
ucapan2 = `*🎳Result Game Tictactoe 🎲*

*Hasil Akhir:*

${ttt}`
autoresbot.sendMessage(from, ucapan1, text, {quoted:m, contextInfo:{mentionedJid: [tty.er1]}})
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
return ky_ttt = naa
}

if (angka[1] == s && angka[2] == s && angka[3] == s) return ucapmenang()

if (angka[1] == s && angka[4] == s && angka[7] == s) return ucapmenang()

if (angka[1] == s && angka[5] == s && angka[9] == s) return ucapmenang()

if (angka[2] == s && angka[5] == s && angka[8] == s) return ucapmenang()

if (angka[4] == s && angka[5] == s && angka[6] == s) return ucapmenang()

if (angka[7] == s && angka[8] == s && angka[9] == s) return ucapmenang()

if (angka[3] == s && angka[5] == s && angka[7] == s) return ucapmenang()

if (angka[3] == s && angka[6] == s && angka[9] == s) return ucapmenang()

if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && ! ttt.includes('4️⃣') && !
ttt.includes('5️⃣') && !
ttt.includes('6️⃣') && ! ttt.includes('7️⃣') && ! ttt.includes('8️⃣') && ! ttt.includes('9️⃣')){
ucapan1 = `*🎳 Result Game Tictactoe 🎲*

*_Permainan Seri 🗿👌_*`
ucapan2 = `*🎳 Result Game Tictactoe 🎲*

*Hasil Akhir:*

${ttt}`
reply(ucapan1)
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
return ky_ttt = naa
}
ucapan = `*🎳 Game Tictactoe 🎲*

er2 @${tty.er2.split('@')[0]}=⭕
er1 @${tty.er1.split('@')[0]}=❌

${ttt}

Giliran = @${tty.er2.split('@')[0]}`
 autoresbot.sendMessage(from, ucapan, text, {quoted: m, contextInfo:{mentionedJid: [tty.er1,tty.er2]}})
}

if (isTTT && iser2){
nuber = parseInt(msg_text)
if (isNaN(nuber)) return
if (nuber < 1 || nuber > 9) return reply('Masukan Angka Dengan Benar')
main = ky_ttt.filter(hjh => hjh.id.includes(from)) 
if (!tttawal.includes(main[0].angka[nuber])) return reply('Udah Di Isi, Isi Yang Lain Gan')
if (main[0].gilir.includes(sender)) return reply('Tunggu Giliran Gan')
s = '⭕'
main[0].angka[nuber] = s
main[0].gilir = main[0].er2
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
ky_ttt = naa
pop = main[0]
ky_ttt.push(pop)
tto = ky_ttt.filter(hgh => hgh.id.includes(from))
tty = tto[0]
angka = tto[0].angka
ttt = `${angka[1]}${angka[2]}${angka[3]}\n${angka[4]}${angka[5]}${angka[6]}\n${angka[7]}${angka[8]}${angka[9]}`

ucapmenang = () => {
ucapan1 = `*?? Result Game Tictactoe 🎲*

Yeyyy Permainan Di Menangkan Oleh *@${tty.er2.split('@')[0]}*\n`
ucapan2 = `*🎳 Game Tictactoe 🎲*

*Hasil Akhir:*

${ttt}`
autoresbot.sendMessage(from, ucapan1, text, {quoted:m, contextInfo:{mentionedJid: [tty.er2]}})
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
return ky_ttt = naa
}




if (angka[1] == s && angka[2] == s && angka[3] == s) return ucapmenang()
if (angka[1] == s && angka[4] == s && angka[7] == s) return ucapmenang()
if (angka[1] == s && angka[5] == s && angka[9] == s) return ucapmenang()
if (angka[2] == s && angka[5] == s && angka[8] == s) return ucapmenang()
if (angka[4] == s && angka[5] == s && angka[6] == s) return ucapmenang()
if (angka[7] == s && angka[8] == s && angka[9] == s) return ucapmenang()
if (angka[3] == s && angka[5] == s && angka[7] == s) return ucapmenang()
if (angka[3] == s && angka[6] == s && angka[9] == s) return ucapmenang()
if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && ! ttt.includes('4️⃣') && !
ttt.includes('5️⃣') && !
ttt.includes('6️⃣') && ! ttt.includes('7️⃣') && ! ttt.includes('8️⃣') && ! ttt.includes('9️⃣')){
ucapan1 = `*🎳Result Game Tictactoe 🎲*

*_Permainan Seri🗿👌*`
ucapan2 = `*🎳 Result Game Tictactoe 🎲*

*Hasil Akhir:*

${ttt}`
reply(ucapan1)
naa = ky_ttt.filter(hhg => !hhg.id.includes(from))
return ky_ttt = naa
}
ucapan = `*🎳 Game Tictactoe 🎲*

er1 @${tty.er1.split('@')[0]}=⭕
er2 @${tty.er2.split('@')[0]}=❌

${ttt}
 
Giliran = @${tty.er1.split('@')[0]}`
 autoresbot.sendMessage(from, ucapan, text, {quoted: m, contextInfo:{mentionedJid: [tty.er1,tty.er2]}})
 }

    

if (config.bot_destination == 'group') {
     console.log('ONLY GROUP')
    if (!m.isGroup) return
}
if (config.bot_destination == 'private') {
    console.log('ONLY PRIVATE')
    if (m.isGroup) return
}


async function fetchDataFromApi(apiUrl, params) {
    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    
    const fullUrl = `${apiUrl}?${queryString}`;

    try {
        const response = await fetchJson(fullUrl);
        return response?.data || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}


function applyStyle(q, styleNumber) {


  if (!q) return reply(`_Example: style RoyalBOT_`);

  const tekspengganti = [
    'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
  ][styleNumber - 1] || '';

  const teksHasil = q.split('').map(char => {
    if (char === ' ' || /[a-z]/.test(char)) {
      return char === ' ' ? ' ' : tekspengganti[char.charCodeAt(0) - 'a'.charCodeAt(0)];
    } else {
      return char;
    }
  }).join('');
  return reply(teksHasil);
}


if (!resbot_.superOwner) {

        if ((config.botDestination === 'group' && !m.isGroup) || (config.botDestination === 'private' && m.isGroup)) {
            
            console.log(`${chalk.redBright('['+jammenit+']')} ${chalk.redBright.bold('DEBUG : only use bot in '+config.botDestination )}`)
            return
        }

}



// CEK LIST ITEM

 if (db_userlist[from]) {
     let resbot_checklist = db_userlist[from].findIndex(data => data.keyword.trim() === resbot_.full_text.trim());

       if (resbot_checklist !== -1) {
           let text_sendlist = db_userlist[from][resbot_checklist].text


           if (db_userlist[from][resbot_checklist].url.length > 5) {
             autoresbot.sendMessage(m.chat, { image : { url : db_userlist[from][resbot_checklist].url }, caption: text_sendlist }, { quoted:m })
         }else{
             return reply(text_sendlist)
         }
          
       }

 }








switch(command) {

/* ===================「 MENU OPEN 」==================== */
case 'menu': 
const menuMapping = {
  'ai'          : menu_ai,
  'anime'       : menu_anime,
  'baned'       : menu_baned,
  'berita'      : menu_berita,
  'info'        : menu_info,
  'database'    : menu_database,
  'download'    : menu_download,
  'game'        : menu_game,
  'group'       : menu_group,
  'information' : menu_information,
  'islamic'     : menu_islamic,
  'islami'      : menu_islamic,
  'islam'       : menu_islamic,
  'image'       : menu_image,
  'maker'       : menu_maker,
  'store'       : menu_store,
  'owner'       : menu_owner,
  'pushkontak'  : menu_pushkontak,
  'random'      : menu_random,
  'textpro'     : menu_textpro,
  'tools'       : menu_tools,
  'more'        : menu_more
};
menu_lib = menuMapping[q] || menu_base;
autoresbot.sendMessage(m.chat, {text: menu_lib}, {quoted: m})

break



case 'allmenu': {
let aresbot = `
╭────────────────────────
│ ᴺᵃᵐᵉ  : *${pushname}*
│ ˢᵗᵃᵗᵘˢ : ${resbot_.superOwner ? '*SuperOwner*' : resbot_.isOwner ? '*Owner*' : resbot_.isPremium ? '*Premium*' : '*User*'}
│ ᴰᵃᵗᵉ   : *${hariini}*
├────
╰────────────────────────
 .͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏.
${menu_all}

`


let searchText = "✦";
let totalAllfitur = (aresbot.match(new RegExp(searchText, "g")) || []).length;
global.totalAllfitur = totalAllfitur


// aresbot = '```'+aresbot+'```'
autoresbot.sendMessage(m.chat, {
    text: aresbot,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true, 
        title: `${ucapanWaktu} ${pushname}`,
        body: config.resbot_version,
        thumbnailUrl: config.allmenu,
        sourceUrl: config.grup,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
   })


    autoresbot.sendMessage(m.chat, { audio: fs.readFileSync('./mp3/'+audio_file), mimetype: 'audio/mp4', ptt: true, fileLength: 88738})



}
break

/* ===================「 MENU CLOSE 」==================== */



// case 'salamualai':
// case 'assalamualaikum':{
//          let kata = `عَلَيْكُمُ السَّلاَمُ   \nWaalaikumussalam kak ${pushname}`;
//          return chat_only(kata)
    
// }
// break


case 'bot':{
         return reply('_Helo ada yang dapat saya bantu ?_')
    
}
break












































/* ========================================================================
_________________________ Artifical Intelegen ___________________________*/

   case 'ai':
    if (resbot_.isBan) return reply(mess.ban);
    if (!q) return reply('_Halo, ada yang bisa dibantu?_');
    if (MinLimit(m.sender) === undefined) return;

    try {
        reply(mess.wait);

        const apiUrl = `${config.urlApikey}/api/chatgpt3`;
        const params = {
            text: q,
            apikey: config.apikey_resbot,
        };

        const aiResponse = await fetchDataFromApi(apiUrl, params);

        if (aiResponse) {
            return reply(aiResponse);
        } else {
            return reply(mess.response_failed)
        }
    } catch (e) {
        console.error(e);
        return reply(mess.response_failed)
    }

    break;



    case 'aimath':
        if (resbot_.isBan) return reply(mess.ban);
        if (!q) return reply('_Hello Ada yang dapat di bantu ? saya bisa memecahkan soal matematika_');
        if (MinLimit(m.sender) === undefined) return;

        try {
            reply(mess.wait);

            const apiUrl = `${config.urlApikey}/api/math`;
            const params = {
                text: q,
                apikey: config.apikey_resbot,
            };

            const aiResponse = await fetchDataFromApi(apiUrl, params);

            if (aiResponse) {
                return reply(aiResponse);
            } else {
                return reply(mess.response_failed)
            }
        } catch (e) {
            console.error(e);
            return reply(mess.response_failed)
        }

    break;


    case 'imageai':
        if (resbot_.isBan) return reply(mess.ban);
        if (!q) return reply('_Example: *imageai kucing*_');
        if (MinLimit(m.sender) === undefined) return;

        try {
            reply(mess.wait);

            const apiUrl = `${config.urlApikey}/api/imgai`;
            const params = {
                text: q,
                apikey: config.apikey_resbot,
            };

            const aiResponse = await fetchDataFromApi(apiUrl, params);

            if (aiResponse) {
                return autoresbot.sendMessage(m.chat, { image : { url : aiResponse.aiImageData[0].images[0].url }, caption: mess.success }, { quoted:m });
            } else {
                return reply(mess.response_failed)
            }
        } catch (e) {
            console.error(e);
            return reply(mess.response_failed)
        }

    break;



    case 'simi':
        if (resbot_.isBan) return reply(mess.ban);
        if (!q) return reply('_Iya Kak?_');
        if (MinLimit(m.sender) === undefined) return;

        try {
            reply(mess.wait);

            const apiUrl = `${config.urlApikey}/api/simi`;
            const params = {
                language : 'id',
                text: q,
                apikey: config.apikey_resbot,
            };

            const aiResponse = await fetchDataFromApi(apiUrl, params);

            if (aiResponse) {
                return reply(aiResponse);
            } else {
                return reply(mess.response_failed)
            }
        } catch (e) {
            console.error(e);
            return reply(mess.response_failed)
        }

    break;


     case 'gemini':
        if (resbot_.isBan) return reply(mess.ban);
        if (!q) return reply('_Iya Kak?_');
        if (MinLimit(m.sender) === undefined) return;

        try {
            reply(mess.wait);

            const apiUrl = `${config.urlApikey}/api/gemini`;
            const params = {
                text: q,
                apikey: config.apikey_resbot,
            };

            const aiResponse = await fetchDataFromApi(apiUrl, params);

            if (aiResponse) {
                return reply(aiResponse);
            } else {
                return reply(mess.response_failed)
            }
        } catch (e) {
            console.error(e);
            return reply(mess.response_failed)
        }

    break;



    case 'voiceai':
    if (resbot_.isBan) return reply(mess.ban);
    if (!text) return reply(`_Gunakan perintah *voiceai text*_`)
    if (MinLimit(m.sender) === undefined) return;

    try {
        reply(mess.wait);

        const apiUrl = `${config.urlApikey}/api/sound/id-ID`;
        const params = {
            text: q,
            apikey: config.apikey_resbot,
        };

        const aiResponse = await fetchDataFromApi(apiUrl, params);

        if (aiResponse) {
            return autoresbot.sendMessage(m.chat, { audio: { url: aiResponse }, mimetype: 'audio/mp4', ptt: true } )
        } else {
            return reply(mess.response_failed)
        }
    } catch (e) {
        console.error(e);
        return reply(mess.response_failed)
    }

    break;


    case 'igemini':
    case 'geminiimage':{
        if (!isImage) return reply(`Balas/Kirim Gambar Serta Perintahnya Dengan *${prefix + command}*`);
        if (!q) return reply('_Apa Perintahnya ?_')
        if (MinLimit(m.sender) === undefined) return;
        
        reply(mess.wait);

        try {
            const file_hd = await autoresbot.downloadAndSaveMediaMessage(quoted_);
            const url_teleph_hd = await UploadTph(file_hd);
            const result = await fetchJson(`${config.urlApikey}/api/gemini-image?apikey=${config.apikey_resbot}&url=${url_teleph_hd}&text=${q}`);
            if (result && result.data) {

            return reply(result.data)
        }else{
            return reply(mess.response_failed)
        }
        } catch (error) {
            console.error(error);
            return reply(mess.response_failed)
        }
    }
    break;




















/* ========================================================================
_________________________________ Anime _________________________________*/



case 'waifu':case 'neko':case 'shinobu':case 'megumin':case 'bully':case 'cuddle':case 'cry':case 'hug':case 'awoo':case 'kiss':case 'lick':case 'pat':case 'smug':case 'bonk':case 'yeet':case 'blush':case 'smile':case 'wave':case 'highfive':case 'handhold':case 'nom':case 'bite':case 'glomp':case 'slap':case 'kill':case 'happy':case 'wink':case 'poke':case 'dance':case 'cringe':
    if (resbot_.isBan) return reply(mess.ban)
    if (MinLimit(m.sender) === undefined) return;

    try {   
        reply(mess.wait);

        const apiUrl = `${config.urlApikey}/api/anime`;
        const params = {
            method: command,
            apikey: config.apikey_resbot,
        };

        const aiResponse = await fetchDataFromApi(apiUrl, params);

        if (aiResponse) {
            return autoresbot.sendMessage(m.chat, { image : { url : aiResponse }, caption: mess.success }, { quoted:m })
        } else {
            return reply(mess.response_failed)
        }

    } catch(e) {
            return reply(mess.response_failed)
    }

break



case 'husbando':
    
    try{
        let husbando = await getBuffer(`${config.urlApikey}/api/husbando?apikey=${config.apikey_resbot}`)
        await autoresbot.sendMessage(m.chat, {image: husbando, caption: mess.success }, {quoted: m})

    } catch(e){
        reply(mess.response_failed)
    }

break













































/* ========================================================================
_________________________________ Baned _________________________________*/

         
case 'verif@': case 'kenon': {
if (!resbot_.isOwner) return reply(mess.owner)

if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Perdido/roubado: desative minha conta`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19574.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007982238")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.kenon)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'banned': {
if (!resbot_.isOwner) return reply(mess.owner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === global.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `I noticed that a user was using modified whatsapp, so i ask support to ban this account for violating terms of service, and the account uses a WhatsApp bot that can send malicious messages so that other users' WhatsApp cannot work
Number : +${targetnya}`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses banned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(180000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.banned)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'unbanned': {
if (!resbot_.superOwner) return reply(mess.superOwner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Aku Tidak Tau Mengapa Nomor Saya Tiba Tiba Di Larang Dari Menggunakan WhatsApp Aku Hanya Membalas Pesan Customer Saya Mohon Buka Larangan Akun WhatsApp Saya: [+${targetnya}]
Terimakasih`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses unbanned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(90000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.unbanned)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'unbannedv2': {
if (!resbot_.isOwner) return reply(mess.owner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Pihak WhatsApp yang terhormat mohon bantuan anda segera
[${targetnya}]
Saya telah mengirim beberapa email dan laporan ke pihak WhatsApp untuk mengajukan banding agar nomor saya cepat di buka dari daftar blokir, saya sangat membutuhkan untuk keperluan pribadi berkomunikasi dengan keluarga jika saya melakukan pelanggaran sebelumnya maka saya akan menggunakan nomor saya tersebut dengan lebih hati-hati dan lebih baik lagi dari sebelumnya dan saya sekarang telah menuruti apa yang pihak WhatsApp sarankan, dan saya sangat berharap sekarang juga nomor saya dapat di gunakan kembali. Terimakasih`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses unbanned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(90000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.unbannedv2)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'unbannedv3': {
if (!resbot_.isOwner) return reply(mess.owner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Hola WhatsApp
Actualmente, algunas personas tienen muchas formas efectivas de bloquear números de usuario e informarlos sin ningún motivo, de hecho, conozco bien los términos de servicio y los cumplí, pero algunos piratas informáticos me hicieron un informe falso y mi número fue bloqueado, desbloquee el número ${targetnya}`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses unbanned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(90000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.unbannedv3)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'unbannedv4': {
if (!resbot_.isOwner) return reply(mess.owner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Good day whatsApp team. My whatApp account has been burned permanently, please i plead with you unblock it, i cannot use another number again. I don’t know why it is burned but my friends re suggesting its because i use GB whatsApp, which i didn’t know it was wrong. My number is [ ${targetnya} ]. Please whatsApp team, help me unblock my account. please i cannot use a new number as my current number is connected to slot of important things like vacancies.
Thank you`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses unbanned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(90000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.unbannedv4)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

case 'unbannedv5': {
if (!resbot_.isOwner) return reply(mess.owner)
if (m.quoted || q) {
var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (tosend === config.owner) return reply(`Tidak bisa verif My Creator!`)
var targetnya = tosend.split('@')[0]

try {
var axioss = require('axios')
let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
let cookie = ntah.headers["set-cookie"].join("; ")
const cheerio = require('cheerio');
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "+")
form.append("phone_number", `+${targetnya}`,)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", `Aloha WhatsApp, ua ʻaihue ʻia kaʻu helu e ka mea hacker, e ʻoluʻolu e wehe hou iā ia [${targetnya}]`)
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19572.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1007965968")
form.append("__comment_req", "0")

let res = await axioss({
url,
method: "POST",
data: form,
headers: {
cookie
}

})
reply(`Wait 1-24 Jam an untuk proses unbanned dari bot dan tunggu ±30 Detik an untuk melihat balasan email dari WhatsApp :3`)
await loading(90000)
let payload = String(res.data)
if (payload.includes(`"payload":true`)) {
reply(global.ban.unbannedv5)
} else if (payload.includes(`"payload":false`)) {
reply(`##- WhatsApp Support -##

Terima kasih telah menghubungi kami. Kami akan menghubungi Anda kembali melalui email, dan itu mungkin memerlukan waktu hingga tiga hari kerja.`)
} else return reply(util.format(res.data))
} catch (err) {reply(`${err}`)}
} else return reply('Masukkan nomor target!')
}
break

































































/* ========================================================================
_________________________________ Berita Menu _________________________________*/

case 'fajar':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
FajarNews().then(async(res) => {
let no = 0;
teks_berita = "";
for (let i of res) {
no += 1;
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Upload: ${i.berita_diupload}\n`
teks_berita += `Jenis: ${i.berita_jenis}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += "";
return reply(teks_berita) 
})
break





case 'cnn':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
CNNNews().then(res => {
let no = 0
teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
reply(teks_berita) 
})
break



case 'cnbc':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
CNBCNews().then(async(res) => {
let no = 0
teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Upload: ${i.berita_diupload}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks_berita }, { quoted:m })
})
break

case 'tribun':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
TribunNews().then(async(res) => {
let no = 0
let teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Upload: ${i.berita_diupload}\n`
teks_berita += `Jenis: ${i.berita_jenis}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks_berita }, { quoted:m })
})
break


case 'kompas':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
KompasNews().then(async(res) => {
let no = 0
let teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Upload: ${i.berita_diupload}\n`
teks_berita += `Jenis: ${i.berita_jenis}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks_berita }, { quoted:m })
})
break

case 'detik':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
DetikNews().then(async(res) => {
let no = 0
let teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Upload: ${i.berita_diupload}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks_berita }, { quoted:m })
})
break

case 'daily':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
DailyNews().then(async(res) => {
let no = 0
let teks_berita = ""
for (let i of res) {
no += 1
teks_berita += `\n• ${no.toString()} •\n`
teks_berita += `Berita: ${i.berita}\n`
teks_berita += `Link: ${i.berita_url}\n`
}
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks_berita }, { quoted:m })
})
break

case 'inews':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
iNews().then(async(res) => {
let no = 0
let teks = ""
for (let i of res) {
no += 1
teks += `\n• ${no.toString()} •\n`
teks += `Berita: ${i.berita}\n`
teks += `Upload: ${i.berita_diupload}\n`
teks += `Jenis: ${i.berita_jenis}\n`
teks += `Link: ${i.berita_url}\n`
}
teks += ""
reply(teks) 
})
break



case 'antara':
if(q) return
if (MinLimit(m.sender) === undefined) return;
if (resbot_.isBan) return reply(mess.ban)
AntaraNews().then(async(res) => {
let no = 0
let teks = ""
for (let i of res) {
no += 1
teks += `\n• ${no.toString()} •\n`
teks += `Berita: ${i.berita}\n`
teks += `Upload: ${i.berita_diupload}\n`
teks += `Jenis: ${i.berita_jenis}\n`
teks += `Link: ${i.berita_url}\n`
}
teks += ""
reply(teks) 
})
break

case "kontan":
if(q) return
if (resbot_.isBan) return reply(mess.ban)
if (MinLimit(m.sender) === undefined) return;
KontanNews().then(async (res) => {
let teks = ""
let no = 0
for (let i of res) {
no += 1
teks += `\n• ${no.toString()} •\n`
teks += `Berita: ${i.berita}\n`
teks += `Jenis: ${i.berita_jenis}\n`
teks += `Upload: ${i.berita_diupload}\n`
teks += `Link: ${i.berita_url}\n`
}
teks += ""
autoresbot.sendMessage(m.chat, { image : { url : res[0].berita_thumb }, caption: teks }, { quoted:m })
})
break


case "jalantikus":
if(q) return
    if (MinLimit(m.sender) === undefined) return;
var reis = await JalanTikusMeme()
teks_berita = "";
teks_berita += "Jalan Tikus Meme\n\n"
teks_berita += `Source: ${reis}`
teks_berita += ""
autoresbot.sendMessage(m.chat, { image : { url : reis }, caption: teks_berita }, { quoted:m })

break






















































/* ========================================================================
_________________________________ Bot Info _________________________________*/





case 'owner': case 'crator': case 'creator':{
    
    if (db_owner.length === 0) {
        return reply('_Belum ada owner yang tersimpan dalam database._');
    }

 const repf = await autoresbot.sendMessage(from, { 
contacts: { 
displayName: `${db_owner}`, 
contacts: list }, contextInfo: {
forwardingScore: 7, 
isForwarded: true,
mentionedJid: [sender]
}}, { quoted: m })
 
autoresbot.sendMessage(from, { text : `Hai Kak @${sender.split("@")[0]}, Itu adalah nomor owner, untuk mendapatkan support silakan chat melalui WhatsApp`, contextInfo:{
forwardingScore: 7, 
isForwarded: true,
mentionedJid:[sender]
}}, { quoted: repf })
}
break




case 'groupbot':
case 'grupbot':
case 'grubbot': {
if (q) return
autoresbot.sendText(from, `[1] ɢʀᴏᴜᴘ \n${config.grup}`, m)
}
break





















































/* ========================================================================
_________________________________ Database _________________________________*/



case 'addvn': {
  if (!resbot_.isPremium) return reply(mess.premium);
  if (args.length < 1) return reply('Nama audionya apa');

  const audioName = text.toLowerCase();
  if (db_vn.includes(audioName)) return reply("Nama tersebut sudah di gunakan");

  try {
    const mediaData = await autoresbot.downloadAndSaveMediaMessage(quoted);
    db_vn.push(audioName);

    const destinationPath = `./database/Audio/${audioName}.mp3`;
    await fsx.copy(mediaData, destinationPath);
    
    fs.writeFileSync('./database/vnadd.json', JSON.stringify(db_vn));
    fs.unlinkSync(mediaData);
    
    reply(`Sukses Menambahkan Audio\nCek dengan cara ${prefix}listvn`);
  } catch (error) {
    console.error(error);
    return reply(`Balas vn dengan addvn`);
  }
}
break;

case 'sendvn': {
  if (!resbot_.isPremium) return reply(mess.premium);
  if (args.length < 1) return reply('Masukan nama listvn');
  const q = args[0].toLowerCase();
  
  if (!db_vn.includes(q)) return reply("Nama tersebut tidak ada di dalam database");
  
  try {
    const index = db_vn.indexOf(q);
    const namafilevn = db_vn[index];
    const buffer = fs.readFileSync(`./database/Audio/${namafilevn}.mp3`);
    sendvn(buffer);
  } catch (error) {
    console.error(error);
    return reply(mess.gagal);
  }
}
break;

case 'delvn': {
  if (!resbot_.isPremium) return reply(mess.premium);
  if (args.length < 1) return reply('Masukan nama listvn');
  const text = args[0].toLowerCase();
  
  if (!db_vn.includes(text)) return reply("Nama tersebut tidak ada di dalam database");
  
  const index = db_vn.indexOf(text);
  db_vn.splice(index, 1);
  fs.writeFileSync('./database/vnadd.json', JSON.stringify(db_vn));
  fs.unlinkSync(`./database/Audio/${text}.mp3`);
  
  reply(`Sukses delete vn ${text}`);
}
break;

case 'listvn': {
  if (resbot_.isBan) return reply(mess.ban);
  
  if (db_vn.length === 0) return reply('Tidak ada list vn di database');
  
  let teksooo = '⭓「 *LIST VN* 」\n│\n';
  for (let x of db_vn) {
    teksooo += `⭔ ${x}\n`;
  }
  reply(teksooo);
}
break;

        









case "dellist":
     if (!resbot_.isAdmins) return reply(mess.admin)

    if (!q) return reply('_Example: *dellist canva*_')
     const indexToRemove = db_userlist[from].findIndex(data => data.keyword.trim() === q.trim());
      if (indexToRemove !== -1) {
        db_userlist[from].splice(indexToRemove, 1);
          fs.writeFileSync('./db/userlist.json', JSON.stringify(db_userlist))

       return reply(`Item dengan keyword *${q}* berhasil dihapus.`);
      } else {
       return reply(`keyword *${q}* tidak ditemukan.`);
      }
break



case 'list':
    if (resbot_.isBan) return reply(mess.ban)

    if (db_userlist[from] && db_userlist[from].length > 0) {
      let daftar_list = "List:\n";

       for (const data of db_userlist[from]) {
            daftar_list += `- ${data.keyword}\n`;
          }

        return reply(daftar_list)
    }else{
         return reply('_Tidak Ada List Di Grub Ini, silakan ketik *addlist* untuk membuat baru_\n\n_Hanya *admin* yang dapat menambah / menghapus list_')
    }

break





case 'addlist':
    if (!resbot_.isAdmins) return reply(mess.admin)

    if (!q) return reply('_Masukkan Perintah dan Pesannya_\n\nContoh : addlist canva | berikut adalah list canva ... \n\n_Apabila ingin menambah list dan gambar silakan kirim/reply gambarnya dengan caption *addlist*_')

     let [keyword_addlist, text_addlist] = q.split`|`
    if (!keyword_addlist || !text_addlist) return reply('_Masukkan Perintah dan Pesannya_ \n\nContoh : addlist canva | berikut adalah list canva ...')


    let firstPipeIndex = q.indexOf('|');
    let text_addlist2 = firstPipeIndex !== -1 ? q.slice(firstPipeIndex + 1).trim() : q;


    let url_addlist = ''

    if (isImage) {
        reply(mess.wait)
        let media_addlist = await autoresbot.downloadAndSaveMediaMessage(quoted_)
        url_addlist   = await TelegraPh(media_addlist)
            
    }else{
        url_addlist = '-'
    }





if (!db_userlist[from]) {
    db_userlist[from] = [{ keyword: keyword_addlist, text: text_addlist2, url: url_addlist}];
    
    fs.writeFileSync('./db/userlist.json', JSON.stringify(db_userlist))

    return reply(`List sudah di tambahkan 

Ketik list untuk melihat daftar list`)

}else{
     const existingDataIndex = db_userlist[from].findIndex(item => item.keyword === keyword_addlist);



      if (existingDataIndex !== -1) {

        db_userlist[from][existingDataIndex] = { keyword: keyword_addlist, text: text_addlist2,url: url_addlist };
      } else {
        db_userlist[from].push({ keyword: keyword_addlist, text: text_addlist2,url: url_addlist });
      } 


   fs.writeFileSync('./db/userlist.json', JSON.stringify(db_userlist));

     return reply(`List sudah di tambahkan 

Ketik list untuk melihat daftar list`)


}

break














































































/* ========================================================================
_________________________________ Search/Download _________________________________*/



case 'spotify':
    if (args.length === 0) return reply(`_Contoh: *${prefix + command} terbang bersamaku*_`);
    if (MinLimit(m.sender) === undefined) return;

    try {
        reply(mess.wait)
        const resSpotify = await fetchJson(`${config.urlApikey}/api/search/spotify?text=${q}&apikey=${config.apikey_resbot}`);
        if (!resSpotify.data || resSpotify.data.length === 0) return reply(`Tidak dapat menemukan lagu di Spotify.`);
        
        const dSpotify = await fetchJson(`${config.urlApikey}/api/downloader/spotify?url=${resSpotify.data[0].url}&apikey=${config.apikey_resbot}`);
        
        const stringList = `
Title   : ${dSpotify.data.song}
Artist  : ${dSpotify.data.artist}
Album   : ${dSpotify.data.album_name}
Release : ${dSpotify.data.release_date}
`;

        const formattedStringList = '```' + stringList + '```';

        // Kirim gambar cover
        await autoresbot.sendMessage(m.chat, { image: { url: dSpotify.data.cover_url }, caption: formattedStringList }, { quoted: m });

        // Kirim audio
        await autoresbot.sendMessage(m.chat, { audio: { url: dSpotify.data.url }, fileName: `spotify.mp3`, mimetype: 'audio/mp4' });

    } catch (error) {
        console.error(error);
        return reply(mess.response_failed)
    }
    break;





case 'kbbi': {
    if (!q) return reply(`Masukkan Query Contoh ${prefix + command} bumi`)
    if (MinLimit(m.sender) === undefined) return;
    try{
        reply(mess.wait)

        let getKbbi = await fetchJson(`${config.urlApikey}/api/information/kbbi?apikey=${config.apikey_resbot}&text=${q}`)
        await reply(`${getKbbi.data.lema}

${getKbbi.data.arti}`)
    } catch (error){
        console.error(error);
        return reply(mess.response_failed)
    }
}
break



case 'mod': {
    if (!q) return reply(`Masukkan Query Contoh ${prefix + command} picsay`)
    if (MinLimit(m.sender) === undefined) return;
    try{
        reply(mess.wait)
        let mod_happy = await fetchJson(`${config.urlApikey}/api/downloader/mod?apikey=${config.apikey_resbot}&text=${q}`)
        await reply(`⭔ ${mod_happy.data[0].title}

_Link Download :_
${mod_happy.data[0].link}`)
    } catch (error){
        console.error(error);
        return reply(mess.response_failed)
    }
}
break




case 'yts': case 'ytsearch': {
if (!q) return reply(`Example : ${prefix + command} video ngakak`)
    reply(mess.wait)
let search = await yts(q)
if (MinLimit(m.sender) === undefined) return;
let teks = '*YouTube Search*\n\n Result From '+q+'\n\n'
let no = 1
for (let i of search.all) {
teks += `⭔ No : ${no++}\n⭔ Type : ${i.type}\n⭔ Video ID : ${i.videoId}\n⭔ Title : ${i.title}\n⭔ Views : ${i.views}\n⭔ Duration : ${i.timestamp}\n⭔ Upload At : ${i.ago}\n⭔ Url : ${i.url}\n\n─────────────────\n\n`
}
autoresbot.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
}
break



case 'ytmp3': case 'youtubemp3': {

if (!q) return reply(`Example : ${prefix + command} link`)
if (MinLimit(m.sender) === undefined) return;
reply(mess.wait)
    
    try {
         const result = await downloadMp3(q);
    } catch(error){
        return reply(mess.response_failed)

    }

}
break



case 'tiktok':
case 'tt':
case 'tiktokmp4': {
    if (args.length == 0) return reply(`_Example: *${prefix + command}* Masukkan Linknya_`)
    if (MinLimit(m.sender) === undefined) return;
    reply(mess.wait)

    let commandExecuted = false;
    let res = await tiktok2(`${args[0]}`)


    if (res) {
        if (!commandExecuted) {
         autoresbot.sendMessage(m.chat, { video: { url: res.no_watermark }, caption: res.title })
         autoresbot.sendMessage(m.chat, { audio: { url: res.music }, fileName: `tiktok.mp3`, mimetype: 'audio/mp4' })
        commandExecuted = true
        }
    }else {
        return reply(mess.response_failed)
    }
}
break



case 'tiktokht':
case 'tthastag':
case 'tiktoksearch':
case 'ttsearch': {
    if (args.length == 0) return reply(`Example: ${prefix + command} viral`)
    if (MinLimit(m.sender) === undefined) return;
    reply(mess.wait)
    try {
        let res = await tiktoks(`${args[0]}`)
        autoresbot.sendMessage(m.chat, { video: { url: res.no_watermark }, caption: res.title, mimetype: 'video/mp4' })
      } catch (e) {
        return reply(mess.response_failed)
      }
  }
break


case 'ttslide':
case 'tiktokslide': {
    if (args.length === 0 || !q.includes('tiktok')) {
        return reply(`Contoh: \n\n${prefix + command} https://vt.tiktok.com/ZSFka65gt/`);
    }
    const xcvvb = MinLimit(m.sender)
    if (xcvvb === undefined) return;

    try {
        reply(mess.wait);

        const limit = Math.min(parseInt(args[0]) || 4, 4); // Pastikan limit tidak lebih dari 5


        const ttslide_result = await ttslide(q);

        for (let i = 0; i < Math.min(ttslide_result[0].imgSrc.length, limit); i++) {
            await autoresbot.sendMessage(m.chat, { image: { url: ttslide_result[0].imgSrc[i] } });
        }
    } catch (e) {
        return reply(mess.response_failed)
    }

    // Menghentikan eksekusi di sini setelah loop for
    break;
}




            
case 'tiktokmp3': {
            if (args.length == 0) return reply(`Example: ${prefix + command} Masukkan Link nya`)
            if (MinLimit(m.sender) === undefined) return;
            reply(mess.wait)
        try {
            let res = await tiktok2(`${args[0]}`)
                 await autoresbot.sendMessage(m.chat, { audio: { url: res.music }, fileName: `tiktok.mp3`, mimetype: 'audio/mp4' })
            
                 } catch (e) {
        return reply(mess.response_failed)
      }


}
break

case 'ig':
case 'igdl':
    if (!q) return reply("Link?");
    if (MinLimit(m.sender) === undefined) return reply(mess.wait);

    try {
        let res = await fetch(`${config.urlApikey}/api/downloader/instagram?apikey=${config.apikey_resbot}&url=${q}`);
        let json = await res.json();

        let mediaType = json.data[0].type;
        let mediaUrl = json.data[0].url;

        let messageData = {};

        if (mediaType == 'video') {
            messageData = { video: { url: mediaUrl }, caption: mess.success };
        } else if (mediaType == 'image') {
            messageData = { image: { url: mediaUrl }, caption: mess.success };
        }

        await autoresbot.sendMessage(m.chat, messageData, { quoted: m });

    } catch {
        return reply(mess.response_failed)
    }
    break;




case 'fb':
    if (!q) return reply(mess.notlink)

    if (MinLimit(m.sender) === undefined) return;
    
    try {
            reply(mess.wait);

        let res = await fetchJson(`${config.urlApikey}/api/downloader/facebook?apikey=${config.apikey_resbot}&url=${q}`)
       if (res) {
        await autoresbot.sendMessage(m.chat, { video: { url: res.data.video_sd }, mimetype: 'video/mp4' })
       }
    } catch {
       return reply(mess.response_failed)
    }
break;



case 'play':

    if (!q) return reply(`Example: ${prefix + command} lagu terbang bersamaku

Example video : ${prefix + command} video gokil kocak`)

   if (MinLimit(m.sender) === undefined) return;

    reply(mess.wait)

    try {
        let search = await yts(q)
        
        let hasil_search_andplay = search.all.find(item => item.type === 'video')?.url;
         let ytmp4_result_play = await fetchJson(`${config.urlApikey}/api/downloader/ytmp4?apikey=${config.apikey_resbot}&url=${hasil_search_andplay}`)
 
        if (q.includes('video') || q.includes('film')) {
             await autoresbot.sendMessage(m.chat, { video: { url: ytmp4_result_play.data.vid_360p }, fileName: `youtube.mp4`, mimetype: 'video/mp4' })
            
        }else if(q.includes('lagu') || q.includes('sound') || q.includes('musik') || q.includes('music') || q.includes('dj')){
            await downloadMp3(hasil_search_andplay);
        }else{
           await downloadMp3(hasil_search_andplay);
           await autoresbot.sendMessage(m.chat, { video: { url: ytmp4_result_play.data.vid_360p }, fileName: `youtube.mp4`, mimetype: 'video/mp4' })
             
        }


       

    } catch(e) {
        console.log(e)
         return reply(mess.response_failed)
    }


break

case 'ytmp4':
    if (!q) return reply(mess.notlink)
    if (MinLimit(m.sender) === undefined) return;
    reply(mess.wait)
        
    try {   
        let ytmp4_result_play = await fetchJson(`${config.urlApikey}/api/downloader/ytmp4?apikey=${config.apikey_resbot}&url=${q}`)

        await autoresbot.sendMessage(m.chat, { video: { url: ytmp4_result_play.data.vid_360p }, fileName: `youtube.mp4`, mimetype: 'video/mp4' })
      
     
    } catch(e) {
        console.log(e)
         return reply(mess.response_failed)
    }
break





case 'pin':
case 'pinterest': {
  if (!q) return reply('_Example: *.pin kucing*_');
  if (resbot_.isBan) return reply(mess.ban);
  if (MinLimit(m.sender) === undefined) return reply(mess.wait);

  try {
    reply(mess.wait)
    let pinterest_result = await fetchJson(`${config.urlApikey}/api/search/pinterest?text=${q}&apikey=${config.apikey_resbot}`);

    if (pinterest_result.data && pinterest_result.data.length > 0) {
        const randomIndex_pin = Math.floor(Math.random() * pinterest_result.data.length);
        const randomImageUrl_pin = pinterest_result.data[randomIndex_pin];

        autoresbot.sendMessage(from, { image: { url: randomImageUrl_pin }, caption: mess.success }, { quoted: m });
    } else {
        return reply(mess.response_failed)
    }


  } catch (error) {
    console.error(error);
    return reply(mess.response_failed)
  }
  break;
}

        
case 'google': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} fatih arridho`)
reply(mess.wait)
let google = require('google-it')
google({'query': q}).then(res => {
let teks = `Google Search From : ${text}\n\n`
for (let g of res) {
teks += `⭔ *Title* : ${g.title}\n`
teks += `⭔ *Description* : ${g.snippet}\n`
teks += `⭔ *Link* : ${g.link}\n\n────────────────────────\n\n`
} 
reply(teks)
})
}
break

case 'igstalk':
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`Example: ${prefix + command} stef_pubg`)
reply(mess.wait)
axios.get(`${config.urlApikey}/stalk/tiktok?apikey=${config.apikey_resbot}&query=${q}`).then(({ data }) => {
var caption = `Username : ${data.messages.data.username}\n`
caption += `Nickname : ${data.messages.data.name}\n`
caption += `Followers : ${data.messages.data.followers}\n`
caption += `Followings : ${data.messages.data.following}\n`
caption += `Likes : ${data.messages.data.likes}\n`
caption += `Bio : ${data.messages.data.bio}\n`
autoresbot.sendMessage(from, { image: { url: data.messages.data.profile }, caption })
})
break



case 'stalktiktok':
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`Example: ${prefix + command} kompascom`)
reply(mess.wait)
try {

let result_stalktiktok = await fetchJson(`${config.urlApikey}/api/stalker/tiktok?apikey=${config.apikey_resbot}&username=${q}`)

var caption = `Username : ${result_stalktiktok.data.username}\n`
caption += `Nickname : ${result_stalktiktok.data.name}\n`
caption += `Followers : ${result_stalktiktok.data.followers}\n`
caption += `Followings : ${result_stalktiktok.data.following}\n`
caption += `Likes : ${result_stalktiktok.data.likes}\n`
caption += `Bio : ${result_stalktiktok.data.bio}\n`
reply(caption)

} catch(e){
    return reply(mess.response_failed)
}
break




case 'shio': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} tikus\n\nNote : For Detail https://primbon.com/shio.htm`)
    if (db_shio[q]) {
        reply(db_shio[q])
    }else{
        reply('gak ada')
    }

    
}
break


















































/* ========================================================================
_________________________________ Game _________________________________*/


case 'stand':
     if (!global.blackjack[sender]) {
        return reply('Tidak ada permainan blackjack, silakan ketik *blackjack* untuk memulai permainan')
    }



 // USER KARTU

    let stand_userkartu = global.blackjack[sender].userkartu
    let stand_compkartu = global.blackjack[sender].comp_kartu

    let stand_totaluser = getNilaiKartu_Blackjack(stand_userkartu)
    let stand_totalcomp = getNilaiKartu_Blackjack(stand_compkartu)


    if (stand_totaluser > stand_totalcomp) {

    let money_menang = global.blackjack[sender].taruhan * 2
    db_usermoney[sender].money = parseInt(db_usermoney[sender].money) + money_menang
    fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))


     reply(`*KAMU MENANG*

Kartu Kamu : ${stand_userkartu.join(', ')}
Total : ${stand_totaluser}

Kartu Komputer : ${stand_compkartu.join(', ')}
Total : *${stand_totalcomp}*

Anda Mendapat *+ ${money_menang}* Money`)
    }else if(stand_totaluser == stand_totalcomp){


     reply(`*PEMAINAN SERI*

Kartu Kamu : ${stand_userkartu.join(', ')}
Total : ${stand_totaluser}

Kartu Komputer : ${stand_compkartu.join(', ')}
Total : *${stand_totalcomp}*

Money Anda *+ ${global.blackjack[sender].taruhan}*
`)



}else{

        
     reply(`*KAMU KALAH*

Kartu Kamu : ${stand_userkartu.join(', ')}
Total : ${stand_totaluser}

Kartu Komputer : ${stand_compkartu.join(', ')}
Total : *${stand_totalcomp}*

Money Anda *- ${global.blackjack[sender].taruhan}*
`)

    }


delete global.blackjack[sender];
return 




break




case 'hit':
    if (!global.blackjack[sender]) {
        return reply('_Tidak ada permainan blackjack, silakan ketik *blackjack* untuk memulai permainan_')
    }



    let userkartu3 = kartu_blackjack[Math.floor(Math.random() * kartu_blackjack.length)];

    global.blackjack[sender].userkartu.push(userkartu3);

    let hit_kartuDiTangan = global.blackjack[sender].userkartu
    let hit_total_kartuuser = getNilaiKartu_Blackjack(hit_kartuDiTangan)
    


    if (hit_total_kartuuser > 21) {
        
       reply(`*KAMU KALAH*

Kartu Kamu : ${hit_kartuDiTangan.join(', ')}
Total : ${hit_total_kartuuser}

Money Anda *- ${global.blackjack[sender].taruhan}*
`)

delete global.blackjack[sender];

    }else{
         return reply(`*BLACK JACK*

Kartu Kamu : ${hit_kartuDiTangan.join(', ')}
Total : ${hit_total_kartuuser}

Kartu Komputer : ${global.blackjack[sender].comp_kartu[0]} , ?
Taruhan : *${global.blackjack[sender].taruhan}*

Ketik *hit* untuk mengambil kartu tambahan
Ketik *stand* untuk mengakhiri giliran`)
    }

   


break

case 'blackjack':
case 'bj':

if (resbot_.isBan) return reply(mess.ban)
if (!db_usermoney[sender]) {
 db_usermoney[sender] = { limit: 30, money: 0 };
 fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))
}

if (global.blackjack[sender]) {
    return reply('Silakan Selesaikan Permainan, Untuk Bermain Baru')
}else{

    if (!isNaN(parseInt(q))) {
        if (parseInt(q) < 1)  return reply('Masukkan Jumlah Taruhan \n\nExample: blackjack 500')
    }else{
        return reply('Masukkan Jumlah Taruhan \n\nExample: blackjack 1000')
    }

    if (!q) return reply('Masukkan Jumlah Taruhan \n\nExample: blackjack 1000')

   let money_blackjack = db_usermoney[sender].money;

   if (parseInt(money_blackjack) < parseInt(q)) return reply('Money Anda Tidak Cukup \n\nMoney Anda : '+parseInt(money_blackjack))

    // Black Jack Start
   
    

    // USER KARTU
    let userkartu1 = kartu_blackjack[Math.floor(Math.random() * kartu_blackjack.length)];
    let userkartu2 = kartu_blackjack[Math.floor(Math.random() * kartu_blackjack.length)];
    let userkartu_ = `${userkartu1}, ${userkartu2}`

    const kartuDiTangan = [userkartu1, userkartu2];
    let total_kartuuser = getNilaiKartu_Blackjack(kartuDiTangan)
    


    // Komputer kartu
     let compkartu1 = kartu_blackjack[Math.floor(Math.random() * kartu_blackjack.length)];
    let compkartu2 = kartu_blackjack[Math.floor(Math.random() * kartu_blackjack.length)];
    let compkartu_ = `${compkartu1}, ?`

    const kartuDiTangan_comp = [compkartu1, compkartu2];
    let total_kartucomp= getNilaiKartu_Blackjack(kartuDiTangan_comp)



    // db
    global.blackjack[sender] = {userkartu : kartuDiTangan, comp_kartu: kartuDiTangan_comp, taruhan: parseInt(q) }


    // Kurangi money
    db_usermoney[sender].money = parseInt(db_usermoney[sender].money) - parseInt(q)
    fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))



    return reply(`BLACK JACK

Kartu Kamu : ${userkartu_}
Total : ${total_kartuuser}

Kartu Komputer : ${compkartu_}
Taruhan : *${parseInt(q)}*

Ketik *hit* untuk mengambil kartu tambahan
Ketik *stand* untuk mengakhiri giliran`)
}






break



case 'family100': {
    if (resbot_.isBan) return reply(mess.ban)
 if ('family100'+from in _family100) {
 return reply('Masih Ada Sesi Yang Belum Diselesaikan!')
 }
 let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
 let random = anu[Math.floor(Math.random() * anu.length)]
 let hasil = `*Jawablah Pertanyaan Berikut :*\n${random.soal}\n\nTerdapat *${random.jawaban.length}* Jawaban ${random.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''}`.trim()
 _family100['family100'+from] = {
 id: 'family100'+from,
 pesan: await autoresbot.sendText(from, hasil, m),
 ...random,
 terjawab: Array.from(random.jawaban, () => false),
 hadiah: 6,
 }
}
break





case 'tebaklagu': 
case 'tebakgambar': 
case 'tebakkata': 
case 'tebakkalimat': 
case 'tebaklirik': 
case 'tebaklontong': 
case 'tebakbendera': 
case 'tebakangka': 
case 'tebak': {
if (resbot_.isBan) return reply(mess.ban)

 if (q === "lagu" || command === 'tebaklagu') {

     if (tebaklagu.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await JSON.parse(fs.readFileSync('./database/Games/tebaklagu.json'));
     let result = anu[Math.floor(Math.random() * anu.length)]
     console.log("Jawaban: " + result.jawaban)
     let msg = await autoresbot.sendMessage(from, { audio: { url: result.link_song }, mimetype: 'audio/mpeg' }, {quoted:m})
     autoresbot.sendText(from, `Lagu Tersebut Adalah Lagu dari?\n\nArtist : ${result.artist}\nWaktu : 60s`, msg).then(() => {
     tebaklagu[from.split('@')[0]] = result.jawaban.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebaklagu.hasOwnProperty(from.split('@')[0])) {
     
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption:`Waktu Habis\nJawaban:  ${tebaklagu[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lagu`},{quoted:m}) 
     delete tebaklagu[from.split('@')[0]]
     }
 } else if (q === 'gambar' || command === 'tebakgambar') {

     if (tebakgambar.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json')
     let result = anu[Math.floor(Math.random() * anu.length)]
     autoresbot.sendImage(from, result.img, `Silahkan Jawab Soal Di Atas Ini\n\nDeskripsi : ${result.deskripsi}\nWaktu : 60s`, m).then(() => {
     tebakgambar[from.split('@')[0]] = result.jawaban.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebakgambar.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + result.jawaban)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Waktu Habis\nJawaban:  ${tebakgambar[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak gambar`}, {quoted:m}) 
     delete tebakgambar[from.split('@')[0]]
     }


 } else if (q === 'bendera' || command === 'tebakbendera') {

     if (tebakbendera.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     //let anu = await fetchJson(`${config.urlApikey}/tools/tebakbendera?apikey=${config.apikey_resbot}`)
     let anu = await fetchJson(`${config.urlApikey}/api/game/bendera?apikey=${config.apikey_resbot}`)
     
     autoresbot.sendImage(from, anu.url_download, `Sebutkan Nama Negara Di Atas Ini\n\nWaktu : 60s`, m).then(() => {
     tebakbendera[from.split('@')[0]] = anu.name.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebakbendera.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + anu.name)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Waktu Habis\nJawaban:  ${tebakbendera[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak bendera`}, {quoted:m}) 
     delete tebakbendera[from.split('@')[0]]
     }


 } else if (body.includes('angka') ) {

let level_tebakangka = '';

const validLevels = ['easy', 'normal', 'hard', 'expert','setan'];

//if (args[args.length - 1].includes(validLevels.join('|'))) {

if (validLevels.join('|').includes(args[args.length - 1])) {
    level_tebakangka = args[args.length - 1];
} else {
     return reply(`-Masukkan Level\n\nContoh *${prefix}tebak angka easy*\n\n*Opsi*\neasy\nnormal\nhard\nexpert\nsetan`);
}

let angkaAcak = '';
let akhir_angkaAcak = '';

switch (level_tebakangka) {
    case 'easy':
        angkaAcak = Math.floor(Math.random() * 10) + 1;
        akhir_angkaAcak = 10
        break;
    case 'normal':
        angkaAcak = Math.floor(Math.random() * 100) + 1;
        akhir_angkaAcak = 100
        break;
    case 'hard':
        angkaAcak = Math.floor(Math.random() * 1000) + 1;
        akhir_angkaAcak = 1000
        break;
    case 'expert':
        angkaAcak = Math.floor(Math.random() * 10000) + 1;
         akhir_angkaAcak = 10000
        break;
    case 'setan':
        angkaAcak = Math.floor(Math.random() * 10000000000) + 1;
        akhir_angkaAcak = 10000000000
        break;
    default:
        return reply(`+Masukkan Level\n\nContoh *${prefix}tebak angka easy*\n\n*Opsi*\neasy\nnormal\nhard\nexpert\nsetan`);
}


if (tebakangka.hasOwnProperty(from.split('@')[0])) {
    delete tebakangka[from.split('@')[0]];
    return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
}
tebakangka[from.split('@')[0]] = angkaAcak;
reply(`Tebak Angka Dimulai\n\nTebak Angka dari 1 hingga ${akhir_angkaAcak}`);
await sleep(config.sleep_game);

if (tebakangka.hasOwnProperty(from.split('@')[0])) {
    console.log("Jawaban: " + angkaAcak);
    autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Waktu Habis\nJawaban: ${tebakangka[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak angka`}, {quoted: m});
    delete tebakangka[from.split('@')[0]];
}


 } else if (q === 'kata' || command === 'tebakkata') {

     if (tebakkata.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json')
     let result = anu[Math.floor(Math.random() * anu.length)]
     autoresbot.sendText(from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60s`, m).then(() => {
     tebakkata[from.split('@')[0]] = result.jawaban.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebakkata.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + result.jawaban)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Waktu Habis\nJawaban:  ${tebakkata[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak kata` }, {quoted:m}) 
     delete tebakkata[from.split('@')[0]]
     }
 } else if (q === 'kalimat' || command === 'tebakkalimat') {

     if (tebakkalimat.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json')
     let result = anu[Math.floor(Math.random() * anu.length)]
     autoresbot.sendText(from, `Silahkan Jawab Pertanyaan Berikut\n\n${result.soal}\nWaktu : 60s`, m).then(() => {
     tebakkalimat[from.split('@')[0]] = result.jawaban.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebakkalimat.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + result.jawaban)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption:`Waktu Habis\nJawaban:  ${tebakkalimat[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak kalimat`}, {quoted:m}) 
     delete tebakkalimat[from.split('@')[0]]
     }
 } else if (q === 'lirik' || command === 'tebaklirik') {

     if (tebaklirik.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json')
     let result = anu[Math.floor(Math.random() * anu.length)]
     autoresbot.sendText(from, `Ini Adalah Lirik Dari Lagu? : *${result.soal}*?\nWaktu : 60s`, m).then(() => {
     tebaklirik[from.split('@')[0]] = result.jawaban.toLowerCase()
     })
     await sleep(config.sleep_game)
     if (tebaklirik.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + result.jawaban)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption: `Waktu Habis\nJawaban:  ${tebaklirik[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lirik`} , {quoted:m}) 
     delete tebaklirik[from.split('@')[0]]
     }
 } else if (q === 'lontong'  || command === 'tebaklontong') {

     if (caklontong.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
     let anu = await fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json')
     let result = anu[Math.floor(Math.random() * anu.length)]
     autoresbot.sendText(from, `*Jawablah Pertanyaan Berikut :*\n${result.soal}*\nWaktu : 60s`, m).then(() => {
     caklontong[from.split('@')[0]] = result.jawaban.toLowerCase()
    caklontong_desk[from.split('@')[0]] = result.deskripsi
     })
     await sleep(config.sleep_game)
     if (caklontong.hasOwnProperty(from.split('@')[0])) {
     console.log("Jawaban: " + result.jawaban)
     autoresbot.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/1bcdee00d966bde630808.jpg' }, caption:`Waktu Habis\nJawaban:  ${caklontong[from.split('@')[0]]}\nDeskripsi : ${caklontong_desk[from.split('@')[0]]}\n\nIngin bermain? Ketik tebak lontong`}, {quoted:m}) 
     delete caklontong[from.split('@')[0]]
    delete caklontong_desk[from.split('@')[0]]
     }
 }else{
     return reply(`Example : ${prefix + command} lagu\n\nOption : \n1. lagu\n2. gambar\n3. kata\n4. kalimat\n5. lirik\n6.lontong\n7.bendera\n8.angka`)
 }
}
break





case 'kuismath': case 'math': {
if (resbot_.isBan) return reply(mess.ban)
 if (kuismath.hasOwnProperty(from.split('@')[0])) return reply("Masih Ada Sesi Yang Belum Diselesaikan!")
 let { genMath, modes } = require('./src/math')
 if (!q) return reply (`Mode: ${Object.keys(modes).join(' | ')}\nContoh penggunaan: ${prefix}math medium`)
 let result = await genMath(q.toLowerCase())
 autoresbot.sendText(from, `*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nWaktu: ${(result.waktu / 1000).toFixed(2)} detik`, m).then(() => {
 kuismath[from.split('@')[0]] = result.jawaban
 })
 await sleep(result.waktu)
 if (kuismath.hasOwnProperty(from.split('@')[0])) {
 console.log("Jawaban: " + result.jawaban)
 reply("Waktu Habis\nJawaban: " + kuismath[from.split('@')[0]])
 delete kuismath[from.split('@')[0]]
 }
}
break





case 'ttc': case 'ttt': case 'tictactoe': {
if (resbot_.isBan) return reply(mess.ban)
 let TicTacToe = require("./lib/tictactoe")
this.game = this.game ? this.game : {}
if (Object.values(this.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw 'Kamu masih didalam game'
let room = Object.values(this.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
if (room) {
reply('Partner ditemukan!')
room.o = from
room.game.playerO = m.sender
room.state = 'PLAYING'
let arr = room.game.render().map(v => {
return {
X: '❌',
O: '⭕',
1: '1️⃣',
2: '2️⃣',
3: '3️⃣',
4: '4️⃣',
5: '5️⃣',
6: '6️⃣',
7: '7️⃣',
8: '8️⃣',
9: '9️⃣',
}[v]
})
let str = `Room ID: ${room.id}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

Menunggu @${room.game.currentTurn.split('@')[0]}

Ketik *nyerah* untuk menyerah dan mengakui kekalahan`
if (room.x !== room.o) await autoresbot.sendText(room.x, str, m, { mentions: parseMention(str) } )
await autoresbot.sendText(room.o, str, m, { mentions: parseMention(str) } )
} else {
room = {
id: 'tictactoe-' + (+new Date),
x: from,
o: '',
game: new TicTacToe(m.sender, 'o'),
state: 'WAITING'
}
if (text) room.name = text
reply('Menunggu partner' + (text ? ` mengetik command dibawah ini ${prefix}${command} ${text}` : ''))
this.game[room.id] = room
}
}
break





case 'delttc': case 'delttt': {
if (resbot_.isBan) return reply(mess.ban)
 let roomnya = Object.values(this.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))
if (!roomnya) return reply(`Kamu sedang tidak berada di room tictactoe !`)
delete this.game[roomnya.id]
reply(`Berhasil delete session room tictactoe !`)
}
break





case 'suitpvp': case 'suit': {
    if (resbot_.isBan) return reply(mess.ban)
this.suit = this.suit ? this.suit : {}
let poin = 10
let poin_lose = 10
let timeout = 60000
if (Object.values(this.suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))) reply(`Selesaikan suit mu yang sebelumnya`)
if (m.mentionedJid[0] === m.sender) return reply(`Tidak bisa bermain dengan diri sendiri !`)
if (!m.mentionedJid[0]) return reply(`_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nContoh : ${prefix}suit @${pushname}`, from, { quoted: m })
if (Object.values(this.suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return reply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :(`)
let id = 'suit_' + new Date() * 1
let caption = `_*SUIT PvP*_

@${m.sender.split`@`[0]} menantang @${m.mentionedJid[0].split`@`[0]} untuk bermain suit

Silahkan @${m.mentionedJid[0].split`@`[0]} untuk ketik terima/tolak`
this.suit[id] = {
chat: await autoresbot.sendText(from, caption, m, { mentions: parseMention(caption) }),
id: id,
p: m.sender,
p2: m.mentionedJid[0],
status: 'wait',
waktu: setTimeout(() => {
if (this.suit[id]) autoresbot.sendText(from, `_Waktu suit habis_`, m)
delete this.suit[id]
}, 60000), poin, poin_lose, timeout
}
}
break



case 'truth':
    if (resbot_.isBan) return reply(mess.ban)
if (q) return
const trut =['Pernah suka sama siapa aja? berapa lama?','Kalau boleh atau kalau mau, di gc/luar gc siapa yang akan kamu jadikan sahabat?(boleh beda/sma jenis)','apa ketakutan terbesar kamu?','pernah suka sama orang dan merasa orang itu suka sama kamu juga?','Siapa nama mantan pacar teman mu yang pernah kamu sukai diam diam?','pernah gak nyuri uang nyokap atau bokap? Alesanya?','hal yang bikin seneng pas lu lagi sedih apa','pernah cinta bertepuk sebelah tangan? kalo pernah sama siapa? rasanya gimana brou?','pernah jadi selingkuhan orang?','hal yang paling ditakutin','siapa orang yang paling berpengaruh kepada kehidupanmu','hal membanggakan apa yang kamu dapatkan di tahun ini','siapa orang yang bisa membuatmu sange','siapa orang yang pernah buatmu sange','(bgi yg muslim) pernah ga solat seharian?','Siapa yang paling mendekati tipe pasangan idealmu di sini','suka mabar(main bareng)sama siapa?','pernah nolak orang? alasannya kenapa?','Sebutkan kejadian yang bikin kamu sakit hati yang masih di inget','pencapaian yang udah didapet apa aja ditahun ini?','kebiasaan terburuk lo pas di sekolah apa?']
const ttrth = trut[Math.floor(Math.random() * trut.length)]
truteh = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)

await autoresbot.sendMessage(m.chat, {image: truteh, caption: '*Truth*\n\n'+ ttrth }, {quoted: m})


break

case 'dare':
    if (resbot_.isBan) return reply(mess.ban)
if (q) return
const dare =['Kirim pesan ke mantan kamu dan bilang "aku masih suka sama kamu','telfon crush/pacar sekarang dan ss ke pemain','pap ke salah satu anggota grup','Bilang "KAMU CANTIK BANGET NGGAK BOHONG" ke cowo','ss recent call whatsapp','drop emot "??💨" setiap ngetik di gc/pc selama 1 hari','kirim voice note bilang can i call u baby?','drop kutipan lagu/quote, terus tag member yang cocok buat kutipan itu','pake foto sule sampe 3 hari','ketik pake bahasa daerah 24 jam','ganti nama menjadi "gue anak lucinta luna" selama 5 jam','chat ke kontak wa urutan sesuai %batre kamu, terus bilang ke dia "i lucky to hv you','prank chat mantan dan bilang " i love u, pgn balikan','record voice baca surah al-kautsar','bilang "i hv crush on you, mau jadi pacarku gak?" ke lawan jenis yang terakhir bgt kamu chat (serah di wa/tele), tunggu dia bales, kalo udah ss drop ke sini','sebutkan tipe pacar mu!','snap/post foto pacar/crush','teriak gajelas lalu kirim pake vn kesini','pap mukamu lalu kirim ke salah satu temanmu','kirim fotomu dengan caption, aku anak pungut','teriak pake kata kasar sambil vn trus kirim kesini','teriak " anjimm gabutt anjimmm " di depan rumah mu','ganti nama jadi " BOWO " selama 24 jam','Pura pura kerasukan, contoh : kerasukan maung, kerasukan belalang, kerasukan kulkas, dll']
const der = dare[Math.floor(Math.random() * dare.length)]
buffer = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
await autoresbot.sendMessage(m.chat, {image: buffer, caption: '*Dare*\n\n'+ der }, {quoted: m})
break




case 'bisakah':
    if (resbot_.isBan) return reply(mess.ban)
       if (!q) return reply('Example : *.bisakah anjing terbang*')
const bisa =['Bisa','Tidak Bisa','Coba Ulangi','MANA GW TAU']
const keh = bisa[Math.floor(Math.random() * bisa.length)]
autoresbot.sendMessage(m.chat, {text: '*Pertanyaan :* '+command+' '+q+'\n*Jawaban :* '+ keh }, {quoted: m})
break
case 'kapankah':
    if (resbot_.isBan) return reply(mess.ban)
       if (!q) return reply('Example : *.kapankah tukang bubur naik haji*')

      const kapan =['Besok','Lusa','Tadi','4 Hari Lagi','5 Hari Lagi','6 Hari Lagi','1 Minggu Lagi','2 Minggu Lagi','3 Minggu Lagi','1 Bulan Lagi','2 Bulan Lagi','3 Bulan Lagi','4 Bulan Lagi','5 Bulan Lagi','6 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','6 Tahun Lagi','1 Abad lagi','3 Hari Lagi']
      const koh = kapan[Math.floor(Math.random() * kapan.length)]
      autoresbot.sendMessage(m.chat, {text: '*Pertanyaan :* '+command+' '+q+'\n*Jawaban :* '+ koh }, {quoted: m})
break

case 'cekganteng':
    if (resbot_.isBan) return reply(mess.ban)
      if(resbot_.mentionByTag.length === 0) return reply("Tag Orangnya")
         let gan = ''
        if (resbot_.numberSuperOwner == resbot_.mentionByTag[0]) {
             gan =['83','97','100','102','120','9999','127','86']
         }else{
             gan =['10','30','20','40','50','60','70','62','74','83','97','100','29','94','75','82','41','39']
         }
     
      const teng = gan[Math.floor(Math.random() * gan.length)]
      autoresbot.sendMessage(m.chat, {text: '*Pertanyaan :* '+command+' '+q+'\n*Jawaban :* '+ teng }, {quoted: m})
break

case 'cekcantik':
    if (resbot_.isBan) return reply(mess.ban)
      if(resbot_.mentionByTag.length === 0) return reply("Tag Orangnya")
         let can = ''
       if (resbot_.numberSuperOwner == resbot_.mentionByTag[0]) {
            can =['83','97','100','102','120','9999','127','86']
         } else{
            can =['10','30','20','40','50','60','70','62','74','83','97','100','29','94','75','82','41','39']
         }
      const tik = can[Math.floor(Math.random() * can.length)]
     autoresbot.sendMessage(m.chat, {text: '*Pertanyaan :* '+command+' '+q+'\n*Jawaban :* '+ tik }, {quoted: m})
break

case 'cekmati':
    if (resbot_.isBan) return reply(mess.ban)
     if(resbot_.mentionByTag.length === 0) return reply("Tag Orangnya")
        let random_cekmati = Math.floor(Math.random() * 31) + 20;
      reply(`Nama : *${q}*\nMati Pada Umur : *${random_cekmati} Tahun*\n\n_Cepet Cepet Tobat Ya Soalnya Mati ga ada yang tau_`)
    
break









































/* ========================================================================
_________________________________ Group Menu _________________________________*/


case 'creategc':
    if (!resbot_.superOwner) return reply(mess.superOwner)
    if (!q) return reply(`_Example: ${prefix+command} nama grub_`)

   let creategc = await autoresbot.groupCreate(q, [])
   await autoresbot.groupSettingUpdate(creategc.id, 'locked').then((res) => console.log(`Sekarang *Hanya Admin Yang Dapat Mengedit Pengaturan Grup*`)).catch((err) => console.log(jsonformat(err)))
   let response_creategc = await autoresbot.groupInviteCode(creategc.id)


   autoresbot.sendMessage(from, { text: `「 *Create Group* 」

_▸ Link : https://chat.whatsapp.com/${response_creategc}
`})

break



case 'badword':
case 'badwords':
    if (resbot_.isBan) return reply(mess.ban)
     teksooo = '*▧ 「 LIST BADWORDS* 」\n\n'
    for (let i of db_antitoxic) {
    teksooo += `✦ ${i}\n`
    }
    teksooo += `\n*Total : ${db_antitoxic.length}*`
    autoresbot.sendMessage(from, { text: teksooo.trim() }, 'extendedTextMessage')
break

case 'addbadword':
case 'addbadwords':
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (resbot_.isBan) return reply(mess.ban)
    if (!q) return reply('Masukkan Textnya')
     q = q.toLowerCase();
     if (db_antitoxic.includes(q)) {
        return reply('_Kata sudah ada dalam daftar *Badwords*_');
    }

    if (q.length < 2) return reply('Minimal 2 Huruf')
    db_antitoxic.push(q)
    fs.writeFileSync('./db/antitoxic.json', JSON.stringify(db_antitoxic))
    reply(`_Kata Telah Ditambahkan Ke List *Badwords*_`)

break


case 'delbadword':
case 'delbadwords':
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (resbot_.isBan) return reply(mess.ban)
    if (!q) return reply('Masukkan Textnya')
    const delbadword_list = db_antitoxic.indexOf(q)
    db_antitoxic.splice(delbadword_list, 1)
    fs.writeFileSync('./db/antitoxic.json', JSON.stringify(db_antitoxic))
    reply(`_Kata Telah Dihapus Dari List *Badwords*_`)
   

break





case 'antidelete':
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!m.isGroup) return reply(mess.group)
    if (!q) {
        return reply('Gunakan perintah antidelete on / off')
    }

    if (q == 'on') {
        db_antidel.push(m.chat) // Use m.chat instead of from
        fs.writeFileSync('./db/antidel.json', JSON.stringify(db_antidel))
        reply('_Antidelete di aktifkan untuk grub ini_')
    }

    if (q == 'off') {
        let index = db_antidel.indexOf(m.chat);
        if (index !== -1) {
            db_antidel.splice(index, 1);
            fs.writeFileSync('./db/antidel.json', JSON.stringify(db_antidel));
            reply('_Antidelete di matikan untuk grub ini_');
        } else {
            console.log('antidelete tidak dalam daftar mute');
        }
    }
    break;




 case 'resetsider':
    if (db_sider && db_sider[from]) {
      delete db_sider[from];
      fs.writeFileSync('./db/sider.json', JSON.stringify(db_sider));
      reply("Sider Berhasil Di Reset Pada Grub ini")
    } else {
      reply("Sider Sudah Di Reset Pada Grub ini")
    }
    break;





case 'gcsider':
if (m.isGroup) { GcSiderUpdate(m.sender,from) }
const sevenDaysAgo = timestamp - (7 * 24 * 60 * 60 * 1000);

const filteredData = db_sider[from].filter(item => item.timestamp >= sevenDaysAgo);



const newDataSider = groupMetadata.participants.filter(item2 => !filteredData.some(item1 => item1.user_id === item2.id));

let arr_membersider = ''
for (let mem of newDataSider) {
arr_membersider += `⭔ @${mem.id.split('@')[0]} _Sider_\n`
}

let mem_sider       = newDataSider.length
let total_memgc     = groupMetadata.size
let teks_gcsider    = `_*${mem_sider} Dari ${total_memgc}* Anggota Grup ${groupMetadata.subject} Adalah Sider_

_*Dengan Alasan :*_
➊ _Tidak Aktif Selama lebih 7 hari_
➋ _Join Tapi Tidak Pernah Nimbrung_

_Harap Aktif Di Grup Karena Akan Ada Pembersihan Member Setiap Saat_


_*List Member Sider*_
${arr_membersider}
`

autoresbot.sendMessage(m.chat, { text: teks_gcsider, mentions: newDataSider.map(a => a.id) }, { quoted:m })


break

case 'listabsen':
    if (resbot_.isBan) return reply(mess.ban)
    if (!m.isGroup) return reply(mess.group)
    if (db_absen[from+tgl_hariini]) {
    let stringAbsen = `*LIST ABSEN [ ${tgl_hariini} ]*\n\n`
    stringAbsen += db_absen[from+tgl_hariini].map(absen => `⭔ @${absen.user_id.split('@')[0]} \n`).join('');    

    let arr_listabsen   = db_absen[from+tgl_hariini].map(absen => ({ id: absen.user_id }));
    let jumlahOrangAbsen= arr_listabsen.length;
    let total_orgdgrub  = participants.length;

    let lomAbsen        = total_orgdgrub - jumlahOrangAbsen

    if (lomAbsen == 0) {
         stringAbsen += `\n*${jumlahOrangAbsen}* Orang Telah Absen Semua`
    }else{
         stringAbsen += `\n*${jumlahOrangAbsen}* Orang Telah Absen, Tersisa ${lomAbsen} Orang`
    }

    autoresbot.sendMessage(m.chat, { text: stringAbsen, mentions: arr_listabsen.map(a => a.id) }, { quoted:m })

    } else{
        return reply('Belum ada absen hari ini')
    }




break


case 'absen':
    if (resbot_.isBan) return reply(mess.ban)
    if (!m.isGroup) return reply(mess.group)
    if (!db_absen[from+tgl_hariini]) {

        // pertama absen
          db_absen[from+tgl_hariini] = [{ user_id: sender, tanggal: tgl_hariini }];
           reply('Absen Berhasil')
    }else {

        // absen kedua
      const sudah_absen = db_absen[from+tgl_hariini].findIndex(item => item.user_id === sender);

      if (sudah_absen !== -1) {
            reply('Kamu sudah absen hari ini')
        }else {
            reply('Absen Berhasil')
            db_absen[from+tgl_hariini].push({ user_id: sender, tanggal: tgl_hariini });
        }
          
    }

 fs.writeFileSync('./db/absen.json', JSON.stringify(db_absen))


break




case 'buylimit':
    if (resbot_.isBan) return reply(mess.ban)

   
    let uang_required = parseInt(q) * 20;
    if (q) {
        if (parseInt(db_usermoney[sender].money) < uang_required) return reply('Money Anda Tidak Cukup Untuk Membeli Limit')


        const extractedNumber = parseInt(q.match(/\d+/));
        if (!isNaN(extractedNumber) && extractedNumber > 0) {
        } else {
             return reply('_Masukkan Format Yang Valid_ \n\n_Example: *buylimit 1000*_')
        }





        let limitadd = parseInt(q)





         db_usermoney[sender].limit = parseInt(db_usermoney[sender].limit) + parseInt(limitadd)
         db_usermoney[sender].money = db_usermoney[sender].money - parseInt(uang_required)



        fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))
        reply('Pembelian Limit Berhasil \n\nLimit Anda Bertambah :  '+limitadd)
    }else {

        if (parseInt(db_usermoney[sender].money) < 1) {
             return reply('Money Anda Tidak Cukup Untuk Membeli Limit')
        }



            let dapatdibeli =  Math.round( parseInt(db_usermoney[sender].money) / 20);
        return reply(`Masukkan jumlah limit yang ingin di beli

Example: *buylimit 100*


Money Anda Sekarang : *${db_usermoney[sender].money}*
Dapat membeli *${dapatdibeli} limit*


Ket.
1 Limit = 20 money`)


    }

    


break

case 'topglobal':
case 'topusers':
case 'topuser':
case 'topmember':
case 'top':

let anggotaDenganAdmin_topmember = [];

let sortedList_top_member = Object.entries(db_usermoney)
  .sort((a, b) => b[1].money - a[1].money)
  .map(([key, value]) => {
    anggotaDenganAdmin_topmember.push({ id: key});
    return `⭔ @${key.split('@')[0]}: ${value.money}`;
  });

let resultString_top_member = sortedList_top_member.join('\n');

autoresbot.sendMessage(m.chat, { text: resultString_top_member, mentions: anggotaDenganAdmin_topmember.map(a => a.id) }, { quoted:m })


break



case 'me':
case 'profile':
case 'my':
case 'limit':
case 'money':
    if (resbot_.isBan) return reply(mess.ban)
    if (q) return

    if (!db_usermoney[sender]) {
   
     db_usermoney[sender] = { limit: 30, money: 0 };
     fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))
}

let limit_meadd = ''

if (resbot_.superOwner || resbot_.isOwner || resbot_.isPremium) {
    limit_meadd = 'Unlimited'
}else{
    limit_meadd = db_usermoney[sender].limit ?? 0
}

let me_money = `
╭─── _*MY PROFILE*_ 
├────
├──
│ Name  : *${pushname}*
│ Level : ${resbot_.superOwner ? '*Super Owner*' : resbot_.isOwner ? '*Owner*' : resbot_.isPremium ? '*Premium*' : '*User*'}
│ Limit : *${limit_meadd}*
│ Money : *${db_usermoney[sender]?.money ?? 0}*
│
├────
╰────────────────────────`


reply(me_money)

break




case 'addlimit':
    if (!resbot_.superOwner) return reply(mess.superOwner)
        if (!q) return reply('Example: addlimit 6289501427163 50')
     users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0].replace(/[^0-9]/g, '')+'@s.whatsapp.net'
    if (users == '@s.whatsapp.net')  {
        users = args[0] + users
    }


    let tolimit = parseInt(args[1])
    if (!isNaN(tolimit)) {
        tolimit = tolimit.toString().replace(/^0+/, '');
    } else {
        return reply('Example: addlimit 6289501427163 50')
    }


    if (!args[1]) return reply('Example: addlimit 6289501427163 50')


    if (!db_usermoney[users]) {
         db_usermoney[users] = { limit: tolimit, money: '0' };
    }else{
         db_usermoney[users].limit = parseInt(db_usermoney[users].limit) + parseInt(tolimit)
    }
   
    fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))

    reply(`Limit *${tolimit}* Telah Di Tambahkan `)
break


case 'addmoney':
    if (!resbot_.superOwner) return reply(mess.superOwner)
     if (!q) return reply('Example: addmoney 6289501427163 50')
    users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0].replace(/[^0-9]/g, '')+'@s.whatsapp.net'
    if (users == '@s.whatsapp.net')  {
        users = args[0] + users
    }

    let tomoney = parseInt(args[1])
     tomoney = tomoney.toString().replace(/^0+/, '');
    if (!args[1]) return reply('Example: addmoney 6289501427163 5000')


    if (!db_usermoney[users]) {
         db_usermoney[users] = { limit: 30, money: tomoney };
    }else{
         db_usermoney[users].money = parseInt(db_usermoney[users].money) + parseInt(tomoney)
    }
   
    fs.writeFileSync('./db/usermoney.json', JSON.stringify(db_usermoney))

    reply(`Money *${tomoney}* Telah Di Tambahkan `)
break




// WELCOME

case 'setwelcome':{
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!q) return reply(`_Masukkan Teksnya_

@NAME untuk menyebut nama
@GROUP untuk menyebut nama grub
@DESC untuk menyebut deskripsi


Contoh : setwelcome Selamat datang @NAME di grub @GROUP`)



if (Array.isArray(db_welcome[from])) {
    db_welcome[from] = [{ text: q, status: 'on' }];
}else {
    db_welcome[from] = [{ text: q, status: 'on' }];
}


fs.writeFileSync('./db/welcome.json', JSON.stringify(db_welcome))

return reply("Welcome Berhasil di Set")
}
break

case 'delwelcome':{
    if (!resbot_.isAdmins) return reply(mess.admin)

if (Array.isArray(db_welcome[from])) {
    delete db_welcome[from];
    fs.writeFileSync('./db/welcome.json', JSON.stringify(db_welcome))
    reply('Welcome Berhasil Di Hapus')

}else {
    reply('Welcome Sudah Di Hapus')
}


}
break

case 'welcome':{
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!q) return reply(`_Status Welcome : *${welcome_status}*_  \n\n_Example : welcome on/off_`)
    if (q == 'on') {

        if (Array.isArray(db_welcome[from])) {
        let existingIndex_on = db_welcome[from].findIndex(data => 'status' in data);

        if (existingIndex_on !== -1) {
                db_welcome[from][existingIndex_on].status = 'on';
                fs.writeFileSync('./db/welcome.json', JSON.stringify(db_welcome))
                return reply('Berhasil Welcome Di Aktifkan')
        }

            
        }else {
            return reply('Anda Belum Membuat Pesan Welcome \n\nSilakan ketik setwelcome')
        }

    }else if(q == 'off') {

         if (Array.isArray(db_welcome[from])) {
        let existingIndex_off = db_welcome[from].findIndex(data => 'status' in data);

        if (existingIndex_off !== -1) {
                db_welcome[from][existingIndex_off].status = 'off';
                fs.writeFileSync('./db/welcome.json', JSON.stringify(db_welcome))
                return reply('Berhasil Welcome Dimatikan')
        }

            
        }else {
            return reply('Anda Belum Membuat Pesan Welcome \n\nSilakan ketik setwelcome')
        }

    } else {
        //return reply('Example : welcome on/off')
    }



}
break




// SET LEFT

case 'setleft':{
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!q) return reply(`_Masukkan Teksnya_

@NAME untuk menyebut nama
@GROUP untuk menyebut nama grub


Contoh : setleft Selamat tingal @NAME telah keluar dari @GROUP`)



if (Array.isArray(db_left[from])) {
    db_left[from] = [{ text: q, status: 'on' }];
}else {
    db_left[from] = [{ text: q, status: 'on' }];
}


fs.writeFileSync('./db/left.json', JSON.stringify(db_left))

return reply("Welcome Berhasil di Set")
}
break

case 'delleft':{
    if (!resbot_.isAdmins) return reply(mess.admin)

if (Array.isArray(db_left[from])) {
    delete db_left[from];
    fs.writeFileSync('./db/left.json', JSON.stringify(db_left))
    reply('Set Left Berhasil Di Hapus')

}else {
    reply('Set Left Sudah Di Hapus')
}


}
break

case 'left':{
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!q) return reply(`_Status Left : *${left_status}*_  \n\n_Example : left on/off_`)
    if (q == 'on') {

        if (Array.isArray(db_left[from])) {
        let existingIndex_on = db_left[from].findIndex(data => 'status' in data);

        if (existingIndex_on !== -1) {
                db_left[from][existingIndex_on].status = 'on';
                fs.writeFileSync('./db/left.json', JSON.stringify(db_left))
                return reply('Berhasil Left Di Aktifkan')
        }

            
        }else {
            return reply('Anda Belum Membuat Pesan Left \n\nSilakan ketik setwelcome')
        }

    }else if(q == 'off') {

         if (Array.isArray(db_left[from])) {
        let existingIndex_off = db_left[from].findIndex(data => 'status' in data);

        if (existingIndex_off !== -1) {
                db_left[from][existingIndex_off].status = 'off';
                fs.writeFileSync('./db/left.json', JSON.stringify(db_left))
                return reply('Berhasil Left Dimatikan')
        }

            
        }else {
            return reply('Anda Belum Membuat Pesan Left \n\nSilakan ketik setwelcome')
        }

    } else {
        //return reply('Example : welcome on/off')
    }



}
break




case 'del': case 'delete':{

if (!resbot_.isAdmins) return reply(mess.admin)

if (quoted) {
    autoresbot.sendMessage(m.chat,{delete: {remoteJid: m.chat, id: m.quoted.id, participant: m.quoted.sender}})
}


}
break

case 'linkgrup':
case 'linkgrub':
case 'linkgroup':
case 'linkgc': {
if (resbot_.isBan) return reply(mess.ban)
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('_Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini_')
let response = await autoresbot.groupInviteCode(from)
autoresbot.sendText(from, `Name Group : ${groupMetadata.subject}\nTotal Member: ${groupMetadata.size}\n\nLink Group : https://chat.whatsapp.com/${response}`, m, { detectLink: true })
}
break


case 'infogrub':
case 'infogroup':
case 'infogc': {
if (resbot_.isBan) return reply(mess.ban)
if (!resbot_.isAdmins) return reply('_Kamu itu bukan admin, jadi jangan pake fitur ini_')
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
let response = await autoresbot.groupInviteCode(from)
let teks = `╭「 *${groupMetadata.subject}* 」
│ Size : ${groupMetadata.size}
│ ID  : ${groupMetadata.id}
│ Link : https://chat.whatsapp.com/${response}
│
│ 
│ *Setting*
│ Antilink     : ${antilinkStatus}
│ Antilinkv2  : ${antilinkv2Status}
│ Antilinkv3  : ${antilinkv3Status}
│ Welcome     : ${global.welcome_status} Versi ${config.typeWelcome}
│ Left     : ${left_status}
╰────────────────────────
`


// autoresbot.sendMessage(from, {text: teks},{quoted:m})

    autoresbot.sendText(from, teks, m, { detectLink: true })
}
break

case 'resetlinkgc':
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
autoresbot.groupRevokeInvite(from)
break


case 'kick': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (users == '@s.whatsapp.net')  return reply('Tag/Reply orangnya')
if (botNumber == users) return reply('Tidak Bisa Kick Diri Sendiri')
let bykick = await autoresbot.groupParticipantsUpdate(from, [users], 'remove')
if (bykick) return reply('Nomor Tersebut Telah Di Kick Dari Group')
}
break

case 'add': {
if (!resbot_.isPremium) return reply(mess.premium)
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
if (!q) return reply('Masukkan Nomornya')
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
console.log(users)
await autoresbot.groupParticipantsUpdate(from, [users], 'add').then((res) => reply('Success') ).catch((err) => reply('Gagal'))


}
break

case 'promote': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await autoresbot.groupParticipantsUpdate(from, [users], 'promote')
reply('Berhasil Di Promote')
}
break

case 'promoteme': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isPremium) return reply(mess.premium)
await autoresbot.groupParticipantsUpdate(from, [m.sender], 'promote')
reply('Berhasil, Sekarang kamu sudah admin')
}
break

case 'demote': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')

let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await autoresbot.groupParticipantsUpdate(from, [users], 'demote')

reply('Berhasil Di Demote')
}
break

case 'h':
case 'hidetag': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isPremium) return reply(mess.premium)
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
autoresbot.sendMessage(from, { text : q ? q : '' , mentions: participants.map(a => a.id)}, {quoted:m})
}
break

case 'grub':
case 'gc':
case 'grup':
case 'groub':
case 'group': {



    if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
    if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
    if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!q) return reply(`_Silahkan Ketik_\n
_${prefix + command} open_
_*${prefix + command} close*_

_${prefix + command} close 12:00_
`)



if (q === 'close') {
    await autoresbot.groupSettingUpdate(from, 'announcement')
        .then((res) => reply(`_Sukses Menutup Group_`))
        .catch((err) => reply(jsonformat(err)));
} else if (q === 'open') {
    await autoresbot.groupSettingUpdate(from, 'not_announcement')
        .then((res) => reply(`_Sukses Membuka Group_`))
        .catch((err) => reply(jsonformat(err)));
} else if (args[1] && args[1].length === 5) {

    const waktu_action_gc = args[1];

    if (!cekFormatWaktu(waktu_action_gc)) {
        return reply(`_🚫 Masukkan Format Jam Yang Valid_\n

Example : 
_${prefix + command} close 12:00_
    `);
    }

// MEMBUAT CRONJOB MANUAL AWAIT
if (!db_gcawait[from]) {
    db_gcawait[from] = { waktu: waktu_action_gc, action: args[0] };
} else {

    db_gcawait[from].waktu = waktu_action_gc;
    db_gcawait[from].action = args[0];
}

  fs.writeFileSync('./db/gcawait.json', JSON.stringify(db_gcawait));
    return reply(`_Berhasil, Group Akan Di ${args[0]} Pada Jam : *${args[1]}*_`);
} else {
    return reply(`_🚫 Masukkan Format Yang Valid_\n
_${prefix + command} open_
_*${prefix + command} close*_

_${prefix + command} close 12:00_
    `);
}


}
break

case 'editinfo': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')

 if (!q) return reply(`Silahkan Ketik\n
${prefix + command} on
${prefix + command} off`)

 if (args[0] === 'on'){
await autoresbot.groupSettingUpdate(from, 'unlocked').then((res) => reply(`Sekarang *Semua Anggota Dapat Mengedit Pengaturan Grup*`)).catch((err) => reply(jsonformat(err)))
 } else if (args[0] === 'off'){
await autoresbot.groupSettingUpdate(from, 'locked').then((res) => reply(`Sekarang *Hanya Admin Yang Dapat Mengedit Pengaturan Grup*`)).catch((err) => reply(jsonformat(err)))
 }

}
break


case 'editsubjek': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
if (!q) return reply('Text nya ?') 
await autoresbot.groupUpdateSubject(m.chat, text).then((res) => console.log('Edit Grub') ).catch((err) => console.log('Edit Grub Gagal'))
             
}
break

case 'editdesk':{
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
if (!q) return reply('Text Nya ?')
await autoresbot.groupUpdateDescription(m.chat, text).then((res) => console.log('Edit Desk Grub') ).catch((err) => console.log('Edit Desk Gagal'))
reply('Silakan Baca Deskripsi Grub Baru \n\n'+q)
}
break

case 'tagall': {
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
let teks = `══✪〘 *👥 Tag All* 〙✪══
 ➲ *Pesan : ${q ? q : 'kosong'}*\n\n`
for (let mem of participants) {
teks += `⭔ @${mem.id.split('@')[0]}\n`
}
autoresbot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted:m })
}
break

case 'demoteall':
if (!resbot_.isPremium) return reply(mess.premium)
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')

var groupe = await autoresbot.groupMetadata(from)
var members = groupe['participants']
var mems = []
members.map(async adm => {
mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
autoresbot.groupParticipantsUpdate(from, mems, 'demote')
reply('Berhasil, Di Demote')
break

case 'promoteall':
if (!resbot_.isPremium) return reply(mess.premium)
if (!m.isGroup) return reply('Buat Di Group Ya Kak!')
if (!resbot_.isBotAdmins) return reply('Jadikan bot sebagai admin terlebih dahulu untuk menggunakan fitur ini')
if (!resbot_.isAdmins) return reply('Kamu itu bukan admin, jadi jangan pake fitur ini')
reply(mess.wait)
var groupe = await autoresbot.groupMetadata(from)
var members = groupe['participants']
var mems = []
members.map(async adm => {
mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
autoresbot.groupParticipantsUpdate(from, mems, 'promote')
break



case 'sewa':
if (resbot_.isBan) return reply(mess.ban)

let teks = `¥ Price Sewa Bot €

🔏 3 hari   = 4k
🔏 7 hari   = 10k
🔏 3 minggu = 21k
🔏 1 bulan  = 30k

Untuk Melanjutkan Sewa Silahkan Ketik Contoh Di bawah
Contoh => sewabot 1 minggu`
teks = '```'+teks+'```'
reply(teks)

break

case 'sewabot':
if (resbot_.isBan) return reply('*Lu Di Ban Owner*')
if (!q) return reply(`*Contoh* :\n#sewabot 3 minggu `)
if (q == '3 hari') {
    timedstamp = 3
    total_harisewa = '3 hari'
}else if(q == '7 hari'){
     timedstamp = 7
    total_harisewa = '7 hari'
}else if(q == '3 minggu'){
     timedstamp = 21
    total_harisewa = '3 minggu'
}else if(q == '1 bulan'){
     timedstamp = 30
    total_harisewa = '1 bulan'
}else {
    let teks = `Format Salah !, silakan pilih list di bawah

🔏 3 hari   = 4k
🔏 7 hari   = 10k
🔏 3 minggu = 21k
🔏 1 bulan  = 30k

Untuk Melanjutkan Sewa Silahkan Ketik Contoh Di bawah
Contoh => sewabot 1 minggu`
teks = '```'+teks+'```'
reply(teks)
}

let expireSewaGc = tanggal(tanggal_add(timedstamp))


let cret = await autoresbot.groupCreate('Sewa RoyalBOT '+total_harisewa, [])
let response = await autoresbot.groupInviteCode(cret.id)
await autoresbot.groupSettingUpdate(cret.id, 'locked').then((res) => console.log(`Sekarang *Hanya Admin Yang Dapat Mengedit Pengaturan Grup*`)).catch((err) => console.log(jsonformat(err)))
await autoresbot.groupUpdateDescription(cret.id, `Grub Ini Masih Ada Hutang

Silakan Untuk Melunasi Pembayaran
Sebelum BOT keluar Otomatis

ID Group: ${cret.id}
Created : ${hariini}
Expired : ${expireSewaGc}

Link Pembayaran :
${config.linkPayment}

Dan Konfirmasi Ke Admin
wa.me/${config.nomorsuperOwner}?text=helomin+mau+konfirmasi+id+grub+${cret.id}

`).then((res) => console.log('Edit Grub') ).catch((err) => console.log('Edit Grub Gagal'))


// Prosess data sewa
const dataPengguna = { 
    'id'    : cret.id,
    'nama'  : 'Sewa RoyalBOT '+total_harisewa,
    'nowa'  : m.sender,
    'mulai' : hariini,
    'akhir' : expireSewaGc,
    'status' : 'belum bayar'

};
let dataSewa = db_sewa[m.sender];
if (dataSewa) {
      const statusPembayaran = dataSewa[0].status;
      if (statusPembayaran === "belum bayar") {
        return reply("Anda Tidak Dapat Menyewa, Karena ada proses sewaan yang belum di bayar");
      }
}


db_sewa[m.sender] = Array.isArray(db_sewa[m.sender]) ? db_sewa[m.sender] : [];

db_sewa[m.sender].push(dataPengguna);

fs.writeFileSync('./db/sewa.json', JSON.stringify(db_sewa))

autoresbot.sendMessage(m.sender, { text: `「 *Create Group Sewa* 」

Sewa Bot Selama *${text}* Sedang Dalam Prosess Silahkan Masuk Melalui Link Group Yang Sudah Di Sediakan..

_▸ Owner : ${config.botname}
_▸ Time : ${moment(cret.creation * 1000 + 3600).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")} WIB
_▸ ID Grub : ${cret.id}
_▸ Link : https://chat.whatsapp.com/${response}
`})
reply('Pesan Dan Link Group Khusus Sudah Terkirim Di Chat Privasi Anda')


break



case 'listsewa':{
if (resbot_.isBan) return reply(mess.ban)
if (!resbot_.isOwner) return reply(mess.owner)
    let listSewa = db_sewa[m.sender];


if (listSewa && listSewa.length > 0) {
let daftarlist = listSewa.map(item => `╭─「 
│ *id*    : ${item.id}
│ *nama* : ${item.nama}
│ *mulai* : ${item.mulai}
│ *akhir* : ${item.akhir}
│ *status* : ${item.status}
╰────────────────────────

`);
 return reply(daftarlist.join(''))
        }else{
            return reply('_Tidak Ada List Sewa_')
        }
}
break



case 'delsewa':{
if (!q) return reply(`_Masukkan ID Grub_\n\n*_Example : delsewa 123456789@g.us_* \n\n_Proses Ini Akan Membuat Bot Akan Keluar Otomatis_`)
if (resbot_.isBan) return reply(mess.ban)
if (!resbot_.isOwner) return reply(mess.owner)

await autoresbot.groupLeave(q)
  .then((res) => {
    reply('Berhasil Keluar Dari Grup');
    delete db_sewa[m.sender];
    fs.writeFileSync('./db/sewa.json', JSON.stringify(db_sewa));
    reply('_Berhasil Menghapus ID Sewa_ '+q+' \n\n_Dan Bot Telah Keluar Dari Group Tersebut_')

  })
  .catch((err) => {
    reply('Keluar Grup Gagal');
  });


}
    
break




case 'outgrup': 
case 'outgrupsewa': 
case 'outgroup': {
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!q) return reply(`example : ${prefix + command} 120363204743427585@g.us`)
    await autoresbot.groupLeave(q).then((res) => reply('Berhasil Keluar Dari Grub') ).catch((err) => reply('Keluar Grub Gagal'))
        
}
break



case 'bcgc': case 'bcgroup': {
if (!resbot_.superOwner) return reply(mess.superOwner)
if (m.isGroup) return reply(mess.private)
if (!q) return reply(`Text mana?\n\nExample : ${prefix + command} ini pesan broadcast tes`)
let getGroups = await autoresbot.groupFetchAllParticipating()
let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
let anu = groups.map(v => v.id)
reply(`Mengirim Broadcast Ke ${anu.length} Group Chat, Waktu Selesai ${anu.length * 1.5} detik`)
for (let i of anu) {
await sleep(1500)
                autoresbot.sendMessage(i, {text: `${q}`})
    }
reply(`Sukses Mengirim Broadcast Ke ${anu.length} Group \n\nHarap hati-hati jangan terlalu sering menggunakan fitur ini karena dapat menyebabkan spam dan akun anda rentan keban`)
}
break

case 'bcimg': case 'bcvid': case 'bcvideo': case 'share': {
if (!resbot_.superOwner) return reply(mess.superOwner)
if (m.isGroup) return reply(mess.private)
if (!text) return reply(`*Penggunaan Salah Silahkan Gunakan Seperti Ini*\n${prefix+command} teks\n\nReply Gambar Untuk Mengirim Gambar Ke Semua Group`)
reply(mess.wait)
let getGroups = await autoresbot.groupFetchAllParticipating()
let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1])
let anu = groups.map((v) => v.id)
global.teksjpm = text
for (let xnxx of anu) {
let metadat72 = await autoresbot.groupMetadata(xnxx)
let participanh = await metadat72.participants
if (/image/.test(mime)) {
media = await autoresbot.downloadAndSaveMediaMessage(quoted)
mem = await UploadTph(media)
await autoresbot.sendMessage(xnxx, { image: { url: mem }, caption: global.teksjpm, contextInfo:{ mentionedJid: participanh.map(a => a.id) } }, { quoted: m })
await sleep(2000)
} else {
if(/video/.test(mime)){
media1 = await autoresbot.downloadAndSaveMediaMessage(quoted)
mem1 = await UploadTph(media1)
await autoresbot.sendMessage(xnxx, { video: { url: mem1 }, caption: global.teksjpm, contextInfo:{ mentionedJid: participanh.map(a => a.id) } }, { quoted: m })
await sleep(2000)
} else {
await autoresbot.sendMessage(xnxx, { text: global.teksjpm, contextInfo:{ mentionedJid: participanh.map(a => a.id) } }, { quoted: m })
await sleep(2000)
}}
}
}
break





case 'antilink': {
                if (!m.isGroup) return reply(mess.group)
                if (!resbot_.isAdmins) return reply(mess.admin)
                if (!resbot_.isBotAdmins) return reply(`Ehh Bot Nya Belum Jadi Admin ☝️😅`)
                if (args[0] === "on") {
                    if (db.data.chats[m.chat].antilink) return reply(`Sudah Aktif Sebelumnya 🕊️`)
                    db.data.chats[m.chat].antilink = true
                    fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
                    return reply(`Antilink Group WhatsApp Aktif 🕊️`)
                } else if (args[0] === "off") {
                    if (!db.data.chats[m.chat].antilink) return reply(`Sudah Nonaktif Sebelumnya 🕊`)
                    db.data.chats[m.chat].antilink = false
                    fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
                    return reply(`Antilink Group WhatsApp Nonaktif 🕊️`)
                } else {
                    return reply(`Mode ${command}\n\n\nKetik ${prefix + command} on/off

Antilink : langsung kick
Antilinkv2 : hanya delete pesan
Antilinkv3 : detect all link dan delete`)
                }
}
break

case 'antilinkv2':
    if (!m.isGroup) return reply(mess.group)
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!resbot_.isBotAdmins) return reply(`Ehh Bot Nya Belum Jadi Admin ☝️😅`)


    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on'){
        global.db.data.chats[m.chat].antilinkv2 = true
        fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
        reply(`Berhasil Mengaktifkan antilinkv2`)
    } else if (q == 'off'){
        global.db.data.chats[m.chat].antilinkv2 = false
        fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
        reply(`Berhasil Mematikan antilinkv2`)
    }else {
                    reply(`Mode ${command}\n\n\nKetik ${prefix + command} on/off

Antilink : langsung kick
Antilinkv2 : hanya delete pesan
Antilinkv3 : detect all link dan delete`)
                }
break



case 'antilinkv3':
    if (!m.isGroup) return reply(mess.group)
    if (!resbot_.isAdmins) return reply(mess.admin)
    if (!resbot_.isBotAdmins) return reply(`Ehh Bot Nya Belum Jadi Admin ☝️😅`)


    if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
    if (q == 'on'){
        global.db.data.chats[m.chat].antilinkv3 = true
        fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
        reply(`Berhasil Mengaktifkan antilinkv3`)
    } else if (q == 'off'){
        global.db.data.chats[m.chat].antilinkv3 = false
        fs.writeFileSync('./db/database.json', JSON.stringify(db.data))
        reply(`Berhasil Mematikan antilinkv3`)
    }else {
                    reply(`Mode ${command}\n\n\nKetik ${prefix + command} on/off

Antilink : langsung kick
Antilinkv2 : hanya delete pesan
Antilinkv3 : detect all link dan delete`)
                }
break


case 'getname': {
if (resbot_.isReply) {
namenye = await autoresbot.getName(m.quoted.sender)
reply(namenye)
} else if (!resbot_.isReply) {
autoresbot.sendMessage(from, {text:"Reply orangnya"}, {quoted:m})
}
}
break


case 'getpic': {
if (resbot_.isReply) {
    console.log('sini 1'+m.quoted)
try {
pporg = await autoresbot.profilePictureUrl(m.quoted.sender, 'image')
} catch {
pporg = 'https://petermarshconsulting.com/wp-content/uploads/2022/07/Screenshot-2022-07-19-at-10.13.31.png'
}


autoresbot.sendMessage(from, { image : { url : pporg }, caption:`Done` }, {quoted:m})
} else if (!resbot_.isReply) {
try {
    console.log('sini 2'+m.sender)
pporgs = await autoresbot.profilePictureUrl(m.sender, 'image')
} catch {
pporgs = 'https://petermarshconsulting.com/wp-content/uploads/2022/07/Screenshot-2022-07-19-at-10.13.31.png'
}
autoresbot.sendMessage(from, { image : { url : pporgs }, caption:`Done` }, {quoted:m})
}
}
break


case "setppbot": {

if (!resbot_.superOwner) return reply(mess.superOwner)
if (!isImage) return reply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
reply(mess.wait)
var medis = await autoresbot.downloadAndSaveMediaMessage(quoted_, 'ppbot.jpeg')

var memeg = await autoresbot.updateProfilePicture(botNumber, { url: medis })
fs.unlinkSync(medis)
reply(`_Berhasil, Foto Profil Bot Telah Di Ganti_`)
}
break




case 'setppgroup': case 'setppgrup': case 'setppgc': {
if (!m.isGroup) return reply(mess.group)
if (!resbot_.isAdmins) return reply(mess.admin)
if (!/image/.test(mime)) return reply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
let media = await autoresbot.downloadAndSaveMediaMessage(quoted)
const oke = await UploadTph(media)
            
            
await autoresbot.updateProfilePicture(from, { url: oke }).catch((err) => fs.unlinkSync(media))
reply('done')
}
break


case 'afk': {
if (resbot_.isBan) return reply(mess.ban)
let user = global.db.data.users[m.sender]
user.afkTime = + new Date
user.afkReason = text
reply(`😓 Yahh, Kak *${pushname}*... Telah Afk\n\n ❏  *Alasan* ${text ? ': ' + text : ''}`)
}
break


case 'listonline':
if (resbot_.isBan) return reply(mess.ban)
if (!m.isGroup) return reply(mess.group)

    let anggotaDenganAdmin = [];
try {
    let teks = ''
    let status_online = ''

    for (let mem of participants) {
        
          if (mem.admin != null) {
             let anggota = {
                  id: mem.id
                };
                teks += `⭔ @${mem.id.split('@')[0]}\n`

                 anggotaDenganAdmin.push(anggota);
            
          }
          
    }

    autoresbot.sendMessage(m.chat, { text: teks, mentions: anggotaDenganAdmin.map(a => a.id) }, { quoted:m })

} catch (e) {
    console.log(e)
}
break


case 'listadmin':
if (resbot_.isBan) return reply(mess.ban)
      if (!m.isGroup) return reply(mess.group)
      try {
            let teks = ''
            for (let mem of participants) {
                  if (mem.admin != null) {
                        teks += `⭔ @${mem.id.split('@')[0]}\n`
                  }
                  
                  }
            autoresbot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted:m })

        } catch (e) {
}
break


case 'listmember':
if (resbot_.isBan) return reply(mess.ban)
      if (!m.isGroup) return reply(mess.group)
      try {
            let teks = ''
            for (let mem of participants) {
                  if (mem.admin == null) {
                        teks += `⭔ @${mem.id.split('@')[0]}\n`
                  }
                  
                  }
            autoresbot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted:m })

        } catch (e) {
}
break


case 'listalluser':
if (resbot_.isBan) return reply(mess.ban)
      if (!m.isGroup) return reply(mess.group)
      try {
            let teks = ''
            for (let mem of participants) {
                        teks += `⭔ @${mem.id.split('@')[0]}\n`
                  }
            autoresbot.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted:m })

        } catch (e) {
}
break


        
case 'setbio':
      if (!resbot_.superOwner) return reply(mess.superOwner)
      if (!q) return reply('Teksnya?')
      autoresbot.updateProfileStatus(`${q}`)
      reply(`_Sukses mengganti bio ke *${q}*_`)
break

case 'setname':
      if (!resbot_.superOwner) return reply(mess.superOwner)
      if (!q) return reply('Teksnya?')
      autoresbot.updateProfileName(q)
      reply(`_Sukses mengganti nama ke *${q}*_`)
break
        

        
        
    case 'mute':
        if (!resbot_.isOwner) return reply(mess.owner)
        if (!m.isGroup) return reply(mess.group)
        if (resbot_.isMuted) return reply(`udah mute`)
        db_mute.push(from)
        fs.writeFileSync('./database/mute.json', JSON.stringify(db_mute))
        reply('_Bot berhasil dimute di grub ini_')
    break




// case 'teswelcome':
//     var bg = "https://img.freepik.com/free-vector/blue-light-arrow-black-with-hexagon-mesh-background_33869-669.jpg?size=626&ext=jpg"

//     let PeopleUser = await processAndDeleteFile(ppuser);
//     let PeopleGroup = await processAndDeleteFile(await autoresbot.profilePictureUrl(groupMetadata.id, "image"));

//     let get_welcome = `${config.urlApikey}/api/maker/welcome?apikey=${config.apikey_resbot}&name=${pushname}&gcname=${groupMetadata.subject}&member=${groupMetadata.size}&ppgc=${PeopleGroup}&pp=${PeopleUser}&bg=${bg}`
//     let result_teswelcome = await getBuffer(get_welcome)

//     autoresbot.sendMessage(from, {image: result_teswelcome, caption: mess.success }, {quoted:m})

// break


// case 'tesleft':
//     var bg = "https://img.freepik.com/free-vector/blue-light-arrow-black-with-hexagon-mesh-background_33869-669.jpg?size=626&ext=jpg"

//     let PeopleUser2 = await processAndDeleteFile(ppuser);
//     let PeopleGroup2 = await processAndDeleteFile(await autoresbot.profilePictureUrl(groupMetadata.id, "image"));

//     let get_welcome2 = `${config.urlApikey}/api/maker/goodbye?apikey=${config.apikey_resbot}&name=${pushname}&gcname=${groupMetadata.subject}&member=${groupMetadata.size}&ppgc=${PeopleGroup2}&pp=${PeopleUser2}&bg=${bg}`
//     let result_teswelcome2 = await getBuffer(get_welcome2)

//     autoresbot.sendMessage(from, {image: result_teswelcome2, caption: mess.success }, {quoted:m})

// break



    case 'ping':

    if (resbot_.isBan) return reply(mess.ban)
        if (q) return
    const startTime = process.hrtime();

    // Lakukan operasi atau perhitungan yang ingin diukur kecepatan responsnya
    // Contoh: operasi sederhana (1 + 1)
    const hasilOperasi = 1 + 1;

    const endTime = process.hrtime(startTime);
    const kecepatanRespon = (endTime[0] * 1e9 + endTime[1]) / 1e6; // Mengambil waktu respons dalam milidetik

    reply('Speed: ' + kecepatanRespon + ' ms');


    break;


case 'uptime':
    if (resbot_.isBan) return reply(mess.ban)
    if(q) return

        reply(formatUptime(os.uptime()) )
break

case 'infosystem':
if (!resbot_.superOwner) return reply(mess.superOwner)

try {


const totalMemoryGB = Math.round(os.totalmem() / (1024 * 1024 * 1024));
const freeMemoryGB  = Math.round(os.freemem() / (1024 * 1024 * 1024));
const usedMemory    = Math.round(process.memoryUsage().rss / (1024 * 1024)); // dalam MB
const cpucore       = os.cpus().length


let infosystem = `╭────「 *ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ* 」
│
│✦ Tᴏᴛᴀʟ ᴍᴇᴍᴏʀʏ--> *${totalMemoryGB} GB*
│✦ Fʀᴇᴇ ᴍᴇᴍᴏʀʏ--> *${freeMemoryGB} GB*
│✦ CPU Cᴏʀᴇ--> *${cpucore}*
│✦ Uꜱᴅ ᴍᴇᴍᴏʀʏ--> *${usedMemory} MB*
│✦ Nᴏᴅᴇ ᴊꜱ ᴠᴇʀꜱɪᴏɴ--> *${process.version}*
│✦ Pʟᴀᴛꜰᴏʀᴍ--> *${os.platform()}*
│✦ Uptime--> *${formatUptime(os.uptime() )}*
│
╰────────────────────────`
reply(infosystem)

// infosystem = '```'+infosystem+'```'



} catch(e){
    console.log(e)
}


break





















































/* ========================================================================
_________________________________ Information _________________________________*/



case 'infogempa':{


let tod = await fetchJson(`${config.urlApikey}/api/information/gempadirasakan?apikey=${config.apikey_resbot}`)

var capt = `_*Info Gempa*_

*• Tanggal :* ${tod.data[0].Tanggal}
*• Wilayah :* ${tod.data[0].Wilayah}
*• DateTime :* ${tod.data[0].DateTime}
*• Lintang :* ${tod.data[0].Lintang}
*• Bujur :* ${tod.data[0].Bujur}
*• Magnitude :* ${tod.data[0].Magnitude}
*• Dirasakan :* ${tod.data[0].Dirasakan}
*• Kedalaman :* ${tod.data[0].Kedalaman}

`
reply(capt)
}

break


case 'artinama': {
  if (resbot_.isBan) return reply(mess.ban);

  if (!q) return reply(`_Example : ${prefix + command} Melinda`);

  try {
    let response = await fetchJson(`${config.urlApikey}/api/primbon/artinama?apikey=${config.apikey_resbot}&text=${q}`);
    if (response.data) {
         autoresbot.sendText(from, `⭔ *Nama :* ${q}\n⭔ *Arti :* ${response.data}`, m);
     }else{
         throw new Error('Invalid response data');
     }
     
   
  } catch (error) {
    console.log(`${chalk.redBright('['+jammenit+']')} ${chalk.redBright.bold('FAILED : '+error )}`)
    return reply(mess.response_failed);
  }

  break;
}

case 'artimimpi': {
  if (resbot_.isBan) return reply(mess.ban);

  if (!q) return reply(`_Example : ${prefix + command} Melinda`);

  try {
    let response = await fetchJson(`${config.urlApikey}/api/primbon/tafsirmimpi?apikey=${config.apikey_resbot}&text=${q}`);
    if (response.data) {
         autoresbot.sendText(from, `⭔ *Nama :* ${q}\n⭔ *Arti :* ${response.data}`, m);
     }else{
         throw new Error('Invalid response data');
     }
     
   
  } catch (error) {
    console.log(`${chalk.redBright('['+jammenit+']')} ${chalk.redBright.bold('FAILED : '+error )}`)
    return reply(mess.response_failed);
  }

  break;
}

case 'ramalanjodoh': {
  if (resbot_.isBan) return reply(mess.ban);

  const [nama, tgl, nama2, tgl2] = q.split('|').map(item => item.trim());

  if (!nama || !tgl || !nama2 || !tgl2) {
    return reply(`_Contoh: ${prefix + command} Melinda | 26-07-2001 | Budi | 14-07-2000_`);
  }
 
  try {
    const response = await fetchJson(`${config.urlApikey}/api/primbon/ramalanjodoh?apikey=${config.apikey_resbot}&tgl=${tgl}&name=${nama}&name2=${nama2}&tgl2=${tgl2}`);
    
    if (response.data) {
      autoresbot.sendText(from, response.data, m);
    }else {
      throw new Error('Data respons tidak valid');
    }
  } catch (error) {
    console.log(`${chalk.redBright('[' + jammenit + ']')} ${chalk.redBright.bold('GAGAL : ' + error)}`);
    return reply(mess.response_failed);
  }

  break;
}



case 'kecocokanpasangan': case 'cocokpasangan': case 'pasangan': {

if (resbot_.isBan) return reply(mess.ban)
 if (args.length == 0) return reply(`Example : ${prefix + command} Budi|Putri`)
 if (!q) return reply(`Example : ${prefix + command} Budi|Putri`)
 let [nama1, nama2] = q.split`|`
 let anu = await primbon.kecocokan_nama_pasangan(nama1, nama2)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendImage(from,  anu.message.gambar, `⭔ *Nama Anda :* ${anu.message.nama_anda}\n⭔ *Nama Pasangan :* ${anu.message.nama_pasangan}\n⭔ *Sisi Positif :* ${anu.message.sisi_positif}\n⭔ *Sisi Negatif :* ${anu.message.sisi_negatif}`, m)
}
break



case 'sifatusaha': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix+ command} 28, 12, 2021`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.sifat_usaha_bisnis(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Lahir :* ${anu.message.hari_lahir}\n⭔ *Usaha :* ${anu.message.usaha}`, m)
}
break


case 'pekerjaan': case 'kerja': {
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.pekerjaan_weton_lahir(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Lahir :* ${anu.message.hari_lahir}\n⭔ *Pekerjaan :* ${anu.message.pekerjaan}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break


case 'ramalannasib': case 'ramalnasib': case 'nasib': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.ramalan_nasib(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Analisa :* ${anu.message.analisa}\n⭔ *Angka Akar :* ${anu.message.angka_akar}\n⭔ *Sifat :* ${anu.message.sifat}\n⭔ *Elemen :* ${anu.message.elemen}\n⭔ *Angka Keberuntungan :* ${anu.message.angka_keberuntungan}`, m)
}
break

case 'potensipenyakit': case 'penyakit': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.cek_potensi_penyakit(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Analisa :* ${anu.message.analisa}\n⭔ *Sektor :* ${anu.message.sektor}\n⭔ *Elemen :* ${anu.message.elemen}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break



case 'artitarot': case 'tarot': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.arti_kartu_tarot(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendImage(from, anu.message.image, `⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Simbol Tarot :* ${anu.message.simbol_tarot}\n⭔ *Arti :* ${anu.message.arti}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break


case 'fengshui': {
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`Example : ${prefix + command} Autores, 1, 2005\n\nNote : ${prefix + command} Nama, gender, tahun lahir\nGender : 1 untuk laki-laki & 2 untuk perempuan`)
 let [nama, gender, tahun] = q.split`,`
 let anu = await primbon.perhitungan_feng_shui(nama, gender, tahun)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Nama :* ${anu.message.nama}\n⭔ *Lahir :* ${anu.message.tahun_lahir}\n⭔ *Gender :* ${anu.message.jenis_kelamin}\n⭔ *Angka Kua :* ${anu.message.angka_kua}\n⭔ *Kelompok :* ${anu.message.kelompok}\n⭔ *Karakter :* ${anu.message.karakter}\n⭔ *Sektor Baik :* ${anu.message.sektor_baik}\n⭔ *Sektor Buruk :* ${anu.message.sektor_buruk}`, m)
}
break

case 'haribaik': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.petung_hari_baik(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Kala Tinantang :* ${anu.message.kala_tinantang}\n⭔ *Info :* ${anu.message.info}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break


case 'harisangar': case 'taliwangke': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply (`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.hari_sangar_taliwangke(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Hasil :* ${anu.message.result}\n⭔ *Info :* ${anu.message.info}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break

case 'harinaas': case 'harisial': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.primbon_hari_naas(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Hari Lahir :* ${anu.message.hari_lahir}\n⭔ *Tanggal Lahir :* ${anu.message.tgl_lahir}\n⭔ *Hari Naas :* ${anu.message.hari_naas}\n⭔ *Info :* ${anu.message.catatan}\n⭔ *Catatan :* ${anu.message.info}`, m)
}
break

case 'nagahari': case 'harinaga': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.rahasia_naga_hari(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Hari Lahir :* ${anu.message.hari_lahir}\n⭔ *Tanggal Lahir :* ${anu.message.tgl_lahir}\n⭔ *Arah Naga Hari :* ${anu.message.arah_naga_hari}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break


case 'arahrejeki': case 'arahrezeki': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.primbon_arah_rejeki(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Hari Lahir :* ${anu.message.hari_lahir}\n⭔ *tanggal Lahir :* ${anu.message.tgl_lahir}\n⭔ *Arah Rezeki :* ${anu.message.arah_rejeki}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break

case 'peruntungan': {
if (resbot_.isBan) return reply(mess.ban)

 if (!q) return reply(`Example : ${prefix + command} Autores, 7, 7, 2005, 2022\n\nNote : ${prefix + command} Nama, tanggal lahir, bulan lahir, tahun lahir, untuk tahun`)
 let [nama, tgl, bln, thn, untuk] = q.split`,`
 let anu = await primbon.ramalan_peruntungan(nama, tgl, bln, thn, untuk)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Nama :* ${anu.message.nama}\n⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Peruntungan Tahun :* ${anu.message.peruntungan_tahun}\n⭔ *Hasil :* ${anu.message.result}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break

case 'weton': case 'wetonjawa': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 7, 7, 2005`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.weton_jawa(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Tanggal :* ${anu.message.tanggal}\n⭔ *Jumlah Neptu :* ${anu.message.jumlah_neptu}\n⭔ *Watak Hari :* ${anu.message.watak_hari}\n⭔ *Naga Hari :* ${anu.message.naga_hari}\n⭔ *Jam Baik :* ${anu.message.jam_baik}\n⭔ *Watak Kelahiran :* ${anu.message.watak_kelahiran}`, m)
}
break


case 'sifat': case 'karakter': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} Autores, 7, 7, 2005`)
 let [nama, tgl, bln, thn] = q.split`,`
 let anu = await primbon.sifat_karakter_tanggal_lahir(nama, tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Nama :* ${anu.message.nama}\n⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Garis Hidup :* ${anu.message.garis_hidup}`, m)
}
break

case 'keberuntungan': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} Autores, 7, 7, 2005`)
 let [nama, tgl, bln, thn] = q.split`,`
 let anu = await primbon.potensi_keberuntungan(nama, tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Nama :* ${anu.message.nama}\n⭔ *Lahir :* ${anu.message.tgl_lahir}\n⭔ *Hasil :* ${anu.message.result}`, m)
}
break


case 'memancing': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 12, 1, 2022`)
 let [tgl, bln, thn] = q.split`,`
 let anu = await primbon.primbon_memancing_ikan(tgl, bln, thn)
 if (anu.status == false) return reply(anu.message)
 autoresbot.sendText(from, `⭔ *Tanggal :* ${anu.message.tgl_memancing}\n⭔ *Hasil :* ${anu.message.result}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break

case 'masasubur': {
if (resbot_.isBan) return reply(mess.ban)
 if (!q) return reply(`Example : ${prefix + command} 12, 1, 2022, 28\n\nNote : ${prefix + command} hari pertama menstruasi, siklus`)
 let [tgl, bln, thn, siklus] = q.split`,`
 let anu = await primbon.masa_subur(tgl, bln, thn, siklus)
 if (anu.status == false) return reply(anu.message)
    let resultmasasubur = anu.message.result
resultmasasubur = resultmasasubur.replace(/\s+/g, ' ');
resultmasasubur = resultmasasubur.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '');
resultmasasubur = resultmasasubur.replace('Tgl', '\nTgl');
 autoresbot.sendText(from, `⭔ *Hasil :* ${resultmasasubur}\n⭔ *Catatan :* ${anu.message.catatan}`, m)
}
break

















































/* ========================================================================
_________________________________ Islamic _________________________________*/


case 'doa':
    let endpoing_doa = '';
    if (q) {
        // cari doa
        endpoing_doa = `${config.urlApikey}/api/doa?apikey=${config.apikey_resbot}&q=${q}`
    }else{
        // doa acak
        endpoing_doa = `${config.urlApikey}/api/doa/random?apikey=${config.apikey_resbot}`
    }



try {
    let niatsholat_result = await fetchJson(endpoing_doa)

let msg_niatsholat = `*${niatsholat_result[0].doa}*

${niatsholat_result[0].ayat}
${niatsholat_result[0].latin}

${niatsholat_result[0].artinya}
`
reply(msg_niatsholat)
} catch(e){
    console.log(e)
    return reply(mess.response_failed);
}

break


case 'hadits':
case 'hadis':
try {
    let asmaul_result = await fetchJson(`${config.urlApikey}/api/hadits/?apikey=${config.apikey_resbot}`)
let msg_asmaul = `*${asmaul_result.data.judul}*

${asmaul_result.data.arab}

${asmaul_result.data.indo}
`
reply(msg_asmaul)
} catch(e){
    console.log(e)
    return reply(mess.response_failed);
}

break

case 'listsurah':

reply(`_*Surah dalam Al-Qur'an*_

1. Al Fatihah (Pembuka): 7 Ayat

2. Al Baqarah (Sapi Betina): 286 Ayat

3. Ali Imran (Keluarga Imran): 200 Ayat

4. An Nisa (Wanita): 176 Ayat

5. Al Ma'idah (Jamuan): 120 Ayat

6. Al An'am (Hewan Ternak): 165 Ayat

7. Al-A'raf (Tempat yang Tertinggi): 206 Ayat

8. Al-Anfal (Harta Rampasan Perang): 75 Ayat

9. At-Taubah (Pengampunan): 129 Ayat

10. Yunus (Nabi Yunus): 109 Ayat

11. Hud (Nabi Hud): 123 Ayat

12. Yusuf (Nabi Yusuf): 111 Ayat

13. Ar-Ra'd (Guruh): 43 Ayat

14. Ibrahim (Nabi Ibrahim): 52 Ayat

15. Al-Hijr (Gunung Al Hijr): 99 Ayat

16. An-Nahl (Lebah): 128 Ayat

17. Al-Isra' (Perjalanan Malam): 111 Ayat

18. Al-Kahf (Penghuni-penghuni Gua): 110 Ayat

19. Maryam (Maryam): 98 Ayat

20. Ta Ha (Ta Ha): 135 Ayat

21. Al-Anbiya (Nabi-nabi): 112 Ayat

22. Al-Hajj (Haji): 78 Ayat

23. Al-Mu'minun (Orang-orang mukmin): 118 Ayat

24. An-Nur (Cahaya): 64 Ayat

25. Al-Furqan (Pembeda): 77 Ayat

26. Asy-Syu'ara' (Penyair): 227 Ayat

27. An-Naml (Semut): 93 Ayat

28. Al-Qasas (Kisah-kisah): 88 Ayat

29. Al-'Ankabut (Laba-laba): 69 Ayat

30. Ar-Rum (Bangsa Romawi): 60 Ayat

31. Luqman (Keluarga Luqman): 34 Ayat

32. As-Sajdah (Sajdah): 30 Ayat

33. Al-Ahzab (Golongan-golongan yang Bersekutu): 73 Ayat

34. Saba' (Kaum Saba'): 54 Ayat

35. Fatir (Pencipta): 45 Ayat

36. Ya Sin (Yasin): 83 Ayat

37. As-Saffat (Barisan-barisan): 182 Ayat

38. Sad (Sad): 88 Ayat

39. Az-Zumar (Rombongan): 75 Ayat

40. Ghafir (Yang Mengampuni): 85 Ayat

41. Fussilat (Yang Dijelaskan): 54 Ayat

42. Asy-Syura (Musyawarah): 53 Ayat

43. Az-Zukhruf (Perhiasan): 89 Ayat

44. Ad-Dukhan (Kabut): 59 Ayat

45. Al-Jasiyah (Yang Bertekuk Lutut): 37 Ayat

46. Al-Ahqaf (Bukit-bukit Pasir): 45 Ayat

47. Muhammad (Nabi Muhammad): 38 Ayat

48. Al-Fath (Kemenangan): 29 Ayat

49. Al-Hujurat (Kamar-kamar): 18 Ayat

50. Qaf (Qaf): 45 Ayat

51. Az-Zariyat (Angin yang Menerbangkan): 60 Ayat

52. At-Tur (Bukit): 49 Ayat

53. An-Najm (Bintang): 62 Ayat

54. Al-Qamar (Bulan): 55 Ayat

55. Ar-Rahman (Yang Maha Pemurah): 78 Ayat

56. Al-Waqi'ah (Hari Kiamat): 96 Ayat

57. Al-Hadid (Besi): 29 Ayat

58. Al-Mujadilah (Gugatan): 22 Ayat

59. Al-Hasyr (Pengusiran): 24 Ayat

60. Al-Mumtahanah (Wanita yang Diuji): 13 Ayat

61. As-Saff (Barisan): 14 Ayat

62. Al-Jumu'ah (Hari Jumat): 11 Ayat

63. Al-Munafiqun (Orang-orang yang Munafik): 11 Ayat

64. At-Tagabun (Hari Dinampakkan Kesalahan-kesalahan): 18 Ayat

65. At-Talaq (Talak): 12 Ayat

66. At Tahrim (Pengharaman): 12 Ayat

67. Al-Mulk (Kerajaan): 30 Ayat

68. Al-Qalam (Pena): 52 Ayat

69. Al-Haqqah (Hari Kiamat): 52 Ayat

70. Al-Ma'arij (Tempat Naik): 44 Ayat

71. Nuh (Nabi Nuh): 28 Ayat

72. Al-Jinn (Jin): 28 Ayat

73. Al-Muzzammil (Orang yang Berkelumun): 20 Ayat

74. Al-Muddassir (Orang yang Berselimut): 56 Ayat

75. Al-Qiyamah (Kiamat): 40 Ayat

76. Al-Insan (Manusia): 31 Ayat

77. Al-Mursalat (Malaikat-malaikat yang Diutus): 50 Ayat

78. An-Naba' (Berita Besar): 40 Ayat

79. An-Nazi'at (Yang Mencabut dengan Keras): 46 Ayat

80. 'Abasa (Bermuka Masam): 42 Ayat

81. At-Takwir (Menggulung): 29 Ayat

82. Al-Infitar (Terbelah): 19 Ayat

83. Al-Mutaffifin (Orang-orang yang Curang): 36 Ayat

84. Al-Insyiqaq (Terbelah): 25 Ayat

85. Al-Buruj (Gugusan Bintang): 22 Ayat

86. At-Tariq (Yang Datang di Malam Hari): 17 Ayat

87. Al-A'la (Maha Tinggi): 19 Ayat

88. Al-Gasyiyah (Hari Pembalasan): 26 Ayat

89. Al-Fajr (Fajar): 30 Ayat

90. Al-Balad (Negeri): 20 Ayat

91. Asy-Syams (Matahari): 15 Ayat

92. Al-Lail (Malam): 21 Ayat

93. Ad-Duha (Duha): 11 Ayat

94. Al-Insyirah (Melapangkan): 8 Ayat

95. At-Tin (Buah Tin): 8 Ayat

96. Al-'Alaq (Segumpal Darah): 19 Ayat

97. Al-Qadr (Kemuliaan): 5 Ayat

98. Al-Bayyinah (Pembuktian): 8 Ayat

99. Az-Zalzalah (Kegoncangan): 8 Ayat

100. Al-'Adiyat (Kuda Perang yang Berlari Kencang): 11 Ayat

101. Al-Qari'ah (Hari Kiamat yang Menggetarkan): 11 Ayat

102. At-Takasur (Bermegah-megahan): 8 Ayat

103. Al-'Asr (Masa): 3 Ayat

104. Al-Humazah (Pengumpat): 9 Ayat

105. Al-Fil (Gajah): 5 Ayat

106. Quraisy (Suku Quraisy): 4 Ayat

107. Al-Ma'un (Bantuan): 7 Ayat

108. Al-Kautsar (Nikmat yang Berlimpah): 3 Ayat

109. Al-Kafirun (Orang-orang Kafir): 6 Ayat

110. An-Nasr (Pertolongan): 3 Ayat

111. Al-Lahab (Gejolak Api): 5 Ayat

112. Al-Ikhlas (Ikhlas): 4 Ayat

113. Al-Falaq (Waktu Fajar): 5 Ayat

114. An-Nas (Manusia): 6 Ayat
`)

break

case 'surah':
  if (!q) return reply(`_Contoh Penggunaan: *surah 1*_`);


const surahData = [
  "Al-Fatihah","Al-Baqarah","Ali Imran","An Nisa","Al-Ma'idah",
  "Al-An'am","Al-A'raf","Al-Anfal","At-Taubah","Yunus",
  "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr",
  "An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta Ha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan",
  "Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum",
  "Luqman","As-Sajda","Al-Ahzab","Saba","Fatir",
  "Ya Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
  "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiya",
  "Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
  "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman",
  "Al-Waqi'a","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina",
  "As-Saff","Al-Jumu'a","Al-Munafiqun","At-Taghabun","At-Talaq",
  "At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Ma'arij",
  "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyama",
  "Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
  "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj",
  "At-Tariq","Al-Ala","Al-Ghashiya","Al-Fajr","Al-Balad",
  "Ash-Shams","Al-Lail","Adh-Dhuha","Ash-Sharh","At-Tin",
  "Al-Alaq","Al-Qadr","Al-Bayyina","Az-Zalzala","Al-Adiyat",
  "Al-Qaria","At-Takathur","Al-Asr","Al-Humazah","Al-Fil",
  "Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
  "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];


let [no_surah, no_ayat] = q.includes('ayat') ? q.split('ayat') : [q];

if (!no_surah) return reply(`_Contoh Penggunaan: *surah 1*_ \n\n_Atau Contoh Penggunaan: *surah 1*_`);


no_surah = no_surah.toLowerCase().trim();
no_ayat = no_ayat ? no_ayat.toLowerCase().trim() : ''

console.log(no_surah)
const position_surah = surahData.findIndex(surah => surah.toLowerCase() === no_surah);

if (position_surah !== -1) {
    no_surah = position_surah + 1
}


  const query_surah = `${no_surah}/${no_ayat}`;
  reply(mess.wait)
  try {


  if (!q.includes('ayat')) {
   no_surah = no_surah.toString().padStart(3, '0');
     await autoresbot.sendMessage(m.chat, { audio: { url: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${no_surah}.mp3` }, fileName: `surah.mp3`, mimetype: 'audio/mp4' });
     return
  }



      const surah_result = `${config.urlApikey}/islamic/quran?apikey=${config.apikey_resbot}&query=${query_surah}`

  await autoresbot.sendMessage(m.chat, { audio: { url: surah_result }, fileName: `surah.mp3`, mimetype: 'audio/mp4' });

}catch(e){
    console.log(e)
    return reply(mess.response_failed);
}

  break;




case 'jadwalsholat':
{
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`_Masukkan Nama kota Contoh *${prefix + command} sambas*_`)

try{

reply(mess.wait)

let result_jadwalsholat = await fetchJson(`${config.urlApikey}/api/jadwalsholat/?apikey=${config.apikey_resbot}&kota=${q}`)

if (!result_jadwalsholat.data) {
    throw new Error('Invalid response data');
}


await reply(`_Jadwal Sholat Area *${q}*_

_${result_jadwalsholat.data.jadwal.tanggal}_

Imsyak    : ${result_jadwalsholat.data.jadwal.imsak}
*Subuh*   : ${result_jadwalsholat.data.jadwal.subuh}
Dhuha     : ${result_jadwalsholat.data.jadwal.dhuha}
*Dzuhur*  : ${result_jadwalsholat.data.jadwal.dzuhur}
*Ashr*    : ${result_jadwalsholat.data.jadwal.ashar}
*Maghrib* : ${result_jadwalsholat.data.jadwal.maghrib}
*Isya*    : ${result_jadwalsholat.data.jadwal.isya}

`)
} catch (err){
  reply('_*Tidak ada hasil nih untuk kota ini*_')
}
}
break












































/* ========================================================================
_________________________________ Image Creator _________________________________*/

  case 'effect1':
  case 'effect2':
  case 'effect3':
  case 'effect4':
  case 'effect5':
  case 'effect6':
  case 'effect7':
  case 'effect8':
  case 'effect9':
  case 'effect10':
  case 'effect11':
  case 'effect12':
  case 'effect13':
  case 'effect14':
  case 'effect15':
  case 'effect16':
  case 'effect17':
  case 'effect18':
  case 'effect19':
  case 'effect20':
  case 'effect21':
  case 'effect22':
  case 'effect23':
  case 'effect24':
  case 'effect25':
  case 'effect26':
  case 'effect27':
  case 'effect28':
  case 'effect29':
  case 'effect30': {
    if (!isImage) return reply(`_Balas Gambarnya Dengan Caption *${prefix + command}*_`);
    if (resbot_.isBan) return reply(mess.ban);
    if (MinLimit(m.sender) === undefined) return;

    let effect;
    
switch (command) {
    case 'effect1':
        effect = 'prism-kaleidoscope-photo-effects-online-420';
        break;
    case 'effect2':
        effect = 'create-a-broken-glass-mirror-photo-effect-online-419';
        break;
    case 'effect3':
        effect = 'create-canvas-painting-in-the-art-workshop-online-418';
        break;
    case 'effect4':
        effect = 'create-an-oil-painting-effect-with-a-puppy-415';
        break;
    case 'effect5':
        effect = 'create-a-photo-frame-with-plastic-wrap-409';
        break;
    case 'effect6':
        effect = 'create-a-bedroom-360-degree-photo-effect-406';
        break;
    case 'effect7':
        effect = 'create-pencil-sketch-effect-with-your-photo-online-1';
        break;
    case 'effect8':
        effect = 'double-love-photo-frame-401';
        break;
    case 'effect9':
        effect = 'double-photo-frame-400';
        break;
    case 'effect10':
        effect = 'make-360-degree-view-the-living-room-348';
        break;
    case 'effect11':
        effect = 'create-a-360-photo-slideshow-264';
        break;
    case 'effect12':
        effect = '360-degree-living-room-panorama-effect-online-408';
        break;
    case 'effect13':
        effect = 'create-a-360-degree-bedroom-panoramic-online-407';
        break;
    case 'effect14':
        effect = 'flame-up-your-photo-on-a-paper-399';
        break;
    case 'effect15':
        effect = 'loving-memory-picture-frame-397';
        break;
    case 'effect16':
        effect = 'memory-photo-frame-393';
        break;
    case 'effect17':
        effect = 'beautiful-pine-leaf-frame-384';
        break;
    case 'effect18':
        effect = 'photo-of-summer-beach-383';
        break;
    case 'effect19':
        effect = 'frame-hoa-violet-nature-382';
        break;
    case 'effect20':
        effect = 'summer-photo-frame-2018-381';
        break;
    case 'effect21':
        effect = 'fern-leaf-picture-frame-380';
        break;
    case 'effect22':
        effect = 'photo-frame-in-nature-379';
        break;
    case 'effect23':
        effect = 'camera-photo-frame-359';
        break;
    case 'effect24':
        effect = 'gray-watercolor-painting-effect-357';
        break;
    case 'effect25':
        effect = 'apply-online-a-pencil-sketch-effect-on-a-picture-356';
        break;
    case 'effect26':
        effect = 'night-beach-photo-effect-353';
        break;
    case 'effect27':
        effect = 'galaxy-photo-frames-352';
        break;
    case 'effect28':
        effect = 'galaxy-photo-frames-352';
        break;
    case 'effect29':
        effect = 'blender-galaxy-effect-351';
        break;
    case 'effect30':
        effect = 'your-photo-with-rain-drops-effect-350';
        break;
    default:
        // Handle the case where command doesn't match any known effects
       
}




    try {
        reply(mess.wait);
        const meks = await autoresbot.downloadAndSaveMediaMessage(quoted_);
        const oke = await UploadTph(meks);

        const result = await fetchJson(`${config.urlApikey}/api/photooxy/${effect}?apikey=${config.apikey_resbot}&url=${oke}`);
        autoresbot.sendMessage(m.chat, { image: { url: result.data }, caption: mess.success }, { quoted: m });
    } catch(e){
        return reply(mess.response_failed);
    }
}
break;

case 'toimage': case 'toimg': {
    if (!isSticker) return reply('Balas sticker dengan toimage')
    if (resbot_.isBan) return reply(mess.ban)
    if (MinLimit(m.sender) === undefined) return;
    reply(mess.wait)

let media = await autoresbot.downloadAndSaveMediaMessage(quoted_)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) return reply("Gagal")
let buffer = fs.readFileSync(ran)
autoresbot.sendMessage(from, { image: buffer }, {quoted:m})
fs.unlinkSync(ran)
})
}
break




































/* ========================================================================
_________________________________ Maker _________________________________*/

case 'attp':
case 'ttp':
if (resbot_.isBan) return reply(mess.ban)

if (args.length == 0) return reply(`_Example: *${prefix + command} Autores*_`)
    reply(mess.wait)
try {
    ini_txt = args.join(" ")
const ini_buffer_ttp = await getBuffer(`${config.urlApikey}/api/maker/${command}?apikey=${config.apikey_resbot}&text=${ini_txt}`)
if(ini_buffer_ttp){
    await autoresbot.sendImageAsSticker(from, ini_buffer_ttp, m, { packname: config.packname, author: config.author });
}
} catch(e) {
    return reply(mess.response_failed);
}
break




case 'sticker': case 's': case 'stickergif': case 'sgif': {
if (resbot_.isBan) return reply(mess.ban)

    if (isImage || isVideo) {
      let media = await quoted_.download();
      let encmedia;

      if (isImage) {
        encmedia = await autoresbot.sendImageAsSticker(from, media, m, { packname: config.packname, author: config.author });
      } else if ((quoted_.msg || quoted_).seconds <= 11) {
        reply(mess.wait)
        encmedia = await autoresbot.sendVideoAsSticker(from, media, m, { packname: config.packname, author: config.author });
      } else {
        return reply('Maksimal 10 detik!');
      }

      await fs.unlinkSync(encmedia);
    } else {
      reply(`_Kirim Gambar/Video Dengan Caption *${prefix + command}*\n\nUntuk Video Durasi 1-9 Detik_`);
    }

}
break


case 'wm': {
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply('_Example: *wm az creative*_\n\n_Example 1: wm nama_\n_Example 2: wm youtube | creative_')
let teks = `${q}`

const bnnd = q.split("|");

let packname_wm = bnnd[0] || '';
let packname_author = bnnd[1] || '';


try {
 if (!quoted) return reply(`_Balas Video/Image/Sticker Dengan Caption *${prefix + command}*_`)
if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await autoresbot.sendImageAsSticker(from, media, m, { packname: `${packname_wm}`, author: packname_author })
await fs.unlinkSync(encmedia)
}else {
  reply(`_Balas Image/Sticker_

Example 1: wm nama
Example 2: wm youtube | creative`)
}
} catch (e) {
reply(mess.error)
}
}
break


case 'wmvideo':{
if (resbot_.isBan) return reply(mess.ban)
let teks = `${text}`
try {
 if ((quoted.msg || quoted).seconds > 11) return reply('Maksimal 10 detik!')
if (/video/.test(mime)) {
let media = await quoted.download()
let encmedia = await autoresbot.sendVideoAsSticker(from, media, m, { packname: `${teks}`, author: author })
await fs.unlinkSync(encmedia)
} else {
return reply(`_Kirim Gambar/Video Dengan Caption *${prefix + command}*\n\nUntuk Video Durasi 1-9 Detik_`);
}
} catch (e) {
reply(mess.error)
}
}
break


case 'qc': {
if (resbot_.isBan) return reply(mess.ban)
    if (!q) return reply('Teksnya ?')
if (resbot_.isBan) return reply(mess.ban)
            if (!q) return ('Masukan Text')
            let ppnyauser = await await autoresbot.profilePictureUrl(m.sender, 'image').catch(_=> 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')
            const rest = await quote(q, pushname, ppnyauser)
            autoresbot.sendImageAsSticker(from, rest.result, m, { packname: `${config.packname}`, author: `${config.author}`})
            }
break

case 'qcstick':{
if (resbot_.isBan) return reply(mess.ban)
let teks = m.quoted && m.quoted.q ? m.quoted.text : q ? q : "";
if (!teks) return reply(`Cara Penggunaan ${prefix}qc teks`)
const text = `${teks}`
const username = await autoresbot.getName(m.quoted ? m.quoted.sender : m.sender)
const avatar = await autoresbot.profilePictureUrl( m.quoted ? m.quoted.sender : m.sender,"image").catch(() =>`https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png`)

const json = {
type: "quote",
format: "png",
backgroundColor: "#FFFFFF",
width: 700,
height: 580,
scale: 2,
"messages": [
{
"entities": [],
"avatar": true,
"from": {
"id": 1,
"name": username,
"photo": {
"url": avatar
}
},
"text": text,
"replyMessage": {}
}
 ],
};
axios
.post(
"https://bot.lyo.su/quote/generate",
json,
{
headers: { "Content-Type": "application/json" },
})
.then(async (res) => {
const buffer = Buffer.from(res.data.result.image, "base64");
let encmedia = await autoresbot.sendImageAsSticker(m.chat, buffer, m, { packname: config.packname, 
author: config.author, 
categories: ['🤩', '🎉'],
id: '12345',
quality: 100,
background: 'transparent'})
await fs.unlinkSync(encmedia)
})
}
break 


case 'tourl': {
if (resbot_.isBan) return reply(mess.ban)
if (!isImage) return reply(`_Balas/Kirim Gambar Dengan *${prefix + command}*_`);
if (MinLimit(m.sender) === undefined) return;
reply(mess.wait)
console.log(quoted_)
console.log('batas___________')
let media = await autoresbot.downloadAndSaveMediaMessage(quoted_)
console.log(media)
let anu = await TelegraPh(media)
    reply(mess.success+'\n\n_Link_  : '+util.format(anu))
await fs.unlinkSync(media)

}
break

case 'emojimix': { 
if (resbot_.isBan) return reply(mess.ban)

let hitungtext = args.join("");
if (!hitungtext.indexOf('+')) return reply(`_*Example :*_ ${prefix + command} 😅+🤔`)
if (args.length == 0) return reply(`_*Example :*_ ${prefix + command} 😅+🤔`)

let [emoji1, emoji2] = text.split`+`
if (!emoji1) return reply(`_*Example :*_ ${prefix + command} 😅+🤔`)
if (!emoji2) return reply(`_*Example :*_ ${prefix + command} 😅+🤔`)
reply(mess.wait)
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of anu.results) {
    let encmedia = await autoresbot.sendImageAsSticker(from, res.url, m, { packname: config.packname, author: config.author, categories: res.tags })
    await fs.unlinkSync(encmedia)
    }
}
break


















































/* ========================================================================
_________________________________ STORE _________________________________*/



case 'pdone':
if (!resbot_.isAdmins) return reply(mess.admin)

try {
    let cekm = m.quoted.sender
}catch{
    return reply('Balas Sebuah Pesanan Berupa Text')
}
if (!m.quoted.text) return reply('Balas Sebuah Pesan Text')
tesk_proses = `ꜱᴛᴀᴛᴜꜱ ᴘᴇᴍᴇꜱᴀɴᴀɴ
    
ꜱᴛᴀᴛᴜꜱ   : ᴘᴇꜱᴀɴᴀɴ ꜱᴜᴄᴄᴇꜱꜱ
ᴘᴇꜱᴀɴᴀɴ  : *${quoted.text}*
ᴡᴀᴋᴛᴜ   : *${wib} ᴡɪʙ*
ᴛᴀɴɢɢᴀʟ : *${hariini}*

@${quoted.sender.split("@")[0]} ᴛᴇʀɪᴍᴀ ᴋᴀꜱɪʜ ꜱᴜᴅᴀʜ ᴏʀᴅᴇʀ ᴅɪ ᴋᴀᴍɪ`
autoresbot.sendMessage(from, { text : tesk_proses , mentions: [quoted.sender]}, {quoted:m})
break


case 'psuccess':
if (!resbot_.isAdmins) return reply(mess.admin)
try {
    let cekm = m.quoted.sender
}catch{
    return reply('Balas Sebuah Pesanan Berupa Text')
}
if (!m.quoted.text) return reply('Balas Sebuah Pesan Text')
tesk_proses = `ꜱᴛᴀᴛᴜꜱ ᴘᴇᴍᴇꜱᴀɴᴀɴ
    
ꜱᴛᴀᴛᴜꜱ   : ᴘᴇꜱᴀɴᴀɴ ᴅɪᴘʀᴏꜱᴇꜱ
ᴘᴇꜱᴀɴᴀɴ  : *${quoted.text}*
ᴡᴀᴋᴛᴜ   : *${wib} ᴡɪʙ*
ᴛᴀɴɢɢᴀʟ : *${hariini}*

@${quoted.sender.split("@")[0]} ᴛᴇʀɪᴍᴀ ᴋᴀꜱɪʜ ꜱᴜᴅᴀʜ ᴏʀᴅᴇʀ ᴅɪ ᴋᴀᴍɪ`
autoresbot.sendMessage(from, { text : tesk_proses , mentions: [quoted.sender]}, {quoted:m})
break




















































/* ========================================================================
_________________________________ OWNER _________________________________*/






case 'gctag':
if (!resbot_.superOwner) return reply(mess.superOwner)
if (m.isGroup) return reply(mess.private)

if (!q) return reply('Masukkan ID Group \n\nExample : gctag 1234567889@g.us | pesannya')

      let [idgc, pesangc] = q.split`|`
  if (!idgc) return reply('Masukkan ID Group \n\nExample : gctag 1234567889@g.us | pesannya')
  if (!pesangc) return reply('Masukkan Pesannya \n\nExample : gctag 1234567889@g.us | pesannya')

        try {
                const groupMetadatagctag = await autoresbot.groupMetadata(idgc.split(" ").join("")).catch(e => {})
                const participantsgctag  = await groupMetadatagctag.participants

                autoresbot.sendMessage(idgc.split(" ").join(""), { text : pesangc , mentions: participantsgctag.map(a => a.id)})

                reply('Sukses')

            } catch(e) {
                return console.log('error' +e)
            }

 break


case 'confirmsewa':{
if (!resbot_.superOwner) return reply(mess.superOwner)

if(!q) return reply(`Gunakan perintah : ${prefix}confirmsewa id

Example: ${prefix}confirmsewa 1234567890@g.us`)

try {
    const dataDitemukan = cariDataDenganID(q);
    if (dataDitemukan == null) {
        return reply(`Tidak ada ID grub ditemukan \n\nKetik listsewa untuk melihat daftar sewa`)

    }else{
        fs.writeFileSync('./db/sewa.json', JSON.stringify(db_sewa))

        await autoresbot.groupSettingUpdate(dataDitemukan.id, 'unlocked').then((res) => console.log(`Sekarang *Hanya Admin Yang Dapat Mengedit Pengaturan Grup*`)).catch((err) => console.log(jsonformat(err)))
await autoresbot.groupUpdateDescription(dataDitemukan.id, `GRUB TELAH DI KONFIRMASI

Silakan Ketik .promoteme untuk menjadi admin grub

`).then((res) => console.log('Edit Grub') ).catch((err) => console.log('Edit Grub Gagal'))


        return reply(`Berhasil Grub [ ${q} ] \n\nSudah Di Konfirmasi`)

    }
} catch {
    reply('error');

}

}
break



case 'mode': {
if (!resbot_.superOwner) return reply(mess.superOwner)
reply(`Gunakan Perintah 

*.public* untuk membuat bot menjadi publik [ semua orang ]

*.self* untuk bot menjadi self [ khusus owner ]`)
}
break
        
case 'public': {
if (!resbot_.superOwner) return reply(mess.superOwner)
config.publik = true
reply('_Sukses Change To *Public*_')
}
break

case 'self': {
if (!resbot_.superOwner) return reply(mess.superOwner)
config.publik = false
reply('_Sukses Change To *Self*_')
}
break



case 'enc': {
if (!resbot_.isPremium) return reply(mess.premium)
if (!q) return reply(`Contoh ${prefix+command} const v = require('baileys')`)
let meg = await obfus(q)
reply(`${meg.result}`)
const namaFile = 'encrypt.txt';
fs.writeFile(namaFile, meg.result, (err) => {
  if (err) {
    console.error('Terjadi kesalahan:', err);
  } else {
    console.log(`${chalk.yellow.bold('['+jammenit+']')} File "${namaFile}" berhasil dibuat dan ditulis. `)
  }
});


}
break


case 'addowner':
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!args[0]) return reply(`_Penggunaan ${prefix+command} nomor_\n\n_Contoh *${prefix+command} 6285246154386*_`)
bnnd = text.split("|")[0].replace(/[^0-9]/g, '')
let ceknye_addowner = await autoresbot.onWhatsApp(bnnd + `@s.whatsapp.net`)
if (ceknye_addowner.length == 0) return reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
db_owner.push(bnnd)
fs.writeFileSync('./db/owner.json', JSON.stringify(db_owner))
reply(`_Nomor *${bnnd}* Telah Menjadi Owner !_`)

break

case 'delowner':
    if (!resbot_.superOwner) return reply(mess.superOwner);
    if (!args[0]) return reply(`_Penggunaan *${prefix+command} nomor*_\n_Contoh ${prefix+command} 6285246154386_`);
    if (q == 'all') {
         db_owner.splice(0, db_owner.length);
         fs.writeFileSync('./db/owner.json', JSON.stringify(db_owner));
        return reply(`_Semua Nomor *Owner* Telah Di Hapus!_`);
    }
    let yaki = args[0].split("|")[0].replace(/[^0-9]/g, '');
    let unp = db_owner.indexOf(yaki);
    if (unp === -1) return reply(`_Nomor *${yaki}* tidak ditemukan dalam daftar Owner!_`);
    

    db_owner.splice(unp, 1);
    fs.writeFileSync('./db/owner.json', JSON.stringify(db_owner));
    reply(`_Nomor *${yaki}* Telah Di Hapus Dari Owner!_`);
break;


case 'addprem':
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!args[0]) return reply(`_Penggunaan ${prefix+command} nomor_\n\n_Contoh *${prefix+command} 6285246154386*_`)
bnnd = text.split("|")[0].replace(/[^0-9]/g, '')
let ceknye_addprem = await autoresbot.onWhatsApp(bnnd + `@s.whatsapp.net`)
if (ceknye_addprem.length == 0) return reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
db_premium.push(bnnd)
fs.writeFileSync('./db/premium.json', JSON.stringify(db_premium))
reply(`_Nomor *${bnnd}* Telah Menjadi Premium !_`)

break

case 'delprem':
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!args[0]) return reply(`Penggunaan ${prefix+command} nomor_\n_Contoh ${prefix+command} 6285246154386`)

if (q == 'all') {
 db_premium.splice(0, db_premium.length);
 fs.writeFileSync('./db/premium.json', JSON.stringify(db_premium));
return reply(`_Semua Nomor *Premium* Telah Di Hapus!_`);
}


yaki = text.split("|")[0].replace(/[^0-9]/g, '')
unp = db_premium.indexOf(yaki)
db_premium.splice(unp, 1)
fs.writeFileSync('./db/premium.json', JSON.stringify(db_premium))
reply(`_Nomor *${yaki}* Telah Di Hapus Dari Premium!_`)
break

case 'listprem':
if (resbot_.isBan) return reply(mess.ban)
 teksooo = '*▧ 「 L I S T - P R E M I U M* 」\n\n'
for (let i of db_premium) {
teksooo += `✦ ${i}\n`
}
teksooo += `\n*Total : ${db_premium.length}*`
autoresbot.sendMessage(from, { text: teksooo.trim() }, 'extendedTextMessage', { quoted:m, contextInfo: { "mentionedJid": db_premium } })
break





case 'ban':  {
if (!resbot_.isOwner) return reply(mess.owner)

if (resbot_.mentionByTag.length !== 0) {
    orgnye = resbot_.mentionByTag[0]
}else if(quoted){
   orgnye = quoted.sender
}else {
    return reply(`_Tag Orangnya Dengan Perintah *${prefix}ban*_`)
}
if (botNumber == orgnye) return reply(`_Tidak Bisa Ban BOT ini_`)



const cek_isBan = db_banned.includes(orgnye)
if (cek_isBan) return reply('*Pengguna Ini telah Di Ban*')
db_banned.push(orgnye)
fs.writeFileSync('./db/banned.json', JSON.stringify(db_banned))
return reply(`Berhasil di banned \n\nPengguna Yang Di Baned Tidak Dapat Menggunakan Semua Fitur Bot`)
}
break



case 'unban':  {
if (!resbot_.isOwner) return reply(mess.owner)

if (resbot_.mentionByTag.length !== 0) {
    orgnye = resbot_.mentionByTag[0]
}else if(quoted){
   orgnye = quoted.sender
}else {
       return reply(`_Tag Orangnya Dengan Perintah *${prefix}ban*_`)
}

const cek_isBan = db_banned.includes(orgnye)


 let antispam_person2 =  {
        "sender" : orgnye,
        "command" : command,
        'last_time' : timestamp,
        'poinspam' : 0,
        'baned' : false
        }
global.antiSpam[orgnye] = antispam_person2


if (!cek_isBan) return reply('_*Pengguna Ini telah Di Hapus Dari Ban*_')
let delbans = db_banned.indexOf(orgnye)
db_banned.splice(delbans, 1)


fs.writeFileSync('./db/banned.json', JSON.stringify(db_banned))
reply(`_*Berhasil Menghapus Pengguna yang Di Banned*_`)


}
break



case 'listban':
 teksooop = `▧ 「 *L I S T - B A N* 」\n`
for (let ii of db_banned) {
teksooop += `∘  ${ii}\n`
}
reply(teksooop)
break





case 'chat': {
if (!resbot_.isPremium) return reply(mess.premium)
let t = text.split(',');
if (t.length < 2) return reply(`*Format salah!*

Example: ${prefix + command} 6285246154386, helo

Atau

Example : ${prefix + command} @tagorangnya, helo`)
let chat = t[1];
let u = m.quoted ? m.quoted.sender : t[0] ? t[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.mentionedJid[0];



autoresbot.sendMessage(u, { text: chat }, { quoted: m })
let target = u.replace('@s.whatsapp.net','')
return reply(`_*Pesan Terkirim Ke Nomor :*_ ${target}

_Pesan :_ ${chat}`)
}
break




case 'join': {
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!q) return reply('_Masukkan Link Group!_')
if (!isUrl(q) && !q.includes('whatsapp.com')) return reply('Link Invalid!')
reply(mess.wait)
let result = args[0].split('https://chat.whatsapp.com/')[1]

await autoresbot.groupAcceptInvite(result).then((res) => reply('*Sudah Bergabung*')).catch((err) => reply('Ada masalah saat join grub mungkin link grub invalid atau link sudah di reset'))
//reply(jsonformat(res))
}
break


case 'leave': {
if (!resbot_.isPremium) return reply(mess.owner)
if (!m.isGroup) return reply('Buat Di Group Ya')
await autoresbot.groupLeave(m.chat).then((res) => console.log('Keluar Grub') ).catch((err) => console.log('Keluar Grub Gagal'))
}
break


case 'block': {
if (!resbot_.isOwner) return reply(mess.owner)
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await autoresbot.updateBlockStatus(users, 'block').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
}
break


case 'unblock': {
if (!resbot_.isOwner) return reply(mess.owner)
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await autoresbot.updateBlockStatus(users, 'unblock').then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
}
break





case "buatstory":{
if (!resbot_.superOwner) return reply(mess.superOwner)

    if (isImage) {
       const media = await autoresbot.downloadAndSaveMediaMessage(quoted_)
       autoresbot.sendMessage('status@broadcast', { image: { url: media }, caption: text }, {statusJidList: db_pengguna});

      
    }else if(isVideo){
        const media = await autoresbot.downloadAndSaveMediaMessage(quoted_)
        autoresbot.sendMessage('status@broadcast', { video: { url: media }, caption: text }, {statusJidList: db_pengguna});
        

    }else if(isAudio){
        return reply(`Balas Text, Image atau Video Dengan Caption ${prefix + command}`)

    }else{
        if (!text) return reply(`Balas Text, Image atau Video Dengan Caption ${prefix + command}`)
         autoresbot.sendMessage('status@broadcast', { text,}, { backgroundColor: '#87CEFA',font: 3, statusJidList: db_pengguna});

    }

    reply(`*Sukses mengirim status whatsapp ke ${db_pengguna.length} Orang Yang Ada Di Database*`)



}
break






case 'restart':
if (!resbot_.superOwner) return reply(mess.superOwner)
        console.log(`${chalk.yellow.bold('['+jammenit+']')} Restaring Server... `)
        await restaring()
        reply('Restaring...')
        
        exec(`cd &&  node index`)
break


     



















































/* ========================================================================
_________________________________ Menu Pushkontak _________________________________*/


case 'outallgrup':
  if (!resbot_.superOwner) return reply(mess.superOwner);

  try {
    let outallgrup = await autoresbot.groupFetchAllParticipating();
    
    const leavePromises = Object.values(outallgrup).map(async (group) => {
      if (groupMetadata.id != group.id) {
        await autoresbot.groupLeave(group.id);
        console.log('Berhasil Keluar Grub: ' + group.subject);
        return 'Berhasil Keluar Dari Grub';
      } else {
        console.log('Gak Keluar: ' + group.subject);
        return null;
      }
    });

    const results = await Promise.all(leavePromises);
    results.forEach((result) => {
      if (result) {
        console.log(result)
        //reply(result);
      }
    });
  } catch (error) {
    console.error('Keluar Grub Gagal', error);
    //reply('Keluar Grub Gagal');
  }
  break;




case 'listgroup':
case 'listgrup':
case 'listgrup':
case 'listgc':
case 'gruplist':
case 'groplist':
case 'grouplist':
if (!resbot_.superOwner) return reply(mess.superOwner)

  let getallgrub = await autoresbot.groupFetchAllParticipating();
  async function formatGrup(index, grup) {
    let response2 = '-';
    let link_grouplist = '';
    
try {
  response2 = await autoresbot.groupInviteCode(grup.id);
    link_grouplist = `https://chat.whatsapp.com/${response2}`;
} catch{
    link_grouplist = '-'
}


    

    return `╭─「 ${index} 」 *${grup.subject}*
│ Anggota : ${grup.participants.length}
│ ID Grub : ${grup.id}
│ Link    : ${link_grouplist}
╰────────────────────────`;


  }

  const grupTerurut = Object.values(getallgrub).sort((a, b) => b.participants.length - a.participants.length);
  let nomorUrut = 0;
  const listGrupString = await Promise.all(grupTerurut.map((grup) => formatGrup(++nomorUrut, grup)));

  return reply(`_*Total Group : ${nomorUrut}*_ \n\n`+listGrupString.join('\n\n'));
  break;


case 'pushkontak':{
if (!resbot_.superOwner) return reply(mess.superOwner)
if (!m.isGroup) return reply('*Grup Only* \n\nGunakan perintah *pushkontak2* untuk di chat pribadi')
if (!text) return reply(`Teks Nya Kak?`)
let mem = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
let teksnye = `${q}`
reply(`*Mengirim pesan ke ${mem.length} orang, waktu selesai ${mem.length * 3} detik*`)
for (let geek of mem) {
await sleep(3000)
autoresbot.sendMessage(geek, {text: `${teksnye}`}, {quoted:m})
}
reply(`*Sukses mengirim pesan Ke ${mem.length} orang*`)
}
break



case 'pushkontak2':{

if (!resbot_.superOwner) return reply(mess.superOwner)
if (!q) return reply(`Example : pushkontak2 id | teksnya \n\nUntuk melihat daftar id silakan ketik *listgc*`)
try {
      let [idgc, teksnye] = q.split(`|`)
      if (!teksnye) return reply(`Format Salah ! \n\nExample : *pushkontak2 id | teksnya*`)
      let mem = await autoresbot.groupMetadata(idgc.split(" ").join(""))
      let all_user = mem.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
      

      reply(`*Mengirim pesan ke ${all_user.length} orang, waktu selesai ${all_user.length * 4} detik*`)
      for (let geek of all_user) {
      if (botNumber != geek) {
            await sleep(4000)
            console.log('Mengirim Pesan ke : '+geek+' Success')
            await autoresbot.sendMessage(geek, {text: `${teksnye}`})
      }
      
      }
      reply(`*Sukses mengirim pesan Ke ${all_user.length} orang*`)
      }catch {
      return reply('ID Grub tidak ditemukan, harap periksa kembali')
}


}
break


















































/* ========================================================================
_______________________________ Random Image ______________________________*/


    case 'walhp':
    case 'darkjoke':
    case 'aesthetic':
    case 'pubg':
    case 'hacker':
    case 'kucing':
    case 'memeindo':
    case 'cosplay':
    case 'thailand':
    case 'profil':
    case 'cecan':
    case 'vietnam':
    case 'cogan':{
        if (resbot_.isBan) return reply(mess.ban);
        
        if (MinLimit(m.sender) === undefined) {
            return;
        }
  
        reply(mess.wait);

        autoresbot.sendMessage(m.chat, {
            caption: mess.success,
            image: {
                url: `${config.urlApikey}/api/random/${command}?apikey=${config.apikey_resbot}`
            }
        }, {
            quoted: m
        }).catch((e) => {
            return reply(mess.response_failed);
            console.log(`${chalk.redBright('[' + jammenit + ']')} ${chalk.redBright.bold('ERROR : ' + e )}`);
        });
}
break
    
        
        
        
        
        





        
        


































        


/* ========================================================================
_______________________________ Random Text _________________________________*/

case 'jokes':
case 'animequotes':
case 'bucinquote':
case 'dilanquote':
case 'jawaquote':
case 'motivasi':
case 'faktaunik':
case 'pantun':
case 'quote':
case 'quotes':
case 'randomquote':{
if (resbot_.isBan) return reply(mess.ban)
    let animequotes = command
if (command == 'quote' || command == 'quotes') {
    animequotes = 'randomquote'
}
try {
let tod = await fetchJson(`${config.urlApikey}/api/random/${animequotes}?apikey=${config.apikey_resbot}`)
  const dilan = tod.data
autoresbot.sendMessage(m.chat, {text: dilan}, {quoted: m})
} catch { 
  return reply(mess.response_failed);
  console.log(`${chalk.redBright('['+jammenit+']')} ${chalk.redBright.bold('ERROR : API WEB ERROR' )}`)
}


}
break












































/* ========================================================================
_________________________________ TextPro  _____________________________________*/


case 'blackpink':
case 'blackpink2':
case 'glow':
case 'glowing':
case 'glow-text':
case '3d-thunder':
case '3d-snow-text':
case '3d-neon-light':
case 'glitch':
case 'glitch3':
case 'neon-light':
case 'neon':
case 'neon-text-effect':
case 'neon-effect':
case 'neon-devil':
case 'galax':
case 'matrix':
case 'matrix2':
case 'thunder':
case 'thunder2':
case 'bokeh':
case 'metallic':
case 'shadow':
case 'typography':
case 'batman':
case 'horror':
case 'magma':
case 'wall':
case 'winter-cold':
case 'frozen':
case 'sparkle':
case 'summer':
case 'sunset':
case 'equalizer':
case 'hellfire':
case 'burning':
case 'technology':
case 'holographic':
case 'new-year-greeting':
case 'road-warning':
 {
    if (resbot_.isBan) return reply(mess.ban);
    if (!q) return reply(`Masukkan nama Contoh *${prefix + command} melinda*`);
    
    reply(mess.wait);

    try {
        let getImage = await fetchJson(`${config.urlApikey}/api/textpro/${command}?apikey=${config.apikey_resbot}&text=${q}`);
        await autoresbot.sendMessage(m.chat, { image: { url: getImage.data }, caption: mess.success }, { quoted: m });
    } catch (err) {
        return reply(mess.response_failed);
    }
}
break;





case 'glitch-tiktok':
case 'glitch2':
case 'pornhub':
case 'marvel':
case 'vintage':{
    if (resbot_.isBan) return reply(mess.ban);
    if (!q) return reply(`_Masukkan nama Contoh *${prefix + command} melinda cans*_`)
    if (!args[0]) return reply(`_Masukkan nama Contoh *${prefix + command} melinda cans*_`)
    if (!args[1]) return reply(`_Masukkan nama Contoh *${prefix + command} melinda cans*_`)
        
    reply(mess.wait);

    try {
        let getImage = await fetchJson(`${config.urlApikey}/api/textpro/${command}?apikey=${config.apikey_resbot}&text=${args[0]}&text2=${args[1]}`);
        await autoresbot.sendMessage(m.chat, { image: { url: getImage.data }, caption: mess.success }, { quoted: m });
    } catch (err) {
        return reply(mess.response_failed);
    }
}
break
        

















































/* ========================================================================
_________________________________ Tools  _____________________________________*/



case 'vn': {
    if (resbot_.isBan) return reply(mess.ban);
    let textvn = text || '';

    if (!textvn) {
        return reply(`_Masukkan Teksnya !_ \n\n_Example : *vn halo google*_`);
    }

    textvn = textvn.substring(0, 199);

    if (!MinLimit(m.sender)) {
        return;
    }

    // reply(mess.wait);

    try {
        vn = await fetchJson(`${config.urlApikey}/api/sound/id-ID?apikey=${config.apikey_resbot}&text=${textvn}`)
        repf = await autoresbot.sendMessage(
            m.chat,
            { audio: { url: vn.data }, mimetype: 'audio/mp4', ptt: true } // can send mp3, mp4, & ogg
        );

        // TAG ALL
        // autoresbot.sendMessage(from, { text : '' , mentions: participants.map(a => a.id)}, {quoted:repf})
    } catch (error) {
        console.error(error);
        return reply(mess.response_failed);
    }
}
break;


case 'detectsong':
if (resbot_.isBan) return reply(mess.ban)
if (!quoted) return reply(`_Balas Audio Dengan *${prefix + command}*_`);

if (MinLimit(m.sender) === undefined) return;
reply(mess.wait)

    try {
         let { UploadFileUgu } = require('./lib/uploader')
       const file_detectsong = await autoresbot.downloadAndSaveMediaMessage(quoted_);

       let url_detectsong = await UploadFileUgu(file_detectsong)

       let resultString = '';
      result = await fetchJson(`${config.urlApikey}/tools/detectsong?url=${url_detectsong.url}`,config.apikey_resbot)


        if (result && result.messages) {

                result.messages.forEach((message, index) => {
                  resultString += `Title: *${message.title}*\n`;
                  resultString += `Album: *${message.album.name || '-'}*\n`;
                  resultString += `Label: *${message.label || '-'}*\n`;

                  // Check if artists property is defined before using map
                  resultString += `Artists: *${message.artists ? message.artists.map(artist => artist.name).join(", ") : '-'}*\n`;

                  // Check if genres property is defined before using map
                  resultString += `Genres: *${message.genres ? message.genres.map(genre => genre.name).join(", ") : '-'}*\n`;

                  resultString += `Release Date: *${message.release_date || '-'}*\n`;

                  // Check if duration_ms property is defined before using formatDuration
                  resultString += `Duration (s): *${message.duration_ms ? formatDuration(message.duration_ms) : '-'}*\n`;
                });

        }


if (resultString == '') {
    return reply('Lagu Tidak Ditemukan')
}else {
     return reply(resultString)
}



        
    } catch (e) {
        console.log(e)
        return reply(`. Balas Audio Dengan ${prefix + command}`);
    }
    break;



case 'dongeng':
    if (resbot_.isBan) return reply(mess.ban)
    if(!q) return reply('Example: dongeng malin kundang')

reply(mess.wait)
let result_dongeng = await fetchJson(`${config.urlApikey}/search/dongeng?apikey=${config.apikey_resbot}&query=${q}`)

if (result_dongeng.messages[0].url) {

    let result_dongeng2 = await fetchJson(`${config.urlApikey}/search/dongeng?apikey=${config.apikey_resbot}&url=${result_dongeng.messages[0].url}`)

    reply(result_dongeng2.messages.content)


}else{
    reply('Tidak Ada Dongeng Tentang '+q)
}

break



case 'halodoc':
    if (resbot_.isBan) return reply(mess.ban)
    if(!q) return reply('Example: halodoc pusing kepala')

reply(mess.wait)
let result_halodoc = await fetchJson(`${config.urlApikey}/search/halodoc?apikey=${config.apikey_resbot}&query=${q}`)

if (result_halodoc.messages[0].article) {

    let result_halodoc2 = await fetchJson(`${config.urlApikey}/search/halodoc?apikey=${config.apikey_resbot}&url=${result_halodoc.messages[0].article}`)

    let t_halodoc = `*${result_halodoc2.messages.title.trim()}*

Author : *${result_halodoc2.messages.author.trim()}*
Referensi : ${result_halodoc2.messages.link}

${result_halodoc2.messages.content}


`
t_halodoc = t_halodoc.replace(/\n{2,}/g, '\n');
reply(t_halodoc)
}else{
    reply('Tidak Ada Dongeng Tentang '+q)
}

break





case 'igoogle':
    if (!resbot_.superOwner) return reply(mess.superOwner)
  async function getPublicIPDetails() {
    try {
      const response = await axios.get('https://ipinfo.io/json');
      const ipDetails = response.data;
      let result_checkserver = '';
      result_checkserver += 'IP Address: ' + ipDetails.ip + '\n';
      result_checkserver += 'Hostname: ' + (ipDetails.hostname || '-') + '\n';
      result_checkserver += 'City: ' + ipDetails.city + '\n';
      result_checkserver += 'Region: ' + ipDetails.region + '\n';
      result_checkserver += 'Country: ' + ipDetails.country + '\n';
      result_checkserver += 'Location: ' + ipDetails.loc + '\n';
      result_checkserver += 'Organization: ' + ipDetails.org + '\n';

      reply(result_checkserver);
    } catch (error) {
      console.error('Error fetching IP details:', error.message);
    }
  }

  getPublicIPDetails();
  break;




case 'hd':
case 'hdr':
case 'remini':
case 'hdfree': {
    if (!isImage) return reply(`Balas/Kirim Gambar Dengan *${prefix + command}*`);
    if (MinLimit(m.sender) === undefined) return;
    
    reply(mess.wait);

    try {
        const file_hd = await autoresbot.downloadAndSaveMediaMessage(quoted_);
        const url_teleph_hd = await UploadTph(file_hd);
        const result = await getBuffer(`${config.urlApikey}/api/tools/remini?apikey=${config.apikey_resbot}&url=${url_teleph_hd}`);
        
        await autoresbot.sendMessage(from, { image: result, caption: mess.success }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("_Terjadi kesalahan saat memproses gambar._");
    }
}
break;



case 'colorize': {
    if (!isImage) return reply(`Balas/Kirim Gambar Dengan *${prefix + command}*`);
    if (MinLimit(m.sender) === undefined) return;
    
    reply(mess.wait);

    try {
        const file_hd = await autoresbot.downloadAndSaveMediaMessage(quoted_);
        const url_teleph_hd = await UploadTph(file_hd);
        const result = await getBuffer(`${config.urlApikey}/api/tools/colorize?apikey=${config.apikey_resbot}&url=${url_teleph_hd}`);
        
        await autoresbot.sendMessage(from, { image: result, caption: mess.success }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("_Terjadi kesalahan saat memproses gambar._");
    }
}
break;


case 'dehaze': {
    if (!isImage) return reply(`Balas/Kirim Gambar Dengan *${prefix + command}*`);
    if (MinLimit(m.sender) === undefined) return;
    
    reply(mess.wait);

    try {
        const file_hd = await autoresbot.downloadAndSaveMediaMessage(quoted_);
        const url_teleph_hd = await UploadTph(file_hd);
        const result = await getBuffer(`${config.urlApikey}/api/tools/colorize?apikey=${config.apikey_resbot}&url=${url_teleph_hd}`);
        
        await autoresbot.sendMessage(from, { image: result, caption: mess.success }, { quoted: m });
    } catch (error) {
        console.error(error);
        reply("_Terjadi kesalahan saat memproses gambar._");
    }
}
break;



case 'translate': {

if (resbot_.isBan) return reply(mess.ban)
    let teks_translate = ''
if (!q) {
    try {
        let cekm = m.quoted.sender
        teks_translate = quoted.text
    }catch{
        return reply('Balas Sebuah Pesanan Berupa Text')
    }

}else{
    teks_translate = q
}
    reply(mess.wait)

    let ts_indo = await fetchJson(`${config.urlApikey}/api/translate/en-id?apikey=${config.apikey_resbot}&text=${teks_translate}`)

     let ts_englis = await fetchJson(`${config.urlApikey}/api/translate/id-en?apikey=${config.apikey_resbot}&text=${teks_translate}`)

     reply(`Indonesia: ${ts_indo.data} \n\nEnglish: ${ts_englis.data}`);

}
break







case "createqr": {
if (resbot_.isBan) return reply(mess.ban)
if (MinLimit(m.sender) === undefined) return;
if (!text) return reply(`_Penggunaan Salah Harusnya *${prefix+command} Autores*_`)
reply(mess.wait)
const qrcode = require('qrcode')
const qyuer = await qrcode.toDataURL(text, { scale: 8 })
let data = new Buffer.from(qyuer.replace('data:image/png;base64,', ''), 'base64')
autoresbot.sendMessage(from, { image: data, caption: mess.success }, { quoted: m })
}
break


case "detectqr": {
if (resbot_.isBan) return reply(mess.ban)
if (MinLimit(m.sender) === undefined) return;
reply(mess.wait)
try {
mee = await autoresbot.downloadAndSaveMediaMessage(quoted)
mem = await UploadTph(mee)
const res = await fetchJson(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${mem}`)
// Mengakses properti-symbol
const symbols = res[0].symbol;
const combinedString = symbols
  .map(symbol => Object.values(symbol).filter(value => value !== 0).join(' '))
  .filter(value => value.trim() !== '')  // Menghapus nilai yang hanya terdiri dari spasi
  .join(' ');

reply(combinedString)


} catch (err) {
reply(`_Reply Image Yang Ada Qr Nya_`)
}
}
break






case 'inspect': {
if (resbot_.isBan) return reply(mess.ban)

if (!args[0]) return reply("_Masukkan link grub whatsapp yang mau di *inspect*_")
let linkRegex = args.join(" ")
let coded = linkRegex.split("https://chat.whatsapp.com/")[1]
if (!coded) return reply("Link Invalid")
if (MinLimit(m.sender) === undefined) return;
reply(mess.wait)
autoresbot.query({
tag: "iq",
attrs: {
type: "get",
xmlns: "w:g2",
to: "@g.us"
},
content: [{ tag: "invite", attrs: { code: coded } }]
}).then(async(res) => { 
tekse = `「 Group Link Yang Di Inspect 」
▸ Nama Group : ${res.content[0].attrs.subject ? res.content[0].attrs.subject : "undefined"}

▸ Deskripsi Di Ubah : ${res.content[0].attrs.s_t ? moment(res.content[0].attrs.s_t *1000).tz("Asia/Jakarta").format("DD-MM-YYYY, HH:mm:ss") : "undefined"}
▸ Pembuat Group : ${res.content[0].attrs.creator ? "@" + res.content[0].attrs.creator.split("@")[0] : "undefined"}
▸ Group Di Buat : ${res.content[0].attrs.creation ? moment(res.content[0].attrs.creation * 1000).tz("Asia/Jakarta").format("DD-MM-YYYY, HH:mm:ss") : "undefined"}
▸ Total Member : ${res.content[0].attrs.size ? res.content[0].attrs.size : "undefined"} Member

▸ ID Group  : ${res.content[0].attrs.id ? res.content[0].attrs.id : "undefined"}

©By ${config.botname}`
try {
pp = await autoresbot.profilePictureUrl(res.content[0].attrs.id + "@g.us", "image")
} catch {
pp = "https://tse2.mm.bing.net/th?id=OIP.n1C1oxOvYLLyDIavrBFoNQHaHa&pid=Api&P=0&w=153&h=153"
}
autoresbot.sendFile(from, pp, "", m, { caption: tekse, mentions: await autoresbot.parseMention(tekse) })

})
}
break




case 'git': case 'gitclone':
    if (!args[0]) return reply(`_Example:_ *${prefix +command}* https://github.com/WhiskeySockets/Baileys.git`)
    if (!isUrl(args[0]) && !args[0].includes('github.com')) return reply(`_*Link invalid!*_`)
    reply(mess.wait)
    let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user, repo] = args[0].match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    autoresbot.sendMessage(m.chat, { document: { url: url }, fileName: filename, mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply(mess.error))
.catch(console.error)
break


case "ssweb":{
if (resbot_.isBan) return reply(mess.ban)
if (!q) return reply(`_Example: ${prefix+command} royalpedia.id_`)
reply(mess.wait)
global.sh = q
let krt = await ssweb(global.sh)
autoresbot.sendMessage(from ,{ image: krt.result, caption: mess.success },{ quoted: m })
}
break




















/* ========================================================================
_________________________________ More  _____________________________________*/


case 'style':
  return applyStyle(q, 1);
  break;







case 'cekapikey': {
    try {
        if (!q) return reply(`_Masukkan Apikey_ \n\nContoh : _${prefix + command} YOUR_APIKEY_`);

        let apikey = await fetchJson(`${config.urlApikey}/check_apikey?apikey=${q}`);
        if (apikey.limit_key) {
            // Ubah timestamp menjadi objek Date
            const tanggalAktif = new Date(apikey.limit_key * 1000); // Ubah ke milidetik

            // Format data waktu tanggal sesuai kebutuhan (misalnya: "YYYY-MM-DD HH:mm:ss")
            const formattedDate = tanggalAktif.toISOString().replace(/T/, ' ').replace(/\..+/, '');

            autoresbot.sendMessage(m.chat, { text: `_Apikey Aktif_ \n\n_Masa Aktif Hingga :_ *${formattedDate}*` }, { quoted: m });
        }else{
            autoresbot.sendMessage(m.chat, { text: `_Apikey Tidak Terdaftar / Expired_` }, { quoted: m });
        }
    } catch (error) {
        console.error('Error while fetching API key:', error);
        // Handle the error as needed, e.g., send an error message to the user.
    }
}
break;


case 'apikey': {
    try {
        if (q) return;

        let apikey = await fetchJson(`${config.urlApikey}/check_apikey?apikey=${config.apikey_resbot}`);
        if (apikey.limit_key) {
            // Ubah timestamp menjadi objek Date
            const tanggalAktif = new Date(apikey.limit_key * 1000); // Ubah ke milidetik

            // Format data waktu tanggal sesuai kebutuhan (misalnya: "YYYY-MM-DD HH:mm:ss")
            const formattedDate = tanggalAktif.toISOString().replace(/T/, ' ').replace(/\..+/, '');

            autoresbot.sendMessage(m.chat, { text: `_Apikey Aktif_ \n\n_Masa Aktif Hingga :_ *${formattedDate}*` }, { quoted: m });
        }else{
            autoresbot.sendMessage(m.chat, { text: `_Apikey Tidak Terdaftar / Expired_` }, { quoted: m });
        }
    } catch (error) {
        console.error('Error while fetching API key:', error);
        // Handle the error as needed, e.g., send an error message to the user.
    }
}
break;




tak_dimenu = false;

default:



/* ==============================================================
______________________ Example Fitur  _________________________*/






























if (msg_text.startsWith('=>')) {
    if (!resbot_.isPremium) return reply(mess.premium)
    function Return(sul) {
    sat = JSON.stringify(sul, null, 2)
    bang = util.format(sat)
    if (sat == undefined) {
    bang = util.format(sul)}
    return reply(bang)
    }
    try {
    reply(util.format(eval(`(async () => { return ${msg_text.slice(3)} })()`)))
    } catch (e) {
    reply(String(e))}
}


if (msg_text.startsWith('>')) {
    if (!resbot_.isPremium) return reply(mess.premium)
    try {
    let evaled = await eval(msg_text.slice(2))
    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
    await reply(evaled)
    } catch (err) {
    await reply(String(err))}
}


if (msg_text.startsWith('$')) {
    if (!resbot_.isPremium) return reply(mess.premium)
    exec(msg_text.slice(2), (err, stdout) => {
    if(err) return reply(err)
    if (stdout) return reply(stdout)})
}


if (isCmd && msg_text.toLowerCase() != undefined) {
    if (m.isBaileys) return
    if (from.endsWith('broadcast')) return
    let msgs = global.db.data.database
    if (!(msg_text.toLowerCase() in msgs)) return
    autoresbot.copyNForward(from, msgs[msg_text.toLowerCase()], true)
}


} // penutup case switch


if (tak_dimenu) {
console.log(`${chalk.yellow.bold('['+jammenit+']')} ${chalk.yellow.bold(pushname)} : ${chalk.whiteBright(firstTenCharacters)} `)


if (m.isGroup) { GcSiderUpdate(m.sender,from) }

AntiSpam(m.sender)

} 



//try close
} catch (err) {


let e          = String(err)
console.log(`${chalk.redBright('['+jammenit+']')} ${chalk.redBright.bold('ERROR : '+e )}`)
}




}




// MODULE UTAMA CLOSE




let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`${chalk.greenBright.bold('['+jammenit+']')} ${chalk.greenBright.bold(`UPDATE FILE ${__filename}`)}`)
    delete require.cache[file]
    require(file)
})