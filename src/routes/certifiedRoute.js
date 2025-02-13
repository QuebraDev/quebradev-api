const express = require('express');
const router = express.Router();
const controller = require('../controllers/certified');
const basicAuth = require('express-basic-auth');

router.post('/', basicAuth({
    users: {
        admin: process.env.BASIC_AUTH_PASSWORD || 'quebradev_password'
    }
}), controller.post);

router.get('/:hashId', controller.get);
router.get('/valid/:hashId', controller.getValidHash);
router.get('/valid/:rg', controller.getCertifiedByRG);

module.exports = router;
