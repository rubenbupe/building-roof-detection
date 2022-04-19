
const express = require('express');
const router = express.Router();

const search_controller = require("../controllers/search");

/**      Resource route   =>   metrics.domain.com/search...     */

router.post('/history',
	search_controller.get_history
);



module.exports = router;
