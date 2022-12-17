const sanitizeHtml = require("sanitize-html");
const parser = require("rss-parser");
const instantViewStart = 'https://t.me/iv?url=';
const instantViewEnd = '%2F&rhash=1406ed45adff04'; // '%2F&rhash=08ab6327085c24';


const sendUpdate = function (entry, config, bot, openText) {
    const content = sanitizeHtml(entry.content, {
        allowedTags: ['b', 'i', 'strong', 'em', 'pre', 'code', 'a'],
        allowedAttributes: {
            a: ['href'],
        },
    });
    console.log('sendUpdate', entry.title);
    bot.sendMessage(config.telegram.channel,
        "<b>" + entry.title + "</b>\n" +
        "<a href=\"" + instantViewStart + entry.link + instantViewEnd + "\">" + openText + "</a>\n" + content.replace(/\s+/g, ' ').trim(),
        {
            parse_mode: "HTML",
            disable_web_page_preview: true,
        },
    );
};

exports.fetchFeed = function (config, db, bot, openText) {
    parser.parseURL(config.source.feed, function (error, parsed) {
        console.log(parsed.feed.title);

        for (let i = parsed.feed.entries.length - 1; i >= 0; i--) {
            const entry = parsed.feed.entries[i];

            if (!db.isItemAlreadyParsed(entry.guid)) {
                sendUpdate(entry, config, bot, openText );
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
