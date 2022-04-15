
const express = require('express');
const router = express.Router();

const predictions_router = require("./routes/predictions");


/**      Resource route   =>   metrics.domain.com/...     */


// Gets a list of all user resources
router.use('/predictions', predictions_router);




module.exports = router;
