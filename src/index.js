process.env.NTBA_FIX_319 = 1;
const config = require('./config.json');
const { fetchFeed } = require("./services");
const { promisify } = require('util');
const {CronJob}  = require('cron');
const setTimeoutPromise = promisify(setTimeout);



// Объявляем асинхронную функцию для выполнения перебора
async function processLanguages() {
    for (const languageKey in config.source.languages) {
        if (config.source.languages.hasOwnProperty(languageKey)) {
            let current_language = config.source.languages[languageKey];
            
            try {
             await fetchFeed(config, current_language, languageKey).then(() => {})
                // Здесь вы можете обработать response, если это необходимо
            } catch (error) {
                console.error(`Error for language ${languageKey}:`, error);
                process.exit(1);
            }
        }
    }
    
}

// Вызываем асинхронную функцию
(async () => {
    await processLanguages();
    await setTimeoutPromise(config.source.send_interval);
    process.exit(); // Exit the Node.js process
})();

// add cron job for processLanguages()
// const job = new CronJob(
//     '28 * * * *', // cronTime
//     async function () {
//         await processLanguages();
//     }, // onTick
//     null, // onComplete
//     true, // start
//     'America/Los_Angeles' // timeZone
// );
