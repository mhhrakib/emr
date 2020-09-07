'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const admin = require('./enrollAdmin.js');
const user = require('./registerUser.js');
const query = require('./query.js');

async function init() {
    app.use(cors())
    app.use(express.json());

    await connect();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/admin/addUser', (req, res) => addUser(req, res));
    // app.post('/doctor/getEMR', (req, res) => getEMR(req, res));
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

async function connect() {
    await admin.enroll();
    await user.register();
}


async function addUser(req, res) {
    //userEmail: userEmail,
    //adderEmail: adderEmail,
    //emrID: emrID,
    //type: type,
    //content: content
    try {
        await query.initialize();
        const result = await query.addUser(req.body.name, req.body.email, req.body.type);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
        console.error(`error on addEMRRoute: ${error}`);
    }
}

// async function getEMR(req, res) {
//     // emrID: emrID,
//     // userEmail: userEmail
//     try {
//         await query.initialize();
//         const result = await query.getEMR(req.body.emrID, req.body.userEmail);
//         res.status(200).send(result);
//     } catch (error) {
//         res.status(500).send(error.toString());
//         console.error(`error on getEMRRoute: ${error}`);
//     }
// }


init();
