let Parser = require('rss-parser');
const config = require("./en/config.json");
let parser = new Parser();
const instantViewStart = 't.me/iv?url=';
const instantViewEnd = '%2F&rhash=9d32dd12d692ca';//'%2F&rhash=1406ed45adff04'; // '%2F&rhash=08ab6327085c24';

const clearForMarkdown = function (text) {
    return text.replace(/ \| /g, '\n').replace(/[_*[\]()~`>#\+\-=|{}.!]/g, '\\$&');
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const sendUpdate = async function (entry, config, bot, openText) {

    console.log('sendUpdate', entry.title);

    let entryLink = instantViewStart + entry.link.slice(0, -1) + instantViewEnd;

    const markdownV2Message = `
            *${clearForMarkdown(entry.title)}*
            [${openText}](${clearForMarkdown(entryLink)})
        `;



    await bot.sendMessage(config.telegram.channel,
        markdownV2Message,
        {
            parse_mode: "MarkdownV2",
            disable_web_page_preview: false,
        },
    );


};

exports.fetchFeed = function (config, db, bot, openText) {

    parser.parseURL(config.source.feed, function (error, parsed) {

        (async () => {

            let feed = await parser.parseURL(config.source.feed);

            for (const item of feed.items) {
                const index = feed.items.indexOf(item);
                console.log(item.title + ':' + item.link);
                const entry = item;



                if (!db.isItemAlreadyParsed(entry.guid)) {

                    try {
                        await sendUpdate(entry, config, bot, openText);
                        db.addItem(entry.guid);
                    } catch (error) {
                        if (error.response && error.response.status === 429) {
                            const retryAfter = error.response.headers['retry-after'];
                            console.log(`Rate limited, retrying after ${retryAfter} seconds...`);
                            await delay(retryAfter * 1000); // Convert seconds to milliseconds
                            await sendUpdate(entry, config, bot, openText); // Retry the request
                        } else {
                            console.error('Telegram API request failed:', error);
                        }
                    }

                } else {
                    // already parsed
                    console.log('already parsed ' + entry.title);
                }

            }

            await db.writeDatabase();
            await console.log(new Date() + ' index_ writeDatabase');
        })();
    });
};
