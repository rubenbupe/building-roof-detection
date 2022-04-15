
const express = require('express');
const router = express.Router();

const predictions_controller = require("../controllers/predictions");

/**      Resource route   =>   metrics.domain.com/predictions...     */

router.post('/summary',
    predictions_controller.get_summary
);



module.exports = router;
