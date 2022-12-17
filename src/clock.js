//OnInterval: clock_update
var indexRU = require('./ru/index.js')
var indexTJ = require('./tj/index.js')
var indexEN = require('./en/index.js')
var threeSecondInterval = function(){
    console.log("Another 3 seconds have gone by. What did you do in them?");
    indexRU();
    indexTJ();
    indexEN();
    return true;
}
threeSecondInterval();

