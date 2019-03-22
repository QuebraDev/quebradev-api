const express = require('express');
const router = express.Router();
const controller = require('../controllers/certified');

router.post('/', controller.post);
router.get('/:hashId', controller.get);

module.exports = router;