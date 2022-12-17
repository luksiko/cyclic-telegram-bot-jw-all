const admin = require('firebase-admin');
require("dotenv").config();
const serviceAccount = process.env;

admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": serviceAccount.FIREBASE_PROJECT_ID,
        "client_email": serviceAccount.FIREBASE_CLIENT_EMAIL,
        "private_key": serviceAccount.FIREBASE_PRIVATE_KEY
    }),
    databaseURL: `https://${serviceAccount.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
    authDomain: serviceAccount.FIREBASE_PROJECT_ID + ".firebaseapp.com",
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
