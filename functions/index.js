
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// const wit = require('./wit');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {Wit, log} = require("node-wit");
admin.initializeApp();
// admin.functions().useFunctionsEmulator('http://localhost:5001');

const client = new Wit({accessToken: "PEDIZ6QF3QCF3XLTCABYX4WO4V54DWMM"})

// exports.predictMsg = functions.https.onRequest(async (req, res) => {
//     const msg = req.body.msg;
//     //let result =  wit.predict(msg);
//     //console.log(result);

//     client.message(msg, {})
//     .then((data) => {
//         res.json(data);
//         return data;
//     })
//     .catch(console.error)
    
// })

// exports.callPredictMsg = functions.https.onCall((data, context) => {
//     const msg = data.msg;
    
//     client.message(msg, {})
//     .then((data) => {
//         return data;
//     })
//     .catch(console.error)
// })
