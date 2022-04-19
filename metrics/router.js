
const express = require('express');
const router = express.Router();

const predictions_router = require("./routes/predictions");
const search_router = require("./routes/search");


/**      Resource route   =>   metrics.domain.com/...     */


// Gets a list of all user resources
router.use('/predictions', predictions_router);
router.use('/search', search_router);




module.exports = router;
