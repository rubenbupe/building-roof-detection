
const express = require('express');
const router = express.Router();

const location_controller = require("../controllers/location");

/**      Resource route   =>   metrics.domain.com/location...     */

router.post('/history',
	location_controller.get_history
);



module.exports = router;
