process.env.NTBA_FIX_319 = 1;
const parser = require('rss-parser');
const config = require('./config.json');
const sanitizeHtml = require('sanitize-html');

// const Database = require('./database');
// const db = new Database(config.published_database);
const Firebase = require('../firebase');
const db = new Firebase(config.firebase_path);

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegram.token, {polling: false});
const instantViewStart = 'https://t.me/iv?url=';
const instantViewEnd = '%2F&rhash=1406ed45adff04'; // '%2F&rhash=08ab6327085c24';


const sendUpdate = function (entry) {
    const content = sanitizeHtml(entry.content, {
        allowedTags: ['b', 'i', 'strong', 'em', 'pre', 'code', 'a'],
        allowedAttributes: {
            a: ['href'],
        },
    });
    console.log('sendUpdate', entry.title);
    bot.sendMessage(config.telegram.channel,
        "<b>" + entry.title + "</b>\n" +
        "<a href=\"" + instantViewStart + entry.link + instantViewEnd + "\">" + "Мақоларо кушоед" + "</a>\n" + content.replace(/\s+/g, ' ').trim(),
        {
            parse_mode: "HTML",
            disable_web_page_preview: false,
        },
    );
};

const fetchFeed = function () {
    parser.parseURL(config.source.feed, function (error, parsed) {
        console.log(parsed.feed.title);

        for (let i = parsed.feed.entries.length - 1; i >= 0; i--) {
            const entry = parsed.feed.entries[i];

            if (!db.isItemAlreadyParsed(entry.guid)) {
                sendUpdate(entry);
                db.addItem(entry.guid);
            } else {
                // already parsed
                console.log(entry.title);
            }

            // console.log("<b>" + entry.title + "</b>\n" +
            //     "<a href=\"" + entry.link + "\">" + entry.link + "</a>\n");
        }
        console.log(new Date() + ' index_ writeDatabase');
        db.writeDatabase();
    });
};

db.getData().then(() => {
    fetchFeed();
    setInterval(fetchFeed, config.source.refresh_interval);
});

if (config.status_monitor_port !== null) {
    require('../monitor').start(config.status_monitor_port);
}
function forClock() {
    fetchFeed();
    setTimeout(forClock, config.source.interval);
}

module.exports = forClock;
