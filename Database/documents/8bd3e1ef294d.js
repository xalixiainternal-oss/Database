"use strict"
const chalk = require('chalk')
const fs = require('fs-extra')
const moment = require('moment-timezone')
const util = require('util')
const path = require('path')
const {
    join,
    dirname
} = require('path')
const {
    fileURLToPath
} = require('url')
const {
    Sticker,
    StickerTypes
} = require('wa-sticker-formatter')

//----------------- LIB FILE ------------------\\
const {
    msgFilter,
    addSpam,
    SpamExpired,
    cekSpam
} = require('./lib/antispam')
const {
    color
} = require('./lib/color')
const {
    addblockcmd,
    deleteblockcmd,
    checkblockcmd
} = require("./lib/blockcmd")
const {
    addError,
    clearAllError,
    deleteError,
    checkError
} = require("./lib/totalerror")
const {
    bad,
    thanks,
    ken,
    dosa,
    katamalem,
    katasiang,
    katasore,
    katalopyu,
    ohayo,
    devoloper1,
    teksspam,
    tekssalah,
    katara,
    katabot,
    katakawai,
    kataaii,
    ppTolak,
    ppLimit,
    badword
} = require('./message/messages')
const {
    vnToxic,
    vnMenu,
    vnSalam,
    vnAra,
    vnBot,
    vnSpam,
    vnPagi,
    vnSiang,
    vnMalam,
    vnOwner,
    vnKawai,
    vnLove
} = require('./message/autovn.js')
const {
    stikOtw,
    stikSpam,
    stikAdmin,
    stikTagOwn,
    stikBug,
    stikCmd,
    stikToxic,
    stikSalam,
    stikOwner,
    stikThanks,
    stikDel,
    stikError,
    stikSucces,
    stikBan
} = require('./message/autosticker.js')
const {
    Nothing,
    Failed,
    Succes,
    addAutoClear,
    autoClearChat,
    checkDataName,
    createDataId,
    addDataId,
    removeDataId,
    checkDataId,
    getHit,
    cmdAdd,
    expiredCmd
} = require("./lib/totalcmd")
const {
    cekBannedUser
} = require("./lib/banned")
const {
    register
} = require("./message/register.js")
const {
    settings
} = require("./message/settingsbot.js")
const {
    isNumber,
    makeid
} = require("./lib/myfunc")
const {
    Logmessage,
    Logcommands,
    Logerror
} = require('./message/logger')
//=================================================//
module.exports = async function handler(conn, m, chatUpdate, store, quotedMsg) {
    // console.log('Pesan diterima:', m)

    settings(m, isNumber)
    var publik = db.data.settings['settingbot'].publik
    var multi = db.data.settings['settingbot'].multi
    var prefa = db.data.settings['settingbot'].prefix
    var autoReport = db.data.settings['settingbot'].autoReport
    var autoRead = db.data.settings['settingbot'].autoRead
    var replyType = db.data.settings['settingbot'].replyType
    var autoblockcmd = db.data.settings['settingbot'].autoblockcmd
    var autoDetectCmd = db.data.settings['settingbot'].autoDetectCmd

    var responType = db.data.settings['settingbot'].responType


    try {

        //Database
        const AntiSpam = db.data.antispam
        const DataId = db.data.data
        const ban = db.data.banned
        const listcmdblock = db.data.blockcmd
        const hitnya = db.data.hittoday
        const dash = db.data.dashboard
        const allcommand = db.data.allcommand
        const spammer = []


        var Ownerin = `${nomerOwner}@s.whatsapp.net`
        var ownerNumber = [`${nomerOwner}@s.whatsapp.net`, `79809099521@s.whatsapp.net`, `${conn.user.jid}`]
        const Tnow = (new Date() / 1000).toFixed(0)
        const seli = Tnow - m.messageTimestamp.low
        if (seli > Intervalmsg) return console.log((`Pesan ${Intervalmsg} detik yang lalu diabaikan agar tidak nyepam`))

        const {
            type,
            args,
            sender,
            ucapanWaktu,
            from,
            botNumber,
            senderNumber,
            groupName,
            groupId,
            groupMembers,
            groupDesc,
            groupOwner,
            pushname,
            itsMe,
            isGroup,
            mentionByTag,
            mentionByReply,
            users,
            budy,
            content,
            body
        } = m

        await register(m)

        const prem = db.data.users[sender].premiumTime !== 0
        if (multi) {
            var prefix = /^[°zZ#,.''()√%!¢£¥€π¤ΠΦ&<`™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#,.''()√%¢£¥€π¤ΠΦ&<!`™©®Δ^βα¦|/\\©^]/gi) : '.'
            var thePrefix = "Multi Prefix"
        } else {
            var prefix = prefa
            var thePrefix = prefa
        }
        const isCmd = body.startsWith(prefix)
        const isCommand = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : ""
        const q = args.join(' ')
        const time = moment().tz('Asia/Jakarta').format('HH:mm')
        const isOwner = ownerNumber.includes(sender) || checkDataId("owner", sender, DataId)
        const command = (prem || isOwner) ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : isCommand
        const theOwner = sender == Ownerin
        const quoted = m.quoted ? m.quoted : m.msg === undefined ? m : m.msg
        const mime = (quoted.msg || quoted).mimetype || ''
        const numberQuery = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
        const Input = (mentionByTag && mentionByTag[0]) ? mentionByTag[0] : (mentionByReply || q ? numberQuery : false)
        const more = String.fromCharCode(8206)
        const readmore = more.repeat(4001)
        const replyCommand = isCmd ? isCmd : allcommand.includes(toFirstCase(command))
        const user = global.db.data.users[m.sender]
        const botRun = global.db.data.others['runtime']
        const botTime = botRun ? (new Date - botRun.runtime) : "Tidak terdeteksi"
        const runTime = clockString(botTime)
        global.runTime = runTime


        //Security / Keamanan
        const isAntiLink = isGroup ? db.data.chats[from].antilink : false
        const isAntilinkGc = isGroup ? db.data.chats[from].antilinkgc : false
        const isAntiPromosi = m.isGroup ? db.data.chats[m.chat].antipromosi : false
        const isAntiVideo = m.isGroup ? db.data.chats[m.chat].antivideo : false
        const isAntiSticker = m.isGroup ? db.data.chats[m.chat].antisticker : false
        const isAntiSpam = m.isGroup ? db.data.chats[m.chat].antispam : false
        const isAntiImage = m.isGroup ? db.data.chats[m.chat].antiimage : false
        const isAntiBot = m.isGroup ? db.data.chats[m.chat].antibot : false
        const isAntiAudio = m.isGroup ? db.data.chats[m.chat].antiaudio : false
        const isKickarea = isGroup ? db.data.chats[from].antiasing : false
        const isBanchat = isGroup ? db.data.chats[from].banchat : false
        const isAntiNsfw = isGroup ? db.data.chats[from].nsfw : false
        const isBanned = sender ? cekBannedUser(senderNumber, ban) : false
        const isGame = isGroup ? db.data.chats[from].game : false
        const isPremium = isOwner ? true : db.data.users[sender].premiumTime !== 0
        const userResPanel = JSON.parse(fs.readFileSync("./database/store/reselerpanel.json"))
        const isResPanel = userResPanel.includes(m.sender.replace('@s.whatsapp.net', ''))

        const isAllMedia = (m.type === 'imageMessage' || m.type === 'videoMessage' || m.type === 'stickerMessage' || m.type === 'audioMessage' || m.type === 'contactMessage' || m.type === 'locationMessage')




        //Console log
        if (!isCmd && !isAllMedia && budy.length < 8000 && type !== 'protocolMessage') Logmessage(conn, m, budy, AntiSpam)
        if (isCmd) Logcommands(m, command)

        //Public & Self And Banchat

        if (!publik && !m.itsMe && !isOwner) return

        if (isGroup && isBanchat && !isOwner && !m.itsMe) {
            if (isAntiImage && m.mtype === "imageMessage") {
                try {
                    let buffer = await m.download()
                    let userCaption = m.text || "Tidak ada caption."
                    await conn.sendMessage(m.chat, {
                        delete: m.key
                    })

                    let sentMessage = await conn.sendMessage(m.chat, {
                        image: buffer,
                        caption: `🚫 *Anti-Image Aktif!*\n❌ ${m.pushName}, jangan kirim gambar biasa di grup ini!\n\n📌 *Caption:* ${userCaption}\n⚠️ *Jika ingin mengirim gambar, gunakan mode 1× lihat!*`,
                        viewOnce: true
                    }, {
                        quoted: m
                    })

                    await conn.sendMessage(m.chat, {
                        delete: sentMessage.key
                    })

                } catch (e) {
                    console.error("Error dalam pengolahan gambar:", e)
                }
                return
            }

            if (m.mtype === "stickerMessage") {
                try {
                    let stickerBuffer = await m.download()
                    let groupMetadata = await conn.groupMetadata(m.chat)
                    let groupName = groupMetadata.subject || "Tidak diketahui"
                    let userName = m.pushName || m.sender.split("@")[0]

                    let notifMessage = `📩 *Culik Stiker*\n📌 *Nama Group:* ${groupName}\n👤 *Nama User:* ${userName}\n\n_${botName}_`

                    let packname = `Anime`
                    let author = `ɪᴄʜɪᴋᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ`

                    let sticker = new Sticker(stickerBuffer, {
                        pack: packname,
                        author: author,
                        type: StickerTypes.FULL,
                        categories: ['🤩', '🎉'],
                        id: '12345',
                        quality: 70,
                        background: '#FFFFFF00'
                    })

                    let stickerBufferFinal = await sticker.toBuffer()

                    let sentSticker = await conn.sendMessage("120363400761978575@newsletter", {
                        sticker: stickerBufferFinal
                    })

                    await conn.sendMessage(m.chat, {
                        delete: sentSticker.key
                    })

                    await conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
                        sticker: stickerBufferFinal
                    })

                    await conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
                        text: notifMessage
                    })

                } catch (e) {
                    console.error("Error saat culik stiker:", e)
                }
            }

            return
        }
        // Auto Read Nya
        if (autoRead) {
            conn.readMessages([m.key])
        }
        // AUTO READ & REACT SW
        const emojis = ["🐦‍⬛", "😎", "🥶", "🥵", "🥱", "😳", "😭", "😱", "😦", "😧", "😭", "🤤", "🥴", "👿", "😈", "🤧", "🤒", "🤣", "😂", "😹", "💩", "🤢", "👽", "🦖", "🐦", "🔥", "😊", "🗿", "✅"]
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

        if (m.key.remoteJid == "status@broadcast") return conn.sendMessage(m.key.remoteJid, {
            react: {
                text: randomEmoji,
                key: m.key
            }
        }, {
            statusJidList: [m.key.participant, m.sender]
        }).catch(() => {
            false
        })

        if (isCmd) {
            db.data.users[m.sender].exp += Math.floor(Math.random() * 10) + 50
            conn.sendPresenceUpdate("composing", m.chat)
        } else {
            conn.sendPresenceUpdate("available", m.chat)
        }
        //SetReply
        const setReply = async (result, member) => {
            const {
                translate
            } = require('@vitalets/google-translate-api')
            let senderNya = String(sender || "")
            let language
            if (senderNya.startsWith("62")) { // Indonesia
                language = "id"
            } else if (senderNya.startsWith("1")) { // Amerika Serikat
                language = "en"
            } else if (senderNya.startsWith("63")) { // Philips
                language = "fil"
            } else if (senderNya.startsWith("81")) { // Jepang
                language = "ja"
            } else if (senderNya.startsWith("49")) { // Jerman
                language = "de"
            } else if (senderNya.startsWith("55")) { // Brasil
                language = "pt" // Portugis
            } else {
                language = "en" // Default ke Inggris
            }
            let teks
            if (language === "en") {
                teks = result
            } else {
                try {
                    const toks = await translate(result, {
                        to: language
                    })
                    teks = toks.text
                } catch (err) {
                    teks = result
                }
            }
            const gambar = [
                "https://raw.githubusercontent.com/kayzuhosting/Shiroko-Multidevice/main/database/39431ad9a4.jpg"
            ]
            const photo = gambar[Math.floor(Math.random() * gambar.length)]
            let contextInfo = {
                mentionedJid: [sender],
                forwardingScore: 9999999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid,
                    serverMessageId: 100,
                    newsletterName
                },
                externalAdReply: {
                    showAdAttribution: true,
                    title: `ɪᴄʜɪᴋᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ `,
                    body: `Runtime ${transformText(runTime)}`,
                    previewType: "PHOTO",
                    thumbnailUrl: photo

                }
            }
            if (replyType === "web") {
                conn.sendMessage(from, {
                    contextInfo,
                    text: transformText(teks)
                }, {
                    quoted: m
                })
            } else if (replyType === "web2") {
                conn.sendMessage(from, {
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaType: 3,
                            renderLargerThumbnail: false,
                            thumbnailUrl: photo,
                            sourceUrl: `https://wa.me/${nomerOwner}?text=Hallo+kak`
                        }
                    },
                    text: teks
                }, {
                    quoted: m
                })
            } else if (replyType === "mess") {
                conn.sendMessage(from, {
                    id: m.key.id,
                    contextInfo: {
                        forwardingScore: 50,
                        isForwarded: true
                    },
                    showAdAttribution: true,
                    text: teks
                }, {
                    quoted: m
                })
            } else if (replyType === "katalog") {
                const {
                    generateWAMessageFromContent
                } = require("baileys")
                let prep = generateWAMessageFromContent(m.chat, {
                    orderMessage: {
                        itemCount: 20000,
                        status: 50000,
                        surface: 999,
                        message: transformText(teks),
                        description: '^^',
                        orderTitle: 'ʙᴇᴊɪʀ ᴅᴇᴋ',
                        productId: '8383179131783124',
                        retailerId: 'Menhera ( cjs )',
                        mediaType: 1,
                        curreyCode: 'IDR',
                        id: '746FD84806714E506605D655D52A9427',
                        totalCurrencyCode: 20.000,
                        totalAmount1000: '50000',
                        businessOwnerJid: '79809099521@s.whatsapp.net',
                        thumbnail: fs.readFileSync('./media/image/thumb.jpg'),
                        sourceUrl: `https://wa.me/p/+7 980 909-95-21/6289673462138`
                    }
                }, {
                    contextInfo: m.mentionJid,
                    quoted: m
                })
                conn.relayWAMessage(prep)
            } else if (replyType === "document") {
                conn.sendMessage(m.chat, {
                    document: fs.readFileSync("./package.json"),
                    fileName: 'ɪᴄʜɪᴋᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ ',
                    mimetype: "application/vnd.ms-excel",
                    fileLength: 999999999,
                    bpageCount: 10903,
                    //jpegThumbnail: fs.readFileSync('./stik/thumbnaildokumen.jpg'),
                    caption: transformText(teks),
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 9999999,
                        isForwarded: true,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: `ɪᴄʜɪᴋᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ`,
                            body: `${ucapanWaktu} kak ${pushname}`,
                            thumbnailUrl: photo,
                            mediaType: 1,
                            sourceUrl: `${web}`,
                        }
                    }
                }, {
                    quoted: m,
                    ephemeralExpiration: 86400
                })
            } else {
                m.reply('tidak di temukan silahkan periksa lagi')
            }
        }
        const reply = (teks) => {
            conn.sendMessage(from, {
                contextInfo: {
                    forwardingScore: 50,
                    isForwarded: true
                },
                showAdAttribution: true,
                text: teks
            }, {
                quoted: m
            })
        }
                // Reply Edit
        conn.editmsg = async (e, t) => {
            var a = [`${e}.`, `${e}..`, `${e}...`, `${e}....`, `${t}`];
            let {
                key: s
            } = await conn.sendMessage(m.chat, {
                text: e
            });

            for (let r = 0; r < a.length; r++) {
                await conn.sendMessage(m.chat, {
                    text: a[r],
                    edit: s
                });
            }
        }
        //message 
        require("./message/message.js")(m, conn, senderNumber, prefix, command, setReply)
        require("./message/listmenu.js")
        //=====================================//
        const getRandomMedia = (mediaArray) => mediaArray[Math.floor(Math.random() * mediaArray.length)]

        //VN saat ada yang toxic
        const astaga = getRandomMedia(vnToxic)
        //Vn Audio Menu
        const dmusic = getRandomMedia(vnMenu)
        //VN saat ada yg bilang bot
        const halo = getRandomMedia(vnBot)
        //VN saat ada yang ucap pagi
        const pagi = getRandomMedia(vnPagi)
        //VN saat ada yang ucap siang
        const siang = getRandomMedia(vnSiang)
        //VN saat ada yang ucap malam
        const malam = getRandomMedia(vnMalam)
        //VN saat ada yg akses fitur owner
        const gakmau = getRandomMedia(vnOwner)
        //VN saat ada yg spam
        const nospam = getRandomMedia(vnSpam)
        //VN saat ada yg bilang asalamualaikum
        const walaikumsalam = getRandomMedia(vnSalam)
        //VN saat ada yg bilang i love u
        const lopyoutoo = getRandomMedia(vnLove)
        //VN saat ada yg bilang ara
        const wibu = getRandomMedia(vnAra)
        //VN kawai
        const kawai = getRandomMedia(vnKawai)

        // ======= FUNCTION SEND STICKER =======//

        //stik cmd
        const detectCmd = getRandomMedia(stikCmd)

        //stik Tag Owner
        const TagOwner = getRandomMedia(stikTagOwn)

        //STIKER saat ada yg ga salam
        const stikSalm = getRandomMedia(stikSalam)
        //STIKER thanks 
        const stikThak = getRandomMedia(stikThanks)
        // command private 
        const onlyGroup = async () => {
            let jid = sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            let fiturnyaPrvt = transformText(`${menuprivate(prefix)}`)
            let teksMenuPrivate = `Hi @${jid.split("@")[0]}⁩ 🪸
ʜᴇʟʟᴏ ɪɴᴛʀᴏᴅᴜᴄᴇ ᴍᴇ ᴢᴇᴛᴀ ᴋᴀʏ's ᴄʀᴇᴀᴛɪᴏɴ ᴘʟᴇᴀsᴇ ɴᴏᴛᴇ ᴛʜᴀᴛ ɢʀᴏᴜᴘ ᴀɴᴅ ᴘʀɪᴠᴀᴛᴇ ғᴇᴀᴛᴜʀᴇs ᴀʀᴇ sᴇᴘᴀʀᴀᴛᴇᴅ.ᴛᴏ ᴀᴄᴄᴇss ᴍᴏʀᴇ ғᴇᴀᴛᴜʀᴇs, ᴊᴏɪɴ ᴏᴜʀ ɢʀᴏᴜᴘ ʙʏ ᴛʏᴘɪɴɢ: *.ɢᴄʙᴏᴛ*

◦ *Database* : https://raw.githubusercontent.com/Raihan-Fadillah/database/main/database.json
◦ *Library* : Baileys Terbaru
◦ *Rest API* : 
◦ *Source* :  

${readmore}\n\n
${fiturnyaPrvt}`

            let contextInfo = {
                mentionedJid: [sender],
                externalAdReply: {
                    showAdAttribution: true,
                    renderLargerThumbnail: true,
                    title: `ɪᴄʜɪᴋᴀ ᴍᴜʟᴛɪᴅᴇᴠɪᴄᴇ`,
                    sourceUrl: sgc,
                    mediaType: 1,
                    containsAutoReply: true,
                    thumbnailUrl: 'https://raw.githubusercontent.com/kayzuhosting/upload-db-media/main/uploader/e80460fe93.jpg'
                }
            }

            await conn.sendMessage(from, {
                contextInfo,
                text: teksMenuPrivate
            }, {
                quoted: m
            })
        }


        const addSpammer = function(jid, _db) {
            let position = false
            Object.keys(_db).forEach((i) => {
                if (_db[i].id === jid) {
                    position = i
                }
            })
            if (position !== false) {
                _db[position].spam += 1
            } else {
                let bulin = ({
                    id: jid,
                    spam: 1
                })
                _db.push(bulin)
            }
        }

        const FinisHim = async function(jid, _db) {
            let position = false
            Object.keys(_db).forEach((i) => {
                if (_db[i].id === jid) {
                    position = i
                }
            })
            if (position !== false) {
                if (_db[position].spam > 7) {
                    if (db.data.users[sender].banned.status || !isOwner) {
                        return
                    }
                    let obj = {
                        id: senderNumber,
                        status: true,
                        date: calender,
                        reason: "Spam Bot"
                    }
                    db.data.users[woke].banned = obj
                    console.log(`${jid} Terdeteksi spam lebih dari ${_db[position].spam} kali`)
                    mess.baned()
                }
            } else {
                console.log(`Spam ke ${_db[position].spam}`)
            }
        }


        //ANTI SPAM BERAKHIR
        if (SpamExpired(senderNumber, "Case", AntiSpam)) {
            let position = false
            for (let i of spammer) {
                if (i.id == senderNumber) {
                    position = i
                }
            }

            if (position !== false) {
                spammer.splice(position, 1)
                console.log(chalk.bgGreen(color("[  Remove ]", "black")), "Sukses remove spammer")
            }
        }






        SpamExpired(senderNumber, "NotCase", AntiSpam)

        if (isBanned && !isOwner) {
            return
        } //user terbanned

        if (isCmd && cekSpam("Case", senderNumber, AntiSpam)) {
            addSpammer(senderNumber, spammer)
            FinisHim(senderNumber, spammer)
            return console.log(chalk.bgYellowBright(chalk.black("[  SPAM  ]")), "antispam Case aktif")
        }

        //ANTI SPAM PRIVATE CHAT
        if (isAntiSpam && isCmd && msgFilter.isFiltered(from) && !isGroup && !itsMe && !isOwner) {
            addSpam("Case", senderNumber, "15 s", AntiSpam)
            addSpammer(senderNumber, spammer)
            return mess.spam()
        }

        //ANTI SPAM GROUP CHAT
        if (isAntiSpam && isCmd && msgFilter.isFiltered(from) && isGroup && !itsMe && !isOwner) {
            addSpam("Case", senderNumber, "15s", AntiSpam)
            addSpammer(senderNumber, spammer)
            return mess.spam()
        }
        if (isCmd && !isOwner) msgFilter.addFilter(from)







              //AUTO BLOCK CMD
        for (let i = 0; i < listcmdblock.length; i++) {
            if (command === listcmdblock[i].cmd) {
                if (autoblockcmd) {
                    return mess.block.Bsystem()
                } else {
                    return mess.block.Bowner()
                }
            }
        }

        //FITUR USER PREMIUM
        if (!checkDataName("premium", "", DataId)) {
            await createDataId("premium", DataId)
        }
        let userPremium = DataId.filter(item => item.name == "premium")
        for (let i of userPremium[0].id) {
            if (command == i && !isPremium) return setReply(`Kamu bukan user premium`)
        }


        //FITUR KHUSUS OWNER
        if (!checkDataName("commands", "", DataId)) {
            await createDataId("commands", DataId)
        }
        let ownerCommands = DataId.filter(item => item.name == "commands")
        for (let i of ownerCommands[0].id) {
            if (command == i && !isOwner) return mess.only.owner()
        }



        //FITUR USER LIMIT
        if (!checkDataName("limit", "", DataId)) {
            await createDataId("limit", DataId)
        }
        let userLimit = DataId.filter(item => item.name == "limit")
        for (let i of userLimit[0].id) {
            if (!isOwner && command == i) {
                if (!isPremium && db.data.users[sender].limit < 1) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium && q) {
                    db.data.users[sender].limit -= 1
                    conn.sendMessage(from, {
                        text: `Limit kamu tersisa ${user.limit}`
                    }, {
                        quoted: m
                    })
                }

            }
        }
        //Auto Hit
        expiredCmd(hitnya, dash)
        const thisHit = `${getHit("run", hitnya)}`
        global.thisHit = thisHit

        if (isCmd) {
            db.data.users[sender].hit += 1
            if (m.isGroup) db.data.chats[m.chat].hit += 1
            cmdAdd("run", "1d", hitnya)
            Succes(toFirstCase(command), dash, allcommand)
        }











        // ─── Deteksi Balasan Menfess ──────────────────────────────────
        // Jika pesan masuk bukan command, bukan dari group, bukan dari bot sendiri
        // cek apakah pengirim adalah penerima salah satu menfess
        if (!isCmd && !isGroup && !m.fromMe && budy && budy.trim().length > 0) {
            try {
                const MENFES_FILE = './database/private/menfes.json'
                const axios = require('axios')
                if (require('fs').existsSync(MENFES_FILE)) {
                    let menfesData = JSON.parse(require('fs').readFileSync(MENFES_FILE, 'utf-8'))
                    const senderJid = m.sender // format: 628xxx@s.whatsapp.net

                    // Cari menfess yang penerimaannya adalah sender ini, belum ada balasan, terbaru
                    const menfessUntukDibalas = Object.values(menfesData)
                        .filter(mf => mf.penerima === senderJid && (!mf.balasan || mf.balasan === ''))
                        .sort((a, b) => (b.waktu || b.id) - (a.waktu || a.id))[0]

                    if (menfessUntukDibalas) {
                        // Simpan balasan ke database lokal
                        const balasanData = {
                            isi: budy.trim(),
                            waktu: Date.now()
                        }
                        menfesData[menfessUntukDibalas.id].balasan = budy.trim()
                        menfesData[menfessUntukDibalas.id].waktuBalasan = Date.now()
                        require('fs').writeFileSync(MENFES_FILE, JSON.stringify(menfesData, null, 2))

                        // Forward balasan ke webhook web
                        const WEBHOOK_URL = process.env.WEB_WEBHOOK_URL
                        const WEBHOOK_SECRET = process.env.WEB_WEBHOOK_SECRET || 'xalixia-secret-key'
                        if (WEBHOOK_URL) {
                            axios.post(WEBHOOK_URL, {
                                menfessId: String(menfessUntukDibalas.id),
                                balasan: budy.trim(),
                                waktu: Date.now()
                            }, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-webhook-secret': WEBHOOK_SECRET
                                },
                                timeout: 5000
                            }).then(() => {
                                console.log(`[MENFESS] Balasan dari ${senderJid} dikirim ke webhook web`)
                            }).catch(err => {
                                console.error('[MENFESS] Gagal kirim webhook:', err.message)
                            })
                        }

                        // Balas ke penerima bahwa balasannya sudah diteruskan
                        await conn.sendMessage(m.chat, {
                            text: '✅ Balasanmu sudah diteruskan ke pengirim menfess!'
                        })
                        return
                    }
                }
            } catch (e) {
                console.error('[MENFESS REPLY] Error:', e.message)
            }
        }
        // ─────────────────────────────────────────────────────────────

        //Jika ada yg toxic botz akan merespon✓
        if (bad.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, astaga, m)
        }
        //Jika ada yg panggil bot
        if (katabot.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, halo, m)

        }
        //Jika ada yg lopyu
        if (katalopyu.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, lopyoutoo, m)
        }
        //Jika ada yang bilang ohayo pagi bot akan merespon✓
        if (ohayo.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            if (time >= '11:00' && time <= '23:50') return reply("Hadeuh sekarang udah ga pagi kak")
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, pagi, m)
            //setReply(`${ucapanWaktu} kak`)
        }
        //Jika ada yang bilang oyasumi malem bot akan merespon✓
        if (katamalem.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            if (time >= '06:00' && time <= '17:00') return setReply("Hadeuh sekarang udah ga malem kak")
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, malam, m)
            //setReply(`${ucapanWaktu} kak`)
        }
        //Jika ada yang bilang koniciwa siang bot akan merespon✓
        if (katasiang.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            if (time >= '06:00' && time <= '00:00') return setReply("Hadeuh sekarang udah ga siang kak")
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, siang, m)
            //setReply(`${ucapanWaktu} kak`)
        }
        //Jika ada yg ucap salam bot akan merespon   
        if (budy.startsWith('Assalamualaikum') || budy.startsWith(`Assalamu'alaikum`) || budy.startsWith('assalamualaikum')) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, walaikumsalam, m)
        }
        //Jika ada yg ucap salam bot akan merespon   
        if (budy.startsWith('SALKEN') || budy.startsWith('salken')) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            m.reply(`salam kenal juga ${pushname}`)
        }
        //Jika ada yg ara bot✓
        if (katara.includes(budy)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendvn(m.chat, wibu, m)
        }
        //JIKA ADA YANG TAG NOMOR OWNER 
        // JIKA ADA YANG TAG NOMOR OWNER
        if (isGroup && budy.includes(`${nomerOwner}`)) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)

            const teks = `*Mungkin aku terlalu peduli dengan perasaan orang lain sampai mereka lupa bahwa aku juga punya perasaan*\n> Kay`
            conn.sendMessage(m.chat, {
                text: teks
            }, {
                quoted: m
            })
        }
        //Jika ada yg cek prefix bot akan merespon 
        if (budy.includes('ekprefix')) {
            if (cekSpam("NotCase", senderNumber, AntiSpam)) return
            addSpam("NotCase", senderNumber, "10s", AntiSpam)
            conn.sendMessage(from, {
                text: `Baik kak untuk prefix saat ini adalah : 「  ${thePrefix}  」`
            }, {
                quoted: m
            })
        }

        const filePath = './plugins/Case/case.js'
        const caseFound = await totalCase(filePath, command)

        //--------PLUGINS-------\\
        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        const ___dirname = path.join(__dirname, './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(conn, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                }
            }


            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [
                    [_prefix.exec(m.text), _prefix]
                ] :
                Array.isArray(_prefix) ? // Array?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? // RegExp in Array?
                        p :
                        new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ? // String?
                [
                    [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                ] : [
                    [
                        [], new RegExp
                    ]
                ]
            ).find(p => p[1])


            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(conn, m, {
                        thePrefix,
                        store,
                        isAccept,
                        command,
                        q,
                        match,
                        conn,
                        prefix,
                        setReply,
                        reply,
                        participants: m.groupMembers,
                        groupMetadata: m.groupMetadata,
                        user: m.user,
                        bot: m.bot,
                        isROwner: isOwner,
                        isOwner,
                        isRAdmin: m.isRAdmin,
                        isAdmin: m.isAdmin,
                        isBotAdmin: m.isBotAdmin,
                        isPremium,
                        isprems: isPremium,
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    }))
                    continue
            }

            if (typeof plugin !== 'function')
                continue

            let fail = plugin.fail || global.dfail
            usedPrefix = (match[0] || '')[0] || prefix



            if (command || usedPrefix) {
                let noPrefix = m.body.replace(usedPrefix, '')
                let _args = noPrefix.trim().split` `.slice(1)
                let text = q
                var isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                    plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                        cmd.test(command) : cmd === command) : typeof plugin.command === 'string' ? // String?
                    plugin.command === command : false
                if (!isAccept) continue
                m.plugin = name
                if (plugin.rowner && plugin.owner && !(isOwner)) {
                    fail('owner')
                    break
                }
                if (plugin.owner && !isOwner) {
                    mess.only.owner()
                    break
                }
                if (plugin.premium && !isPremium) {
                    fail('premium')
                    break
                }
                if (plugin.groupvip && m.isGroup && !global.db.data.chats[m.chat].vip) {
                    fail('groupvip')
                    break
                }
                if (plugin.group && !m.isGroup) {
                    return onlyGroup()
                    break
                } else if (plugin.noCmdPrivate && !m.isGroup) {
                    return
                    break
                } else if (plugin.botAdmin && !m.isBotAdmin) {
                    fail('botAdmin')
                    break
                } else if (plugin.admin && !m.isAdmin) {
                    global.mess.only.admin()

                    break
                }
                if (plugin.selerpanel && !isResPanel) {
                    fail('selerpanel')
                    break
                } else if (plugin.gcStore) {
                    if (m.isGroup && m.chat === global.idGcStore) {
                        let twknya = `${menutoko(prefix)}`
                        conn.sendReact(m.chat, '📂', m)
                        return reply(twknya)
                        break
                    }
                } else if (plugin.cmdStore && !(m.chat === idGcStore || !m.isGroup)) {
                    fail('cmdstore')
                    break
                }
                if (plugin.noCmdStore && m.chat === global.idGcStore) {
                    fail('nocmdstore')
                    break
                }
                if (plugin.private && m.isGroup) {
                    fail('private')
                    break
                }
                if (plugin.register && !_user.registered) {
                    fail('unreg')
                    break
                }
                if (plugin.onlyprem && !m.isGroup && !isPremium) {
                    fail('onlyprem')
                    break
                }
                if (plugin.rpg && m.isGroup && !global.db.data.chats[m.chat].rpg) {
                    fail('rpg')
                    break
                }
                if (plugin.game && m.isGroup && !global.db.data.chats[m.chat].game) {
                    fail('game')
                    break
                }

                if (plugin.limitAi && !isPremium && text) {
                    if (!isPremium) {
                        if (db.data.users[sender].limitAi < 1) return reply(`Limit Ai kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                        db.data.users[sender].limitAi -= 1
                        conn.sendMessage(from, {
                            text: `Limit Ai kamu tersisa ${user.limitAi}`
                        }, {
                            quoted: m
                        })
                    }
                }

                if (plugin.limit && !isPremium && text) {
                    if (!isPremium) {
                        if (db.data.users[sender].limit < 1) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                        db.data.users[sender].limit -= 1
                        conn.sendMessage(from, {
                            text: `Limit kamu tersisa ${user.limit}`
                        }, {
                            quoted: m
                        })
                    }
                }


                if (user && plugin.age > _user.age) {
                    setReply(`[💬] Umurmu harus diatas ${plugin.age} Tahun untuk menggunakan fitur ini...`)
                    break
                }



                let extra = {
                    setReply,
                    reply,
                    store,
                    dmusic,
                    reply,
                    onlyGroup,
                    isAccept,
                    q,
                    prefix,
                    usedPrefix,
                    noPrefix,
                    args,
                    command,
                    text,
                    conn,
                    participants: m.groupMembers,
                    groupMetadata: m.groupMetadata,
                    user: m.user,
                    bot: m.bot,
                    isROwner: isOwner,
                    isOwner,
                    isRAdmin: m.isRAdmin,
                    isAdmin: m.isAdmin,
                    isBotAdmin: m.isBotAdmin,
                    isPremium,
                    isprems: isPremium,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }

                try {
                    await plugin.call(conn, m, extra)
                } catch (err) {

                    if (err.message !== undefined) {
                        let e = util.format(err)
                        await conn.sendText(Ownerin, `]─────「 *SYSTEM-ERROR* 」─────[\n\n${e}\n\n© ${botName}`, m)

                        if (isCmd) Failed(toFirstCase(command), dash)
                        if (checkError(err.message, db.data.listerror)) return
                        addError(err.message, command, db.data.listerror)

                        if (autoblockcmd) {
                            addblockcmd(command, listcmdblock)
                            await setReply("Command telah di block karena terjadi error")
                        }

                        await sleep(2000)
                        m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\ ${e}`.trim(), nomerOwner + "@s.whatsapp.net")
                    } else {
                        //log(err)
                        let e = util.format(err)
                        m.reply(`${e}`)

                    }




                } finally {

                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(conn, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }

                }
                break
            }


        } //akhir dari name in global plugins


        if (autoDetectCmd) {
            if (!isGroup) return
            if (isCmd && !isAccept && !caseFound) {
                await Nothing(toFirstCase(command), dash, allcommand)
                const stringSimilarity = require("string-similarity")
                let matches = await stringSimilarity.findBestMatch(toFirstCase(command), allcommand)
                const suggestion = matches.bestMatch.target.toLowerCase()
                const replyText = `Command *${prefix + command}* tidak ditemukan\nMungkin yang kamu maksud adalah *${prefix + suggestion}*`

                if (responType === "text") {
                    setReply(replyText)
                } else if (responType === "sticker") {
                    conn.sendSticker(m.chat, detectCmd, m)
                } else {
                    setReply(replyText)
                }
            }
        }

    } catch (err) {
        Logerror(m, err)
        console.log(chalk.bgRed(chalk.black("[  ERROR  ]")), util.format(err))
        let e = String(err)
        if (e.includes("this.isZero")) {
            return
        }
        if (e.includes("rate-overlimit")) {
            if (!publik) return
            publik = false
            await conn.sendMessage(nomerOwner + "@s.whatsapp.net", {
                text: `Terjadi rate-overlimit
Bot telah mengganti dari mode Public ke mode Self
Untuk menghindari spam yang berlebihan,
Silakan tunggu 1 menit hingga semua pesan
telah terbaca oleh bot`
            })
            await setTimeout(() => {
                publik = true
                conn.sendMessage(nomerOwner + "@s.whatsapp.net", {
                    text: `Berhasil mengubah mode self ke mode public`
                })
            }, 60000)
            return
        }
        if (e.includes('Connection Closed')) {
            return
        }
        if (e.includes('Timed Out')) {
            return
        }
        if (e.includes('Value not found')) {
            return
        }
        console.log(chalk.white('Message Error : %s'), chalk.green(util.format(e)))
    }





} //Akhir export default