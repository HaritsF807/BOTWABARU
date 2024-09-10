const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment-timezone');


const config = {
    botDestination  : 'both', // group |  private | both
    region       	: 'indonesia',
    resbot_version  : 'RoyalBOT v1.0.6',
    urlApikey 		: 'https://api-autoresbot.my.id', 
    apikey_resbot   : 'APIKEY_GRATIS', 
    nomorsuperOwner : '62895422801347',
    grup            : 'https://chat.whatsapp.com/Fn6fjP9hPhfHDmOinV4ZQd',
    email           : 'royalpedia.id@gmail.com',
    ig           	: '@harits_fahrizal',
    region          : 'indonesia',
    ownername       : 'M Harits Fahrizal',
    owner           : ['6289542280147'],
    botname         : 'RoyalBOT',
    packname        : 'By RoyalBOT',
    linkPayment	    : 'linkmu di file resconfig.js',
    typeWelcome 	: '1', // ada 3 pilihan angka 1 = image pp user  2 = image welcome custom   || 3 = teks only
    author          : `Date: ${moment.tz('Asia/Jakarta').format('DD/MM/YY')}`,
    prefix_custom   : ['','!','.'],
    sessionName     : 'session',
   	allmenu         : '-',
    sleep_game      : 60000, // waktu main tebak (1000 = 1 detik)
    MoneyMenangGame : 500,
    anticall        : false, // true = aktif || false = tidak aktif
    antispam_filter : false,
    publik 			: true,
    audio_menu      : true,
    autoread 		: true,
    antitoxic 		: true,
    game 			: {
        tebakangka   : '-',
        tebaklontong : '-',
        tebakkalimat : '-',
        tebaklirik   : '-',
        tebakkata    : '-',
        tebakbendera : '-',
        tebakgambar  : '-',
        tebaklagu    : '-'
    }
};

module.exports = config;



let file = path.resolve(__filename);

fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`${chalk.greenBright.bold('UPDATE FILE ' + file)} ${chalk.redBright.bold('PLEASE RESTART THIS SERVER')}`);
    delete require.cache[file];
    require(file);
});







/* 
---- PENJELASAN ------ 

true : artinya aktif
false : tidak aktif

jadi kalau
anticall        : true 
// artinya bot lu gak bisa di telpon // kalo ada orang nelpon lansung di block



untuk link yang seperti https://telegra.ph/file/4cd10be17fd6c13303453.jpg
kalau mau di ganti silakan upload gambar kalian dulu ke website https://telegra.ph
lalu nanti salin url gambarnya 


KALAU MAU NANYA NANYA CHAT https://t.me/autoresbot_com admin/owner autoresbot

*/
