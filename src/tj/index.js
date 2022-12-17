process.env.NTBA_FIX_319 = 1;
const config = require('./config.json');

const TelegramBot = require('node-telegram-bot-api');

const Firebase = require('../firebase');
const {fetchFeed} = require("../services");
const db = new Firebase(config.firebase_path);

const bot = new TelegramBot(config.telegram.token, {polling: false});

// db.getData().then(() => {
//     fetchFeed(config, db, bot, config.open_article);
// });
//
// if (config.status_monitor_port !== null) {
//     require('../monitor').start(config.status_monitor_port);
// }

function forClock() {
    fetchFeed(config, db, bot, config.open_article);
}

module.exports = () => setTimeout(forClock, config.source.send_interval);
