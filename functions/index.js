const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();
require("dotenv").config();

exports.sendEmailNotification = functions.firestore
    .document("contactData/{docId}")
    .onCreate((snap, ctx) => {
        const data = snap.data();
        let authData = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });
        authData
            .sendMail({
                from: `${data.email}`,
                to: "hkartgearcontact@gmail.com, hkartgear@biznetvigator.com",
                subject: `[BLESS ASIA] ${data.subject}`,
                text: `名字: ${data.name} \n電郵地址: ${data.email} \n\n信息: ${data.message}`,
            })
            .then((res) => console.log("Email sent succesfully!"))
            .catch((err) => console.log("ERROR: " + err));
    });