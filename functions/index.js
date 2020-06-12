
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

app.get("/happy/", async(req, res) => {
    res.sendfile("../public/header.html");
})

exports.app = functions.https.onRequest(app);
