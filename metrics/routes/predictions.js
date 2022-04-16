
const express = require('express');
const router = express.Router();

const predictions_controller = require("../controllers/predictions");

/**      Resource route   =>   metrics.domain.com/predictions...     */

router.post('/summary',
    predictions_controller.get_summary
);

router.post('/segmentation-type',
    predictions_controller.get_segmentation_type
);

router.post('/api-type',
    predictions_controller.get_api_type
);



module.exports = router;
