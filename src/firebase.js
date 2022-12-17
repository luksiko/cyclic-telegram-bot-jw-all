const admin = require('firebase-admin');
// const serviceAccount = require('./admin.json');
require("dotenv").config();
var serviceAccount = process.env;
console.log(serviceAccount);

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    // databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`,
    // authDomain: serviceAccount.project_id + ".firebaseapp.com",
});

class Firebase {
    constructor(path) {
        this.databasePath = admin.database().ref(path);
        this.alreadyParsedPosts = [];
        this.readDatabase();
    }

    async getData() {
        await this.databasePath.once('value').then(data => {
            this.alreadyParsedPosts = JSON.parse(data.val());
        });
    }

    readDatabase() {
        if (!this.databasePath) {
            console.log('Database path is not defined');
            this.writeDatabase();
        } else {
            console.log('Database path is readDatabase getData');
            this.getData();
        }
    }

    writeDatabase() {
        this.databasePath.set(JSON.stringify(this.alreadyParsedPosts));
    }

    isItemAlreadyParsed(guid) {
        // console.log("isItemAlreadyParsed... " + this.alreadyParsedPosts.includes(guid));
        return this.alreadyParsedPosts.includes(guid);
    }

    addItem(guid) {
        if (!this.alreadyParsedPosts.includes(guid)) {
            this.alreadyParsedPosts.push(guid);
        }
    }
}

module.exports = Firebase;
