
const express = require('express');
const router = express.Router();

const predictions_router = require("./routes/predictions");
const search_router = require("./routes/search");
const location_router = require("./routes/location");


/**      Resource route   =>   metrics.domain.com/...     */


// Gets a list of all user resources
router.use('/predictions', predictions_router);
router.use('/search', search_router);
router.use('/location', location_router);




module.exports = router;
