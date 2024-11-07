//
//project_name : XPLOADER 
// @author : TYLOR
// @youtube : https://www.youtube.com/@heyits_tylor
// @instagram  : heyits_tylor
// @telegram : t.me/heyits_tylor
// @github : heyit-tylor
// @tiktok :hey.its_tylor
// @whatsapp : +254796180105
//*
//*

require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { uncache, nocache } = require('./lib/loader')
const { color } = require('./lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: XploaderConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers} = require("@whiskeysockets/baileys")

const listcolor = ['red', 'blue', 'magenta', 'green', 'yellow', 'gray'];
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)];
const versions = require("./package.json").version
const xdy = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const xdte = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");

 const Xliconfeature = () => {
      var mytext = fs.readFileSync("./Xploader.js").toString();
      var numUpper = (mytext.match(/case "/g) || []).length;
      return numUpper;
    };

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`src/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    message: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

require('./Xploader.js')
nocache('../Xploader.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
require('./index.js')
nocache('../index.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

//------------------------------------------------------
let phoneNumber = "254796180105"
let owner = JSON.parse(fs.readFileSync('./src/data/role/owner.json'))

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startXploader() {
let { version, isLatest } = await fetchLatestBaileysVersion()
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
    const Xploader = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
      browser: Browsers.windows('Firefox'), // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, // set false for offline
      generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(Xploader.ev)

    // login use pairing code
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
    if (pairingCode && !Xploader.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile API');

        let phoneNumber;
       phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`𝐍𝐮𝐦𝐛𝐞𝐫 𝐭𝐨 𝐛𝐞 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐭𝐨 𝐗𝐩𝐥𝐨𝐚𝐝𝐞𝐫𝐁𝐨𝐭?\n𝐄𝐱𝐚𝐦𝐩𝐥𝐞 254796180105 :- `)))
        phoneNumber = phoneNumber.trim();

        setTimeout(async () => {
            const code = await Xploader.requestPairingCode(phoneNumber);
      console.log(chalk.black(chalk.bgGreen(`𝐗𝐩𝐥𝐨𝐚𝐝𝐞𝐫𝐁𝐨𝐭 𝐏𝐚𝐢𝐫𝐜𝐨𝐝𝐞: ${code}`)));
        }, 3000);
    }
    
Xploader.ev.on('connection.update', async (update) => {
	const {
		connection,
		lastDisconnect
	} = update
try{
		if (connection === 'close') {
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.badSession) {
				console.log(`Bad Session File, Please Delete Session and Scan Again`);
				startXploader()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				startXploader();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				startXploader();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				startXploader()
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
				startXploader();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				startXploader();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				startXploader();
			} else Xploader.end(`Unknown DisconnectReason: ${reason}|${connection}`)
		}
		if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
			console.log(color(`𝐗𝐩𝐥𝐨𝐚𝐝𝐞𝐫𝐁𝐨𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐧𝐠...`, 'red'))
		}
		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
			console.log(color(` `,'magenta'))
            console.log(color(`𝐗𝐩𝐥𝐨𝐚𝐝𝐞𝐫𝐁𝐨𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝✓`, 'green'))
			await delay(1999)
     console.log(chalk.white.bold(`${chalk.gray.bold("Hello there!")}   
This is:


┏━┓┏━┓┃┃┃┓┃┃┃┃┃┃┃┃┃┏┓┃┃┃┃┃
┗┓┗┛┏┛┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃
┃┗┓┏┛┃━━┓┃┃━━┓━━┓┃━┛┃━━┓━┓
┃┏┛┗┓┃┏┓┃┃┃┏┓┃┃┓┃┃┏┓┃┏┓┃┏┛
┏┛┏┓┗┓┗┛┃┗┓┗┛┃┗┛┗┓┗┛┃┃━┫┃┃
┗━┛┗━┛┏━┛━┛━━┛━━━┛━━┛━━┛┛┃
┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃
┃┃┃┃┃┃┛┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃


┏━━┓┃┃┃┃┏┓┃
┃┏┓┃┃┃┃┃┛┗┓
┃┗┛┗┓━━┓┓┏┛
┃┏━┓┃┏┓┃┃┃┃
┃┗━┛┃┗┛┃┃┗┓
┗━━━┛━━┛┗━┛
┃┃┃┃┃┃┃┃┃┃┃
┃┃┃┃┃┃┃┃┃┃┃


${chalk.green.bold("By Tylor")}\n${chalk.yellow.bold("Loading,please wait!...")}\n`));
            await sleep(30000)
Xploader.groupAcceptInvite("B6Hk3829WHYChdpqnuz7bL");
Xploader.sendMessage(Xploader.user.id, { text: `┏▣ ◊ \`𝗫𝗣𝗟𝗢𝗔𝗗𝗘𝗥 𝗕𝗢𝗧\` ◊
□ Xploader has been connected successfully✓
▣ Bot prefix = [ . ]
□ Total commands = [ 519 ]
▣ Bot version = [ 3.1.0 ]
□
▣ *\`WHATSAPP GROUP\`*:
□ https://chat.whatsapp.com/B6Hk3829WHYChdpqnuz7bL
▣
□ *\`WHATSAPP CHANNEL\`*:
▣ https://whatsapp.com/channel/0029VamSWUx77qVNJDy1Jf11
□
▣ ©Tylor
□ @𝐗𝐩𝐥𝐨𝐚𝐝𝐞𝐫𝐁𝐨𝐭
▣ 
□   ${xdte}, ${xdy}
┗▣`})
            }
	
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  startXploader();
	}
})
Xploader.ev.on('creds.update', saveCreds)
Xploader.ev.on("messages.upsert",  () => { })
//------------------------------------------------------

//farewell/welcome
    Xploader.ev.on('group-participants.update', async (anu) => {
    let botNumber = await Xploader.decodeJid(Xploader.user.id);
   let welcome = global.db.data.settings[botNumber].welcome
		if (welcome) {
console.log(anu)
try {
let metadata = await Xploader.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await Xploader.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await Xploader.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
//welcome\\
memb = metadata.participants.length
XeonWlcm = await getBuffer(ppuser)
XeonLft = await getBuffer(ppuser)
                if (anu.action == 'add') {
                const xeonbuffer = await getBuffer(ppuser)
                let xeonName = num
                const xtime = moment.tz(`${timezones}`).format('HH:mm:ss')
	            const xdate = moment.tz(`${timezones}`).format('DD/MM/YYYY')
	            const xmembers = metadata.participants.length
                xeonbody = `┏▣ ◊ \`𝗪𝗘𝗟𝗖𝗢𝗠𝗘\` ◊
┃𝐉𝐎𝐈𝐍𝐄𝐃:
┃@${xeonName.split("@")[0]}
┃  
┃𝐆𝐑𝐎𝐔𝐏:
┃${metadata.subject}
┃ 
┃𝐌𝐄𝐌𝐁𝐄𝐑𝐒:
┃${xmembers}
┃
┃𝐓𝐈𝐌𝐄 : 
┃${xtime} ${xdate}
┗▣ `
Xploader.sendMessage(anu.id,
 { text: xeonbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": XeonWlcm,
"sourceUrl": `${wagc}`}}})
                } else if (anu.action == 'remove') {
                	const xeonbuffer = await getBuffer(ppuser)
                    const xeontime = moment.tz(`${timezones}`).format('HH:mm:ss')
	                const xeondate = moment.tz(`${timezones}`).format('DD/MM/YYYY')
                	let xeonName = num
                    const xeonmembers = metadata.participants.length
                    xeonbody = `┏▣ ◊ \`𝗕𝗬𝗘 𝗕𝗬𝗘\` ◊
┃𝐋𝐄𝐅𝐓:
┃@${xeonName.split("@")[0]} 
┃
┃𝐆𝐑𝐎𝐔𝐏:
┃${metadata.subject}
┃  
┃𝐌𝐄𝐌𝐁𝐄𝐑𝐒;
┃${xeonmembers}
┃
┃𝐓𝐈𝐌𝐄 : 
┃${xeontime}, ${xeondate}
┗▣ `
Xploader.sendMessage(anu.id,
 { text: xeonbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": XeonLft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})
// Anti Call
    Xploader.ev.on('call', async (XeonPapa) => {
    	if (global.anticall){
    console.log(XeonPapa)
    for (let XeonFucks of XeonPapa) {
    if (XeonFucks.isGroup == false) {
    if (XeonFucks.status == "offer") {
    let XeonBlokMsg = await Xploader.sendTextWithMentions(XeonFucks.from, `*My owner can't receive ${XeonFucks.isVideo ? `video` : `voice` } calls at the moment. Sorry @${XeonFucks.from.split('@')[0]}, Xploader Bot is now blocking you for causing disturbance. If you called by mistake please contact the owner to be unblocked!*`)
    Xploader.sendContact(XeonFucks.from, owner, XeonBlokMsg)
    await sleep(8000)
    await Xploader.updateBlockStatus(XeonFucks.from, "block")
    }
    }
    }
    }
    })
    //autostatus view
        Xploader.ev.on('messages.upsert', async chatUpdate => {
        let botNumber = await Xploader.decodeJid(Xploader.user.id);
          let antiswview = global.db.data.settings[botNumber].antiswview
		if (antiswview) {
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
          await Xploader.readMessages([mek.key]) }
            }
    })
    //admin event
    Xploader.ev.on('group-participants.update', async (anu) => {
    	if (global.adminevent){
console.log(anu)
try {
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await Xploader.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await Xploader.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
 if (anu.action == 'promote') {
const xeontime = moment.tz(`${timezones}`).format('HH:mm:ss')
const xeondate = moment.tz(`${timezones}`).format('DD/MM/YYYY')
let xeonName = num
xeonbody = `@${xeonName.split("@")[0]} Has been made an admin in this group!`
   Xploader.sendMessage(anu.id,
 { text: xeonbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": XeonWlcm,
"sourceUrl": `${wagc}`}}})
} else if (anu.action == 'demote') {
const xeontime = moment.tz(`${timezones}`).format('HH:mm:ss')
const xeondate = moment.tz(`${timezones}`).format('DD/MM/YYYY')
let xeonName = num
xeonbody = `@${xeonName.split("@")[0]} Has been demoted as an admin in this group!`
Xploader.sendMessage(anu.id,
 { text: xeonbody,
 contextInfo:{
 mentionedJid:[num],
 "externalAdReply": {"showAdAttribution": true,
 "containsAutoReply": true,
 "title": ` ${global.botname}`,
"body": `${ownername}`,
 "previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": XeonLft,
"sourceUrl": `${wagc}`}}})
}
}
} catch (err) {
console.log(err)
}
}
})

// detect group update
		Xploader.ev.on("groups.update", async (json) => {
			if (global.groupevent) {
			try {
ppgroup = await Xploader.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
			console.log(json)
			const res = json[0]
			if (res.announce == true) {
				await sleep(2000)
				Xploader.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup has been closed by admin, Now only admins can send messages !`,
				})
			} else if (res.announce == false) {
				await sleep(2000)
				Xploader.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nThe group has been opened by admin, Now participants can send messages !`,
				})
			} else if (res.restrict == true) {
				await sleep(2000)
				Xploader.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been restricted, Now only admin can edit group info !`,
				})
			} else if (res.restrict == false) {
				await sleep(2000)
				Xploader.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\nGroup info has been opened, Now participants can edit group info !`,
				})
			} else if(!res.desc == ''){
				await sleep(2000)
				Xploader.sendMessage(res.id, { 
					text: `「 Group Settings Change 」\n\n*Group description has been changed to*\n\n${res.desc}`,
				})
      } else {
				await sleep(2000)
				Xploader.sendMessage(res.id, {
					text: `「 Group Settings Change 」\n\n*Group name has been changed to*\n\n*${res.subject}*`,
				})
			} 
			}
		})
            
    Xploader.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!Xploader.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('BAE5')) return
            m = smsg(Xploader, mek, store)
            require("./Xploader")(Xploader, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })

   
    Xploader.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    Xploader.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = Xploader.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    Xploader.getName = (jid, withoutContact = false) => {
        id = Xploader.decodeJid(jid)
        withoutContact = Xploader.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = Xploader.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === Xploader.decodeJid(Xploader.user.id) ?
            Xploader.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

Xploader.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await Xploader.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await Xploader.getName(i)}\nFN:${await Xploader.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
	    })
	}
	Xploader.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    Xploader.public = true

    Xploader.serializeM = (m) => smsg(Xploader, m, store)

    Xploader.sendText = (jid, text, quoted = '', options) => Xploader.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    Xploader.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await Xploader.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    Xploader.sendTextWithMentions = async (jid, text, quoted, options = {}) => Xploader.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    Xploader.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync
