//OnInterval: clock_update
require("dotenv").config();

var indexRU = require('./ru/index.js')
var indexTJ = require('./tj/index.js')
var indexEN = require('./en/index.js')
var threeSecondInterval = function(){
    console.log("Another 3 seconds have gone by. What did you do in them?");
    indexRU();
    indexTJ();
    indexEN();
}
setInterval(threeSecondInterval, 600000)

//For specific times, use a chron job
var fifteenSeconsAfterMinute = function() {
    indexRU();
    indexTJ();
    indexEN();
    console.log("Another minute is gone forever. Hopefully, you made the most of it...");
}
var CronJob = require('cron').CronJob;
new CronJob({
    cronTime: "0 * * * *",
    onTick: fifteenSeconsAfterMinute,
    start: true,
    timeZone: "Asia/Dushanbe"
});
