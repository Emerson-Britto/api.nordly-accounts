"use strict";
const router = require('express').Router();
const createJson = require('../../adminTools/createJson.js');
const artistsData = require('../../adminTools/artistsData.js');
const randomPlaylists = require('../../adminTools/randomPlaylist.js');
router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200);
    res.end();
});
router.get('/createJson', async (req, res) => {
    const playlistId = req.query.source;
    const key = req.query.key;
    const jsonResult = await createJson(playlistId, key);
    res.json(jsonResult);
});
router.get('/get-data', async (req, res) => {
    const jsonResult = await artistsData(req.query.token);
    res.json(jsonResult);
});
router.get('/get-random-list', async (req, res) => {
    const jsonResult = await randomPlaylists(req.query);
    res.json(jsonResult);
});
module.exports = router;
