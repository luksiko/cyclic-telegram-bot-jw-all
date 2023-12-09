let Parser = require('rss-parser');
const sanitizeHtml = require("sanitize-html");
const Firebase = require("./firebase");
const TelegramBot = require("node-telegram-bot-api");
let parser = new Parser();
const config = require('./config.json');

const SITE = config.source.site.ps8318;  // выберете сайт jw, isa4310, ps8318

const clearForMarkdown = (text) => text.replace(/ \| /g, '\n').replace(/[_*[\]()~`>#\+\-=|{}.!]/g, '\\$&');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const sendUpdate = async function (item, config, bot, current_language) {

    let itemLink = 't.me/iv?url=' + item.link.slice(0, -1) + '%2F&rhash=' + SITE.hash;
    // символ точки как скрытая ссылка
    const markdownV2Message = `*${clearForMarkdown(item.title)}*\n[${current_language.open_article}](${clearForMarkdown(itemLink)})`; 

    const content = sanitizeHtml(item.content, {
        allowedTags: ['b', 'i', 'strong', 'em', 'pre', 'code', 'a', 'img'],
        allowedAttributes: {
            a: ['href'],
        },
    });

    await bot.sendMessage(current_language.telegram.channel,
        markdownV2Message,
        {
            parse_mode: "MarkdownV2",
            disable_web_page_preview: false,
        },
    );

};

exports.fetchFeed = async function (config, current_language, languageKey) {

    let bot = new TelegramBot(current_language.telegram.token, {polling: false});
    let db = new Firebase('posts_' + languageKey);

    await db.getData();
    await bot;

    let feedURL = SITE.url + current_language.code + current_language.whats_new + config.source.feed_end;
    let feed = await parser.parseURL(feedURL);

    for (const item of feed.items) {

        if (!db.isItemAlreadyParsed(item.guid)) {

            try {
                console.log('Not parsed ' + item.title);
                db.addItem(item.guid);
                await sendUpdate(item, config, bot, current_language);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    const retryAfter = error.response.headers['retry-after'];
                    console.log(`Rate limited, retrying after ${retryAfter} seconds...`);
                    await delay(retryAfter * 1000); // Convert seconds to milliseconds
                    await sendUpdate(item, config, bot, current_language); // Retry the request
                } else {
                    console.error('Telegram API request failed:', error);
                }
            }

        } else {
            // already parsed
            console.log('already parsed ' + item.title);
        }
    }

    await db.writeDatabase();
    await console.log(new Date() + ' index_ writeDatabase');

};
