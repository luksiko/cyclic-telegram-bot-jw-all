const admin = require('firebase-admin');
// const serviceAccount = require('./admin.json');
require("dotenv").config();
var serviceAccount = process.env;

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": serviceAccount.FIREBASE_PROJECT_ID,
        "private_key_id": serviceAccount.FIREBASE_PRIVATE_KEY_ID,
        "private_key": serviceAccount.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        "client_email": serviceAccount.FIREBASE_CLIENT_EMAIL,
        "client_id": serviceAccount.CLIENT_ID,
        "auth_uri": serviceAccount.AUTH_URI,
        "token_uri": serviceAccount.TOKEN_URI,
        "auth_provider_x509_cert_url": serviceAccount.AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": serviceAccount.CLIENT_X509_CERT_URL
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
    authDomain: process.env.FIREBASE_PROJECT_ID + ".firebaseapp.com",
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
