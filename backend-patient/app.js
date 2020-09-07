'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const admin = require('./enrollAdmin.js');
const user = require('./registerUser.js');
const query = require('./query.js');

async function init() {
    app.use(cors())
    app.use(express.json());

    await connect();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/patient/grantViewAccess', (req, res) => grantViewAccess(req, res));
    app.post('/patient/revokeViewAccess', (req, res) => revokeViewAccess(req, res));
    app.post('/patient/grantAddAccess', (req, res) => grantAddAccess(req, res));
    app.post('/patient/revokeAddAccess', (req, res) => revokeAddAccess(req, res));
    app.post('/patient/getEMR', (req, res) => getEMR(req, res));
    // app.get('/revokeView', (req, res) => viewDeviceRoute(req, res));

    // app.post('/distribute', (req, res) => distributeDeviceRoute(req, res));

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}

async function connect() {
    await admin.enroll();
    await user.register();
}

async function grantViewAccess(req, res) {
    try {
        await query.initialize();
        const result = await query.grantViewAccess(req.body.userEmail, req.body.viewerEmail ,req.body.emrID);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
        console.error(`error on grantViewAccessRoute: ${error}`);
    }
}


async function revokeViewAccess(req, res) {
    try {
        await query.initialize();
        const result = await query.revokeViewAccess(req.body.userEmail, req.body.viewerEmail, req.body.emrID);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
        console.error(`error on revokeViewAccessRoute: ${error}`);
    }
}

async function grantAddAccess(req, res) {
    try {
        await query.initialize();
        const result = await query.grantAddAccess(req.body.userEmail, req.body.adderEmail);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
        console.error(`error on grantAddAccessRoute: ${error}`);
    }
}

async function revokeAddAccess(req, res) {
    try {
        await query.initialize();
        const result = await query.revokeAddAccess(req.body.userEmail, req.body.adderEmail);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
        console.error(`error on revokeAddAccessRoute: ${error}`);

    }
}

async function getEMR(req, res) {
    // emrID: emrID,
    // userEmail: userEmail
    try {
        await query.initialize();
        const result = await query.getEMR(req.body.emrID, req.body.userEmail);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Nothing is tough");
        console.error(`error on getEMRRoute: ${error}`);
    }
}


init();
