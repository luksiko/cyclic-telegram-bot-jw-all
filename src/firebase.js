const admin = require('firebase-admin');
require("dotenv").config();
const serviceAccount = process.env;

admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": serviceAccount.FIREBASE_PROJECT_ID,
        "client_email": serviceAccount.FIREBASE_CLIENT_EMAIL,
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQClI7M2GZjM5D5e\nyvTuKDd/97LVXH2QeO6WfNQmJp1jttB+Uf40brVYM9UnWJmZvb3rBN5bFhhuBq5y\nnY0yzdF81AAyYxs/s6kHnpGJebiwgtNze/BRQhGqjav0zkJ0gPspc9l0GTMM/KyP\nqjQUO4Of2S2auG1VrZJrANhZpUUdsU2UM8JYOGJzQkdrEZiG00AYYoUaGEnfdqgO\n+D4Uc1ddXwhPNjlETWJTzia2B8vaC+Q6A4jrkCtNmuWxYi5YWK8zSs0y4WRsQu51\nhlOT9zbR+lUhMPsxqodRZp+kKsBUpdYNjxgk3SxteOG9uWoKWRyZUcF6D2GC1xfJ\nw8Rc+Jf/AgMBAAECggEAEEUxLf5doKpIPtyuPxy1QyVreDwRnv9bOnZ4DH43eZCU\ngC2h5xaVRWht8t922r/oC1TCd6T4qTZ9T4uYUs4Wer8EefJrx93ypG6KFkpo2PM6\n1CD873Sb+vrUW11LDOF8XXwti5PEBN6MPedeFDQ85q3mIV1UYGGmkGZX6pUu9xrN\nbLSPwNRZleU/2tJSK+8BJqBj9SitCShPdCJYZOcwibwBtqBNA9Be1cfFehJfxoiY\nsPxL4vp2ygWUUmQpmMwjj8K8PYGHMC5o67VGcJlId9tN4V7yPPaK7bRGHtvbONql\nGhw/NabZrCY8kPbjZa/0Y0MqslpzIJrgMVFBKatNuQKBgQDR1vgpu98aCjWcgXYX\nY3iJPbm5r4sp/7wwEoE3nI492mWEhCj6N14l5jmST59cbjM53D3juTByYE2q3KxG\nEIHuJwGOgqs9dP8+Nq5qR1RPW9gdglpKptwNIgwaoH16W7ggXHvrPPM6wW+Bg/a5\n4obJQUjaUJvkXzga/2VLL27GLQKBgQDJd3RufX/Xw4e90j+abDfmpK2wCb+CC9d3\nS2jt/xFT/mnbOqg9f+9UShytYkA9RYhfIhB2zIv6PuuGt1pIqe+PDqc1PigW9cYV\nQtcIgae9CKNRZ2Em7nKozMiL8oK6oAF+ylsVCuFJxHZ0rOqtb85v67KNvNAVvOVU\nPm/6bgZ+WwKBgQCf1h8xqulF7IDptbM+HYazA1F1H0Hhu+qcs3u54IZ4luK9De4o\nqgQM2lEAIaZBwa9DY3/A9k7w0GpYu759oBVYUl3dL6tAJN5HhV9VlP+jc1IrKB+e\nvXrghg6yOY1apoKaI9hAVyzulGlbPimxbds9cX0Mzlnwmpch+Wgu3PKEAQKBgQCp\nqxGCT+0PsBsscNmh2ovFkWC5RaxkAEcIr5iB/vL/8t4BhEfV612KdhPqrTj+oQV1\nYQHOmvsz2DOQs++0DHG04BlPjLZEh923YCAqiM7UM2cfklnOaLhlknk+6xDPzRsV\nRaQpd40+C9fa8Rl+0Q9hUHWCSsZP2FKmfSLfHDQZywKBgQCGM3ewegA1RncwuJHO\nmeFgVKC16A2ue2m3SBZ92SCK+UPDGk74AgScERnBuluXXvEpGo+Ch9OWeCsm1L/e\nV2m4KvX7xV9oaTAwJ1Xyci3MocsGtFXnEklnj4T+ItpGYxUaik/VWLY3g3g6KBls\nTZjVjiQB1xZ6iJuBYFrSh24Vdg==\n-----END PRIVATE KEY-----\n"
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
