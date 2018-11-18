const express = require('express');
const router = express.Router();

const checkAuth = require('../midlle/check_auth');
const PageController = require('../controllers/page');

router.get('/',PageController.get_list);
router.post('/',checkAuth,PageController.post_content);

module.exports = router;

